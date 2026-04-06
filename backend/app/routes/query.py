from fastapi import APIRouter, HTTPException
from ..models.schemas import QueryRequest, QueryResponse
from ..services.chroma_service import chroma_service
from ..services.embedding_service import embedding_service
from ..services.rag_pipeline import rag_pipeline

router = APIRouter()

@router.post("/", response_model=QueryResponse)
async def query_system(request: QueryRequest):
    try:
        # Generate embedding for the query
        query_emb = embedding_service.generate_embedding(request.query)
        
        # Retrieve context from Chroma
        context = chroma_service.retrieve_context(request.session_id, query_emb, n_results=3)
        
        # Retrieve sources from Chroma
        sources_meta = chroma_service.get_sources(request.session_id, query_emb, n_results=3)
        sources = [{"page": meta.get("page", 0), "source": meta.get("source", "Unknown")} for meta in sources_meta]
        
        # Generate Answer
        if not context:
            answer = "I don't have enough context from the documents to answer this question. Please upload relevant clinical documents."
        else:
            answer = rag_pipeline.generate_answer(request.query, context)
            
        return QueryResponse(answer=answer, sources=sources)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Query failed: {str(e)}")
