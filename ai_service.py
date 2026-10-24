import json
import re
import httpx
from fastapi import HTTPException
from app.config import settings
from app.schemas import CareerAnalysisResponse

SYSTEM_INSTRUCTION = """
You are an expert Technical Career Coach and Senior Technical Recruiter specializing in early-career talent, university graduates, and students.
Your job is to critically evaluate a candidate's resume against their target industry role, identify skill gaps, provide honest benchmark scoring, and give a highly actionable, structured career acceleration roadmap.

You MUST respond strictly with a valid JSON object matching the requested schema. Do not add markdown explanation outside the JSON.
"""

def build_user_prompt(resume_text: str, target_role: str) -> str:
    return f"""
TARGET JOB ROLE: {target_role}

--- RESUME CONTENT ---
{resume_text}
--- END RESUME CONTENT ---

Evaluate this resume for the role of "{target_role}".
Return a JSON object with this exact structure:
{{
  "candidate_name": "Detected full name or null",
  "target_role": "{target_role}",
  "overall_match_score": 65,  // Integer between 0 and 100 based on realistic industry standards
  "executive_summary": "2-3 concise sentences summarizing key strengths and primary gaps for this target role.",
  "skills_analysis": {{
    "matched_skills": ["Skill 1", "Skill 2", ...],  // Skills present on resume that fit the role
    "missing_skills": ["Missing Crucial Skill 1", "Missing Skill 2", ...],  // Skills expected by recruiters that are absent
    "bonus_skills": ["Bonus/Transferable Skill 1", ...]  // Other valuable skills found on resume
  }},
  "learning_roadmap": [
    {{
      "phase_title": "Phase 1: Foundational Core",
      "duration": "Weeks 1-2",
      "focus_areas": ["Key Concept 1", "Key Concept 2"],
      "actionable_tasks": ["Concrete task 1", "Concrete task 2"],
      "recommended_resources": ["Documentation link or tutorial name", ...]
    }},
    {{
      "phase_title": "Phase 2: Intermediate Tools & Frameworks",
      "duration": "Weeks 3-4",
      "focus_areas": [...],
      "actionable_tasks": [...],
      "recommended_resources": [...]
    }},
    {{
      "phase_title": "Phase 3: Advanced Concepts & Production Readiness",
      "duration": "Weeks 5-6",
      "focus_areas": [...],
      "actionable_tasks": [...],
      "recommended_resources": [...]
    }}
  ],
  "recommended_projects": [
    {{
      "title": "Portfolio Project 1",
      "tech_stack": "Framework, Database, Tools",
      "description": "Specific project idea addressing the missing skills that stands out on a resume.",
      "learning_outcomes": ["Skill demonstrated 1", "Skill demonstrated 2"]
    }},
    {{
      "title": "Portfolio Project 2",
      "tech_stack": "Tools used",
      "description": "Another hands-on application to prove industry competence.",
      "learning_outcomes": [...]
    }}
  ],
  "recommended_certifications": [
    {{
      "name": "Recognized Certification Name",
      "provider": "AWS / Meta / Coursera / Google / Linux Foundation",
      "level": "Beginner to Intermediate"
    }}
  ],
  "resume_improvement_suggestions": [
    "Rewriting suggestion 1: Replace passive phrases with quantifiable metrics (e.g. 'Reduced API latency by 25%').",
    "Rewriting suggestion 2: Specific ATS keyword injection tips.",
    "Rewriting suggestion 3: Structural or formatting improvement."
  ]
}}
"""

def get_mock_analysis(target_role: str) -> CareerAnalysisResponse:
    """
    Provides a rich, realistic fallback analysis when no API key is configured yet.
    Allows students to test the full pipeline immediately.
    """
    return CareerAnalysisResponse(
        candidate_name="Student Candidate",
        target_role=target_role,
        overall_match_score=68,
        executive_summary=(
            f"Candidate shows solid academic fundamentals and basic programming proficiency. "
            f"To be competitive for junior {target_role} positions, they need more hands-on production experience, "
            f"modern testing practices, and deployed portfolio projects."
        ),
        skills_analysis={
            "matched_skills": ["Python / JavaScript Basics", "Git Version Control", "SQL & Relational DBs", "REST APIs"],
            "missing_skills": [
                f"Production {target_role} Architecture",
                "Automated Testing (Unit & Integration)",
                "Docker & Containerization",
                "CI/CD Pipelines (GitHub Actions)",
                "Cloud Deployment (AWS / GCP / Vercel)"
            ],
            "bonus_skills": ["Problem Solving / Algorithms", "Agile Teamwork", "Technical Writing"]
        },
        learning_roadmap=[
            {
                "phase_title": "Phase 1: Deep Dive into Core Ecosystem",
                "duration": "Weeks 1-2",
                "focus_areas": ["Advanced Language Features", "Design Patterns", "Clean Code"],
                "actionable_tasks": [
                    "Build a modular CLI or API applying SOLID principles",
                    "Refactor legacy university assignments into cleanly structured modules"
                ],
                "recommended_resources": ["Official Documentation", "freeCodeCamp", "roadmap.sh"]
            },
            {
                "phase_title": "Phase 2: Testing, State & Databases",
                "duration": "Weeks 3-4",
                "focus_areas": ["Unit Testing", "Database Indexing & ORMs", "API Authentication (JWT)"],
                "actionable_tasks": [
                    "Add 80%+ test coverage to an existing project with PyTest / Vitest",
                    "Implement secure JWT authentication and role-based access control"
                ],
                "recommended_resources": ["FastAPI / React Official Tutorials", "TestDriven.io"]
            },
            {
                "phase_title": "Phase 3: Docker & Cloud Deployment",
                "duration": "Weeks 5-6",
                "focus_areas": ["Containerization", "CI/CD Workflows", "Cloud Hosting"],
                "actionable_tasks": [
                    "Containerize the application using Docker and Docker Compose",
                    "Set up GitHub Actions to automatically run linter and tests on pull requests"
                ],
                "recommended_resources": ["Docker Getting Started Guide", "GitHub Actions Documentation"]
            }
        ],
        recommended_projects=[
            {
                "title": f"Full-Stack {target_role} Capstone System",
                "tech_stack": "React, FastAPI, PostgreSQL, Docker, GitHub Actions",
                "description": "An end-to-end web application with authenticated users, database migrations, and automated deployment.",
                "learning_outcomes": ["Full-stack integration", "Secure authentication", "Containerized deployment"]
            },
            {
                "title": "Cloud-Native Micro-Service or Dashboard",
                "tech_stack": "Python, Redis / WebSockets, Tailwind CSS",
                "description": "Demonstrates real-time events, caching strategies, and responsive UI components.",
                "learning_outcomes": ["Event-driven design", "Caching optimization", "Performance tuning"]
            }
        ],
        recommended_certifications=[
            {
                "name": "AWS Certified Cloud Practitioner or Solutions Architect Associate",
                "provider": "Amazon Web Services",
                "level": "Beginner to Intermediate"
            },
            {
                "name": "Meta Professional Developer Certificate",
                "provider": "Coursera / Meta",
                "level": "Beginner"
            }
        ],
        resume_improvement_suggestions=[
            "Quantify achievements: Change 'built a website' to 'Developed full-stack web app supporting 50+ concurrent users with sub-200ms latency'.",
            "Create a prominent 'Technical Skills' grid categorized by: Languages, Frameworks, Developer Tools, and Databases.",
            "Include live GitHub and deployed demo URLs for each major project on your resume.",
            "Remove generic soft-skill lists ('hard worker', 'good communicator') and instead demonstrate them through project descriptions."
        ],
        is_mock_fallback=True
    )

async def generate_career_analysis(resume_text: str, target_role: str) -> CareerAnalysisResponse:
    """
    Sends the parsed resume text and target role to Gemini API,
    validates the output, and returns structured career guidance.
    """
    api_key = settings.GEMINI_API_KEY

    # If no real API key is set, return realistic mock analysis
    if not api_key or api_key == "your_gemini_api_key_here":
        return get_mock_analysis(target_role)

    prompt = build_user_prompt(resume_text, target_role)

    # Google Gemini REST API endpoint
    endpoint_url = (
        f"https://generativelanguage.googleapis.com/v1beta/models/"
        f"{settings.GEMINI_MODEL}:generateContent"
    )

    request_payload = {
        "contents": [
            {
                "role": "user",
                "parts": [{"text": prompt}]
            }
        ],
        "systemInstruction": {
            "parts": [{"text": SYSTEM_INSTRUCTION}]
        },
        "generationConfig": {
            "temperature": 0.2,
            "responseMimeType": "application/json"
        }
    }

    try:
        async with httpx.AsyncClient(timeout=120.0) as client:
            response = await client.post(endpoint_url,
             json=request_payload,
            headers={"x-goog-api-key":api_key}
             )

        if response.status_code != 200:
            error_details = response.text
            # If model name or API key is invalid, raise informative error
            if response.status_code == 400 and "API_KEY_INVALID" in error_details:
                raise HTTPException(
                    status_code=401,
                    detail="The provided GEMINI_API_KEY in backend/.env is invalid. Please verify your key at https://aistudio.google.com/app/apikey"
                )
            raise HTTPException(
                status_code=502,
                detail=f"Gemini API returned error {response.status_code}: {error_details}"
            )

        data = response.json()
        candidates = data.get("candidates", [])
        if not candidates:
            raise HTTPException(status_code=502, detail="No response generated by AI model.")

        raw_content = candidates[0]["content"]["parts"][0]["text"].strip()

        # Clean code fence wrappers if present
        clean_json_str = re.sub(r"^```json\s*", "", raw_content, flags=re.MULTILINE)
        clean_json_str = re.sub(r"```$", "", clean_json_str, flags=re.MULTILINE).strip()

        parsed_dict = json.loads(clean_json_str)
        analysis_result = CareerAnalysisResponse(**parsed_dict)
        analysis_result.is_mock_fallback = False
        return analysis_result

    except json.JSONDecodeError as jde:
        raise HTTPException(
            status_code=500,
            detail=f"AI model did not return valid JSON. Error: {str(jde)}"
        )
    except httpx.RequestError as req_err:
            print("Gemini connection error:", repr(req_err))
            raise HTTPException(
                status_code=504,
                detail=f"Network error communicating with AI API: {type(req_err).__name__}: {str(req_err)}"
            )
