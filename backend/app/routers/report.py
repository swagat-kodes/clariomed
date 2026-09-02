from fastapi import APIRouter, UploadFile, File, HTTPException, status
from app.models.schemas import ReportSimplifyResponse, MedicalSummary, LabResultItem
from app.services.pdf_service import pdf_service
from app.services.gemini_service import gemini_service
from app.services.supabase_service import supabase_service
from datetime import datetime
import uuid
import json

router = APIRouter(prefix="/reports", tags=["Reports"])

ALLOWED_MIME_TYPES = {
    "application/pdf",
    "image/png",
    "image/jpeg",
    "image/webp"
}

@router.post("/simplify", response_model=ReportSimplifyResponse)
async def simplify_medical_report(
    file: UploadFile = File(...)
) -> ReportSimplifyResponse:
    """
    Uploads a medical report (PDF or Image), renders pages as images using PyMuPDF if PDF,
    and returns a patient-friendly summary and lab breakdown using Gemini 2.5 Flash.
    """
    if not file.filename:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Uploaded file must have a valid filename."
        )

    content_type = file.content_type or ""
    if content_type not in ALLOWED_MIME_TYPES and not file.filename.lower().endswith(('.pdf', '.png', '.jpg', '.jpeg', '.webp')):
        raise HTTPException(
            status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
            detail=f"Unsupported file type '{content_type}'. Please upload a PDF or image (PNG, JPEG, WebP)."
        )

    try:
        file_bytes = await file.read()
        if not file_bytes:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Uploaded file is empty."
            )

        images = []
        if file.filename.lower().endswith('.pdf') or content_type == "application/pdf":
            try:
                images = pdf_service.render_pdf_to_images(file_bytes)
            except Exception as pdf_err:
                raise HTTPException(
                    status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                    detail=f"Failed to process PDF document: {str(pdf_err)}"
                )
        else:
            mime = content_type if content_type in ALLOWED_MIME_TYPES else "image/png"
            images = [(file_bytes, mime)]

        # Call Gemini service if API key configured, otherwise fallback to demo preview
        try:
            gemini_data = await gemini_service.analyze_medical_report(images)
            
            lab_items = []
            for item in gemini_data.get("lab_results", []):
                lab_items.append(
                    LabResultItem(
                        test_name=item.get("test_name", "Test"),
                        value=item.get("value", "N/A"),
                        reference_range=item.get("reference_range"),
                        status=item.get("status", "Normal"),
                        explanation=item.get("explanation", "")
                    )
                )

            medical_summary = MedicalSummary(
                key_findings=gemini_data.get("key_findings", []),
                simplification=gemini_data.get("simplification", "No summary generated."),
                lab_results=lab_items,
                actionable_questions=gemini_data.get("actionable_questions", [])
            )
        except ValueError as val_err:
            # When GEMINI_API_KEY is not set yet in environment
            medical_summary = MedicalSummary(
                key_findings=[
                    "Report received and parsed by PyMuPDF engine.",
                    "GEMINI_API_KEY environment variable is not configured."
                ],
                simplification="File uploaded and rendered successfully. Add your GEMINI_API_KEY in backend/.env to activate full Gemini 2.5 Flash analysis.",
                lab_results=[
                    LabResultItem(
                        test_name="Hemoglobin (Demo)",
                        value="11.2 g/dL",
                        reference_range="12.0 - 15.5 g/dL",
                        status="Low",
                        explanation="Slightly below average range; could indicate mild fatigue or iron levels."
                    ),
                    LabResultItem(
                        test_name="Total Cholesterol (Demo)",
                        value="210 mg/dL",
                        reference_range="< 200 mg/dL",
                        status="High",
                        explanation="Elevated cholesterol level. Discuss diet and exercise recommendations with your physician."
                    ),
                    LabResultItem(
                        test_name="Glucose (Fast), Plasma (Demo)",
                        value="92 mg/dL",
                        reference_range="70 - 99 mg/dL",
                        status="Normal",
                        explanation="Fasting blood sugar level is within standard healthy bounds."
                    )
                ],
                actionable_questions=[
                    "What lifestyle modifications would be most beneficial for my current lab results?",
                    "When should we schedule follow-up blood work?"
                ]
            )

        report_id = str(uuid.uuid4())

        # Persist to Supabase if configured
        if supabase_service.client:
            try:
                supabase_service.client.table("reports").insert({
                    "id": report_id,
                    "filename": file.filename,
                    "simplification": medical_summary.simplification,
                    "key_findings": medical_summary.key_findings,
                    "actionable_questions": medical_summary.actionable_questions
                }).execute()

                if medical_summary.lab_results:
                    lab_records = [
                        {
                            "report_id": report_id,
                            "test_name": lr.test_name,
                            "observed_value": lr.value,
                            "reference_range": lr.reference_range,
                            "status": lr.status,
                            "explanation": lr.explanation
                        }
                        for lr in medical_summary.lab_results
                    ]
                    supabase_service.client.table("lab_results").insert(lab_records).execute()
            except Exception as sp_err:
                print(f"[Supabase Warning] Unable to persist report: {sp_err}")

        return ReportSimplifyResponse(
            id=report_id,
            filename=file.filename,
            processed_at=datetime.utcnow(),
            summary=medical_summary
        )

    except HTTPException:
        raise
    except Exception as err:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An unexpected error occurred while processing report: {str(err)}"
        )
