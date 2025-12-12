from fastapi import APIRouter, Header, HTTPException
from pydantic import BaseModel
from supabase import create_client
import os

router = APIRouter(
    prefix="/api/v1/cover-letters",
    tags=["cover-letters"]
)

supabase = create_client(
    os.getenv("SUPABASE_URL"),
    os.getenv("SUPABASE_SERVICE_ROLE_KEY"),
)

class SaveCoverLetter(BaseModel):
    content: str
    version: int

def get_user_id(authorization: str):
    if not authorization:
        raise HTTPException(status_code=401, detail="Missing auth")

    token = authorization.replace("Bearer ", "")
    user = supabase.auth.get_user(token)

    if not user or not user.user:
        raise HTTPException(status_code=401, detail="Invalid token")

    return user.user.id

@router.post("")
def save_cover_letter(
    payload: SaveCoverLetter,
    authorization: str = Header(None),
):
    user_id = get_user_id(authorization)

    res = supabase.table("cover_letters").insert({
        "user_id": user_id,
        "content": payload.content,
        "version": payload.version,
    }).execute()

    return {"data": res.data}
