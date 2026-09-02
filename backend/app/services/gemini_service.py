from google import genai
from google.genai import types
from app.config import settings
from typing import List, Tuple, Optional, Dict, Any
import os
import json

class GeminiService:
    def __init__(self) -> None:
        self.api_key = settings.GEMINI_API_KEY
        self.client = None

    def _get_client(self) -> genai.Client:
        if not self.client:
            api_key = settings.GEMINI_API_KEY or os.getenv("GEMINI_API_KEY")
            if not api_key:
                raise ValueError("GEMINI_API_KEY environment variable is not configured.")
            self.client = genai.Client(api_key=api_key)
        return self.client

    async def analyze_medical_report(
        self,
        image_streams: List[Tuple[bytes, str]],
        prompt_override: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Sends multi-modal page images to Gemini gemini-2.5-flash for structured medical report simplification.
        Returns a dict matching MedicalSummary schema.
        """
        client = self._get_client()
        
        system_instruction = (
            "You are ClarioMed, an expert and empathetic medical communications AI. Your task is to analyze "
            "uploaded medical laboratory reports and clinical notes. Translate medical terminology into "
            "reassuring, easy-to-understand plain language for patients.\n\n"
            "Return your response ONLY as a JSON object with the following strict structure:\n"
            "{\n"
            '  "simplification": "A comprehensive, empathetic, patient-friendly explanation of the report.",\n'
            '  "key_findings": ["Bullet point 1", "Bullet point 2"],\n'
            '  "lab_results": [\n'
            "    {\n"
            '      "test_name": "Name of test (e.g. Hemoglobin)",\n'
            '      "value": "Observed value with units (e.g. 11.2 g/dL)",\n'
            '      "reference_range": "Normal range (e.g. 12.0 - 15.5 g/dL)",\n'
            '      "status": "High" | "Low" | "Normal",\n'
            '      "explanation": "Clear, plain-language explanation of what this specific value means for the patient."\n'
            "    }\n"
            "  ],\n"
            '  "actionable_questions": ["Question for doctor visit 1", "Question 2"]\n'
            "}"
        )

        contents = []
        for img_bytes, mime_type in image_streams:
            contents.append(
                types.Part.from_bytes(
                    data=img_bytes,
                    mime_type=mime_type
                )
            )
            
        user_prompt = prompt_override or (
            "Please analyze this medical report image(s). Extract key findings, provide a simplified summary, "
            "list all lab results with status (High, Low, Normal), and suggest 3-5 questions the patient can ask their doctor."
        )
        contents.append(user_prompt)

        config = types.GenerateContentConfig(
            system_instruction=system_instruction,
            temperature=0.2,
            response_mime_type="application/json"
        )

        response = client.models.generate_content(
            model=settings.GEMINI_MODEL,
            contents=contents,
            config=config,
        )

        raw_text = response.text or "{}"
        try:
            return json.loads(raw_text)
        except json.JSONDecodeError:
            # Fallback parsing in case response contains Markdown wrapped json
            cleaned = raw_text.strip()
            if cleaned.startswith("```json"):
                cleaned = cleaned[7:]
            if cleaned.endswith("```"):
                cleaned = cleaned[:-3]
            return json.loads(cleaned.strip())

gemini_service = GeminiService()
