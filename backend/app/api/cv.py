from dotenv import load_dotenv
load_dotenv()  # 👈 MÅ ligge øverst, før create_client

from fastapi import APIRouter, Header, HTTPException
from supabase import create_client
import os

# -------------------------
# Router
# -------------------------
router = APIRouter(
    prefix="/api/v1/cv",
    tags=["cv"]
)

# -------------------------
# Supabase client
# -------------------------
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

if not SUPABASE_URL or not SUPABASE_SERVICE_ROLE_KEY:
    raise RuntimeError("SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is missing")

supabase = create_client(
    SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY,
)

# -------------------------
# Helpers
# -------------------------
def get_user_id(authorization: str) -> str:
    if not authorization:
        raise HTTPException(status_code=401, detail="Missing Authorization header")

    token = authorization.replace("Bearer ", "").strip()

    try:
        user_response = supabase.auth.get_user(token)
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")

    if not user_response or not user_response.user:
        raise HTTPException(status_code=401, detail="Invalid token")

    return user_response.user.id


# -------------------------
# Routes
# -------------------------
@router.get("")
def get_cv(authorization: str = Header(None)):
    user_id = get_user_id(authorization)

    res = (
        supabase
        .table("cvs")
        .select("*")
        .eq("user_id", user_id)
        .single()
        .execute()
    )

    return {
        "data": res.data
    }


@router.post("")
def save_cv(payload: dict, authorization: str = Header(None)):
    user_id = get_user_id(authorization)

    payload["user_id"] = user_id

    res = (
        supabase
        .table("cvs")
        .upsert(payload)
        .execute()
    )

    return {
        "data": res.data
    }

