from fastapi import APIRouter, UploadFile, File, Form, HTTPException, status
from app.models.schemas import (
    ReportSimplifyResponse,
    MedicalSummary,
    LabResultItem,
    ChatRequest,
    ChatResponse,
)
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
    file: UploadFile = File(...),
    language: str = Form("en")
) -> ReportSimplifyResponse:
    """
    Uploads a medical report (PDF or Image), renders pages as images using PyMuPDF if PDF,
    and returns a patient-friendly summary and lab breakdown using Gemini 2.5 Flash in the selected language.
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

        # Call Gemini service with language preference
        try:
            gemini_data = await gemini_service.analyze_medical_report(images, language=language)

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
            # Fallback when GEMINI_API_KEY is not set yet in environment
            demo_simplifications = {
                "hi": "फ़ाइल सफलतापूर्वक अपलोड की गई। यह एक डेमो मेडिकल रिपोर्ट सारांश है। पूरी जेमिनी 2.5 एनालिसिस एक्टिवेट करने के लिए backend/.env में अपनी GEMINI_API_KEY जोड़ें।",
                "mr": "फाईल यशस्वीरित्या अपलोड झाली. हा डेमो वैद्यकीय अहवाल सारांश आहे. संपूर्ण जेमिनी २.५ विश्लेषण सुरू करण्यासाठी backend/.env मध्ये आपली GEMINI_API_KEY जोडा.",
                "en": "File uploaded successfully. Add your GEMINI_API_KEY in backend/.env to activate full Gemini 2.5 Flash analysis."
            }
            demo_findings = {
                "hi": ["रिपोर्ट PyMuPDF इंजन द्वारा प्रोसेस की गई।", "हीमोग्लोबिन स्तर सामान्य सीमा से थोड़ा कम है।"],
                "mr": ["अहवाल PyMuPDF द्वारे विश्लेषित केला गेला.", "हिमोग्लोबिन पातळी सामान्य मर्यादेपेक्षा थोडी कमी आहे."],
                "en": ["Report received and parsed by PyMuPDF engine.", "Hemoglobin is slightly below reference range."]
            }

            medical_summary = MedicalSummary(
                key_findings=demo_findings.get(language, demo_findings["en"]),
                simplification=demo_simplifications.get(language, demo_simplifications["en"]),
                lab_results=[
                    LabResultItem(
                        test_name="Hemoglobin",
                        value="11.2 g/dL",
                        reference_range="12.0 - 15.5 g/dL",
                        status="Low",
                        explanation="Slightly below average range; could indicate mild fatigue or iron levels."
                    ),
                    LabResultItem(
                        test_name="Total Cholesterol",
                        value="210 mg/dL",
                        reference_range="< 200 mg/dL",
                        status="High",
                        explanation="Elevated cholesterol level. Discuss diet and exercise recommendations with your physician."
                    ),
                    LabResultItem(
                        test_name="Glucose (Fasting)",
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

@router.post("/chat", response_model=ChatResponse)
async def chat_with_medical_ai(request: ChatRequest) -> ChatResponse:
    """
    AI Medical Assistant endpoint. Strictly answers medical and health report questions.
    Rejects non-medical prompts politely in the user's selected language.
    """
    try:
        result = await gemini_service.answer_medical_chat(
            message=request.message,
            language=request.language,
            report_context=request.report_context
        )
        return ChatResponse(
            reply=result["reply"],
            is_refusal=result.get("is_refusal", False)
        )
    except ValueError:
        # Fallback response when GEMINI_API_KEY is not set
        fallback_refusals = {
            "hi": "मैं क्लेरियोमेड का एआई मेडिकल सहायक हूँ। मैं केवल चिकित्सा, स्वास्थ्य रिपोर्ट और लैब परीक्षण प्रश्नों का उत्तर देने के लिए विशेषीकृत हूँ। कृपया कोई स्वास्थ्य या मेडिकल रिपोर्ट संबंधी प्रश्न पूछें।",
            "mr": "मी क्लेरिओमेडचा एआय वैद्यकीय सहाय्यक आहे. मी फक्त वैद्यकीय, आरोग्य अहवाल आणि प्रयोगशाळा चाचणी प्रश्नांची उत्तरे देण्यासाठी समर्पित आहे. कृपया कोणताही आरोग्य किंवा वैद्यकीय अहवाल संबंधित प्रश्न विचारा.",
            "en": "I am ClarioMed's AI Medical Assistant. I am specialized strictly to answer medical, health report, and laboratory test questions. Please ask me a health or medical report question."
        }
        fallback_answers = {
            "hi": f"चिकित्सा परामर्श: आपके प्रश्न '{request.message}' के संबंध में, लैब परिणामों में यह मान आपके अंगों और चयापचय की स्थिति दिखाता है। अधिक जानकारी के लिए अपने डॉक्टर से संपर्क करें।",
            "mr": f"वैद्यकीय सल्ला: तुमच्या '{request.message}' प्रश्नाबाबत, लॅब अहवालातील हे घटक शरीरातील चयापचय स्थिती स्पष्ट करतात. अधिक सल्ल्यासाठी डॉक्टरांना भेट द्या.",
            "en": f"Medical Guidance for '{request.message}': Laboratory parameters provide insights into physiological balance. Always verify findings with your healthcare provider."
        }

        # Check for non-medical keywords
        msg_lower = request.message.lower()
        non_med_keywords = ['code', 'python', 'javascript', 'cricket', 'football', 'movie', 'joke', 'song', 'weather']
        is_refusal = any(k in msg_lower for k in non_med_keywords)

        if is_refusal:
            reply_text = fallback_refusals.get(request.language, fallback_refusals["en"])
        else:
            reply_text = fallback_answers.get(request.language, fallback_answers["en"])

        return ChatResponse(reply=reply_text, is_refusal=is_refusal)
    except Exception as err:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Chat execution failed: {str(err)}"
        )
