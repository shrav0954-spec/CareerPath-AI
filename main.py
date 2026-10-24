from fastapi import FastAPI, UploadFile, File, Form, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional

from app.config import settings
from app.schemas import CareerAnalysisResponse, HealthCheckResponse
from app.services.parser import parse_resume_file
from app.services.ai_service import generate_career_analysis

# Initialize FastAPI application
app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Backend API for CareerPath AI — Resume Parsing, Skill Gap Identification & Career Roadmap Generation."
)

# Configure CORS so the React frontend (running on port 5173 or 3000) can interact with this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class TextAnalysisRequest(BaseModel):
    resume_text: str
    target_role: str

@app.get("/", tags=["General"])
def root():
    """
    Root endpoint verifying the server is active.
    """
    return {
        "project": settings.PROJECT_NAME,
        "status": "online",
        "docs_url": "/docs",
        "message": "Welcome to CareerPath AI API! Visit /docs for interactive Swagger API testing."
    }

@app.get("/api/health", response_model=HealthCheckResponse, tags=["General"])
def health_check():
    """
    Health check endpoint used by the React Navbar to detect backend connectivity.
    Does NOT leak the secret API key; only reports whether an API key is configured.
    """
    has_key = bool(settings.GEMINI_API_KEY and settings.GEMINI_API_KEY != "your_gemini_api_key_here")
    return HealthCheckResponse(
        status="healthy",
        project=settings.PROJECT_NAME,
        version=settings.VERSION,
        llm_configured=has_key,
        gemini_model=settings.GEMINI_MODEL
    )

@app.post(
    "/api/analyze",
    response_model=CareerAnalysisResponse,
    status_code=status.HTTP_200_OK,
    tags=["Analysis"]
)
async def analyze_resume(
    resume: UploadFile = File(..., description="Uploaded resume file (.pdf, .docx, or .txt)"),
    target_role: str = Form(..., description="Target career role (e.g. 'Frontend Developer')")
):
    """
    Main Analysis Endpoint:
    1. Validates and parses uploaded file (.pdf, .docx, .txt).
    2. Extracts clean, readable text.
    3. Analyzes skills against target job requirements using Generative AI.
    4. Returns structured gaps, milestones, projects, certifications, and ATS advice.
    """
    if not target_role.strip():
        raise HTTPException(
            status_code=400,
            detail="Target role cannot be empty. Please select or enter a target job role."
        )

    # Step 1: Extract text from file
    resume_text = await parse_resume_file(resume)

    # Step 2: Run AI Analysis
    analysis_result = await generate_career_analysis(
        resume_text=resume_text,
        target_role=target_role.strip()
    )

    return analysis_result

@app.post(
    "/api/analyze-text",
    response_model=CareerAnalysisResponse,
    status_code=status.HTTP_200_OK,
    tags=["Analysis"]
)
async def analyze_resume_text(request: TextAnalysisRequest):
    """
    Direct text analysis endpoint:
    Allows evaluating a resume by directly pasting text, useful for rapid testing or debugging.
    """
    if len(request.resume_text.strip()) < 50:
        raise HTTPException(
            status_code=400,
            detail="Resume text is too short. Please provide at least 50 characters."
        )

    analysis_result = await generate_career_analysis(
        resume_text=request.resume_text.strip(),
        target_role=request.target_role.strip()
    )

    return analysis_result
