from fastapi import APIRouter, Header, HTTPException
from pydantic import BaseModel
from supabase import create_client
from openai import OpenAI
import os

router = APIRouter(prefix="/api/v1/generate", tags=["generate"])

supabase = create_client(
    os.getenv("SUPABASE_URL"),
    os.getenv("SUPABASE_SERVICE_ROLE_KEY"),
)

openai_client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
OPENAI_MODEL = os.getenv("OPENAI_MODEL", "gpt-4o-mini")


class GenerateRequest(BaseModel):
    job_description: str
    instructions: str | None = None


def get_user_id(authorization: str):
    if not authorization:
        raise HTTPException(
            status_code=401,
            detail={"message": "Missing auth header", "code": "AUTH_MISSING", "details": []},
        )

    token = authorization.replace("Bearer ", "").strip()
    user = supabase.auth.get_user(token)

    if not user or not user.user:
        raise HTTPException(
            status_code=401,
            detail={"message": "Invalid token", "code": "AUTH_INVALID", "details": []},
        )

    return user.user.id


def load_user_cv(user_id: str) -> dict:
    res = (
        supabase.table("cvs")
        .select("education, work, skills")
        .eq("user_id", user_id)
        .single()
        .execute()
    )

    if not res.data:
        raise HTTPException(
            status_code=400,
            detail={"message": "No CV found. Please save your CV first.", "code": "CV_MISSING", "details": []},
        )

    return {
        "education": res.data.get("education") or "",
        "work": res.data.get("work") or "",
        "skills": res.data.get("skills") or "",
    }


@router.post("")
def generate_cover_letter(payload: GenerateRequest, authorization: str = Header(None)):
    user_id = get_user_id(authorization)

    job_description = (payload.job_description or "").strip()
    instructions = (payload.instructions or "").strip()

    if not job_description:
        raise HTTPException(
            status_code=400,
            detail={"message": "job_description is required", "code": "VALIDATION_ERROR", "details": ["job_description"]},
        )

    cv = load_user_cv(user_id)

    system_prompt = (
        "You are an expert career coach. Write a tailored cover letter for a university/college student. "
        "Output ONLY the letter text. No headings like 'Cover Letter:' and no bullet lists unless requested."
    )

    user_prompt = f"""
CV INFORMATION (student):
Education:
{cv["education"]}

Work Experience:
{cv["work"]}

Skills:
{cv["skills"]}

JOB DESCRIPTION:
{job_description}

OPTIONAL INSTRUCTIONS:
{instructions if instructions else "None"}

Write a professional, application-ready cover letter. Keep it concise, relevant, and specific to the job.
"""

    try:
        completion = openai_client.chat.completions.create(
            model=OPENAI_MODEL,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            temperature=0.7,
        )

        content = (completion.choices[0].message.content or "").strip()

        if not content:
            raise HTTPException(
                status_code=502,
                detail={"message": "Empty AI response", "code": "AI_EMPTY", "details": []},
            )

        return {"data": {"content": content}}

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=502,
            detail={"message": "AI generation failed", "code": "AI_ERROR", "details": [str(e)]},
        )
