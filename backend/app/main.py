from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(
    title="Clinical Knowledge Retrieval System (Non-diagnostic)",
    description="A non-diagnostic retrieval system for clinical documents using RAG.",
    version="1.0.0"
)

# Configure CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://clinical-knowledge-retrieval-system.vercel.app"], # In production, restrict to frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from app.routes import upload, query

app.include_router(upload.router, prefix="/api/upload", tags=["Upload"])
app.include_router(query.router, prefix="/api/query", tags=["Query"])

@app.get("/")
def read_root():
    return {"message": "Welcome to the CKRS Backend API."}
