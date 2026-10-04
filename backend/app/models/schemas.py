from typing import List, Optional
from pydantic import BaseModel, Field
from datetime import datetime

class LabStatusEnum(str):
    HIGH = "High"
    LOW = "Low"
    NORMAL = "Normal"

class LabResultItem(BaseModel):
    test_name: str = Field(..., description="Name of the laboratory test")
    value: str = Field(..., description="Observed result value")
    reference_range: Optional[str] = Field(None, description="Standard reference range")
    status: str = Field(..., description="Status: High, Low, or Normal")
    explanation: str = Field(..., description="Patient-friendly plain language explanation")

class MedicalSummary(BaseModel):
    key_findings: List[str] = Field(default_factory=list, description="Core insights from medical report")
    simplification: str = Field(..., description="Easy-to-understand summary for patients")
    lab_results: List[LabResultItem] = Field(default_factory=list, description="Extracted lab results")
    actionable_questions: List[str] = Field(default_factory=list, description="Questions for doctor visit")

class ReportSimplifyResponse(BaseModel):
    id: str = Field(..., description="Unique report identifier")
    filename: str = Field(..., description="Uploaded file name")
    processed_at: datetime = Field(default_factory=datetime.utcnow, description="Processing timestamp")
    summary: MedicalSummary = Field(..., description="Simplification & extracted lab data")

class HealthCheckResponse(BaseModel):
    status: str = Field(..., example="healthy")
    project: str = Field(..., example="ClarioMed API")
    version: str = Field(..., example="0.1.0")

class ChatRequest(BaseModel):
    message: str = Field(..., description="User question for medical AI assistant")
    language: str = Field(default="en", description="Target language: en, hi, mr")
    report_context: Optional[dict] = Field(None, description="Optional medical report context")

class ChatResponse(BaseModel):
    reply: str = Field(..., description="AI response text")
    is_refusal: bool = Field(default=False, description="True if prompt was non-medical and refused")

