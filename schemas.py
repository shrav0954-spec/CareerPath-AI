from pydantic import BaseModel, Field
from typing import List, Optional

class RoadmapPhase(BaseModel):
    phase_title: str = Field(..., description="e.g. Phase 1: Core Fundamentals & TypeScript")
    duration: str = Field(..., description="e.g. Weeks 1-2")
    focus_areas: List[str] = Field(default_factory=list, description="Key concepts to master")
    actionable_tasks: List[str] = Field(default_factory=list, description="Concrete hands-on tasks")
    recommended_resources: List[str] = Field(default_factory=list, description="Free docs, courses, or tutorials")

class ProjectRecommendation(BaseModel):
    title: str = Field(..., description="Project name")
    tech_stack: str = Field(..., description="Technologies and libraries used")
    description: str = Field(..., description="What the project does and why recruiters care")
    learning_outcomes: List[str] = Field(default_factory=list, description="Skills demonstrated by this project")

class SkillComparison(BaseModel):
    matched_skills: List[str] = Field(default_factory=list, description="Skills detected on resume that match the role")
    missing_skills: List[str] = Field(default_factory=list, description="Crucial industry skills missing from the resume")
    bonus_skills: List[str] = Field(default_factory=list, description="Complementary or transferable skills found")

class CertificationRecommendation(BaseModel):
    name: str = Field(..., description="Name of certification")
    provider: str = Field(..., description="Provider (e.g., Coursera, AWS, Meta, freeCodeCamp)")
    level: str = Field("Beginner to Intermediate", description="Difficulty level")

class CareerAnalysisResponse(BaseModel):
    candidate_name: Optional[str] = Field(None, description="Extracted candidate name if detected")
    target_role: str = Field(..., description="The role being evaluated against")
    overall_match_score: int = Field(..., ge=0, le=100, description="Readiness score from 0 to 100%")
    executive_summary: str = Field(..., description="High-level summary of candidate strengths and key gaps")
    skills_analysis: SkillComparison
    learning_roadmap: List[RoadmapPhase]
    recommended_projects: List[ProjectRecommendation]
    recommended_certifications: List[CertificationRecommendation]
    resume_improvement_suggestions: List[str] = Field(
        default_factory=list, 
        description="Actionable bullet-point improvements with strong action verbs & metrics"
    )
    is_mock_fallback: bool = Field(False, description="True if mock data was returned because no API key was provided")

class HealthCheckResponse(BaseModel):
    status: str
    project: str
    version: str
    llm_configured: bool
    gemini_model: str
