from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI

from app.api.cv import router as cv_router
from app.api.generate import router as generate_router
from app.api.cover_letters import router as cover_letters_router

app = FastAPI(title="CVAI Turbo v2 API")

@app.get("/health")
def health():
    return {"data": {"status": "ok"}}

app.include_router(cv_router)
app.include_router(generate_router)
app.include_router(cover_letters_router)
