import os
import shutil
from fastapi import APIRouter, UploadFile, File, HTTPException
from ..models.schemas import UploadResponse
from ..utils.session import generate_session_id

router = APIRouter()

UPLOAD_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "uploads")

@router.post("/", response_model=UploadResponse)
async def upload_pdf(file: UploadFile = File(...)):
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")

    session_id = generate_session_id()
    session_dir = os.path.join(UPLOAD_DIR, session_id)
    os.makedirs(session_dir, exist_ok=True)
    
    file_path = os.path.join(session_dir, file.filename)
    
    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        # Process PDF and store in Chroma
        from ..services.pdf_processor import pdf_processor
        from ..services.embedding_service import embedding_service
        from ..services.chroma_service import chroma_service
        
        chunks = pdf_processor.process_pdf(file_path)
        if chunks:
            texts = [c["text"] for c in chunks]
            embeddings = embedding_service.generate_embeddings(texts)
            chroma_service.store_chunks(session_id, chunks, embeddings)
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to process file: {str(e)}")
        
    return UploadResponse(session_id=session_id, message=f"Processed {len(chunks)} chunks successfully.")
