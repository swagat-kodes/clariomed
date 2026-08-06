from fastapi import APIRouter
from app.models.schemas import HealthCheckResponse
from app.config import settings

router = APIRouter(tags=["Health"])

@router.get("/health", response_model=HealthCheckResponse)
async def health_check() -> HealthCheckResponse:
    """
    Health check endpoint to verify backend status.
    """
    return HealthCheckResponse(
        status="healthy",
        project=settings.PROJECT_NAME,
        version=settings.VERSION
    )
