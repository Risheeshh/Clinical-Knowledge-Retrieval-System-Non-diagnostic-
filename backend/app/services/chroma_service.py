import os
import chromadb
from typing import List, Dict, Any

CHROMA_DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "chroma_data")

class ChromaService:
    def __init__(self):
        os.makedirs(CHROMA_DATA_DIR, exist_ok=True)
        self.client = chromadb.PersistentClient(path=CHROMA_DATA_DIR)

    def store_chunks(self, session_id: str, chunks: List[Dict[str, Any]], embeddings: List[List[float]]):
        collection_name = f"session_{session_id}"
        # Get or create collection
        collection = self.client.get_or_create_collection(name=collection_name)
        
        # Prepare data for Chroma
        ids = [f"chunk_{i}" for i in range(len(chunks))]
        documents = [chunk["text"] for chunk in chunks]
        metadatas = [chunk["metadata"] for chunk in chunks]
        
        # Add to collection
        collection.add(
            ids=ids,
            embeddings=embeddings,
            documents=documents,
            metadatas=metadatas
        )

    def retrieve_context(self, session_id: str, query_embedding: List[float], n_results: int = 3) -> str:
        collection_name = f"session_{session_id}"
        try:
            collection = self.client.get_collection(name=collection_name)
        except Exception:
            return "" # Collection might not exist if empty upload
            
        results = collection.query(
            query_embeddings=[query_embedding],
            n_results=n_results
        )
        
        if not results["documents"] or not results["documents"][0]:
            return ""
            
        # Join retrieved documents
        context = "\n".join(results["documents"][0])
        return context
        
    def get_sources(self, session_id: str, query_embedding: List[float], n_results: int = 3) -> List[Dict[str, Any]]:
        collection_name = f"session_{session_id}"
        try:
            collection = self.client.get_collection(name=collection_name)
        except Exception:
            return []
            
        results = collection.query(
            query_embeddings=[query_embedding],
            n_results=n_results
        )
        
        if not results["metadatas"] or not results["metadatas"][0]:
            return []
            
        return results["metadatas"][0]

chroma_service = ChromaService()
