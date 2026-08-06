from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.routers import health, report

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Medical Report Simplifier API powered by FastAPI, PyMuPDF, and Google Gemini"
)

# Configure CORS Middleware explicitly
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(health.router, prefix=settings.API_V1_STR)
app.include_router(report.router, prefix=settings.API_V1_STR)

@app.get("/")
async def root():
    return {
        "message": "Welcome to ClarioMed API",
        "health_check": f"{settings.API_V1_STR}/health",
        "docs": "/docs"
    }
