# CVAI – AI-based Cover Letter Generator

CVAI is a full-stack web application that helps users generate professional and tailored cover letters based on their own CV and a job advertisement.
The application uses a third-party Large Language Model (LLM) to produce high-quality job applications with minimal effort from the user.

This project is delivered as part of Phase 4 and focuses on functionality, structure and practical usability.

---

## How the application works

1. The user logs in or creates an account
2. The user uploads or pastes their CV (plain text)
3. The user adds a job advertisement (plain text)
4. Optional instructions can be provided to adjust tone or style
5. The backend sends the data to an LLM
6. A tailored cover letter is generated and shown in the UI

---

## Project structure

cvai-turbo-v2/
├── frontend/    Next.js frontend
├── backend/     FastAPI backend
└── README.md

---

## Frontend

Tech stack:
- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Supabase Authentication
- shadcn/ui

Start frontend:

cd frontend
npm install
npm run dev

Frontend runs on:
http://localhost:3000

---

## Backend

Tech stack:
- Python
- FastAPI
- Uvicorn
- Third-party LLM integration

Required Python libraries:
- fastapi
- uvicorn
- python-dotenv
- requests

Start backend:

cd backend
python -m venv .venv
.\.venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload

Backend runs on:
http://localhost:8000

API documentation:
http://localhost:8000/docs

---

## Features

- User authentication
- Create, update and delete a single CV (plain text)
- CV profile section
- Job advertisement input
- Optional instructions for tone and style
- AI-generated cover letters
- Multiple generated versions per job application

---

## Project status

This project is a functional prototype intended for academic delivery and demonstration purposes.
Focus has been placed on clean structure, working flow and realistic user interaction.

---

## Author

Abdullah Michael Moulay
