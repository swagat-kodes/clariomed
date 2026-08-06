from google import genai
from google.genai import types
from app.config import settings
from typing import List, Tuple, Optional
import os

class GeminiService:
    def __init__(self) -> None:
        self.api_key = settings.GEMINI_API_KEY
        self.client = None
        if self.api_key:
            self.client = genai.Client(api_key=self.api_key)

    def _get_client() -> genai.Client:
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
    ) -> str:
        """
        Sends multi-modal page images to Gemini gemini-2.5-flash for structured medical report simplification.
        """
        client = self._get_client()
        
        system_instruction = (
            "You are ClarioMed, an empathetic medical communications expert. Your mission is to "
            "translate complex medical laboratory reports and clinical notes into simple, clear, "
            "and reassuring language for patients. Always extract lab tests, their status (High, Low, Normal), "
            "and provide plain-language explanations. Never issue a formal diagnostic order; emphasize consulting their doctor."
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
        )

        response = client.models.generate_content(
            model=settings.GEMINI_MODEL,
            contents=contents,
            config=config,
        )
        return response.text

gemini_service = GeminiService()
