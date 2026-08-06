from fastapi import APIRouter, UploadFile, File, HTTPException, status
from app.models.schemas import ReportSimplifyResponse, MedicalSummary, LabResultItem
from app.services.pdf_service import pdf_service
from app.services.gemini_service import gemini_service
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

        # Call Gemini service if API key configured, otherwise return clear stub feedback
        try:
            analysis_raw = await gemini_service.analyze_medical_report(images)
            
            # For demonstration & structured mapping:
            medical_summary = MedicalSummary(
                key_findings=[
                    "Report received and processed successfully.",
                    "Analyzed multi-modal report page(s)."
                ],
                simplification=analysis_raw,
                lab_results=[],
                actionable_questions=[
                    "What do these lab values mean for my daily routine?",
                    "Do I need any follow-up blood tests in 3 to 6 months?"
                ]
            )
        except ValueError as val_err:
            # When GEMINI_API_KEY is not set yet in environment
            medical_summary = MedicalSummary(
                key_findings=[
                    "Backend scaffolding active. GEMINI_API_KEY needs to be configured in .env."
                ],
                simplification="File received successfully. Configure GEMINI_API_KEY in backend/.env to view live AI medical report simplifications.",
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
                    )
                ],
                actionable_questions=[
                    "Should I adjust my diet or exercise regimen?",
                    "When should we re-check these levels?"
                ]
            )

        report_id = str(uuid.uuid4())
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
