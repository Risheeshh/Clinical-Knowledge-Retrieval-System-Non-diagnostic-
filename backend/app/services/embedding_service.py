from sentence_transformers import SentenceTransformer
from typing import List
import numpy as np

class EmbeddingService:
    def __init__(self, model_name: str = "all-MiniLM-L6-v2"):
        self.model = SentenceTransformer(model_name)
        
    def generate_embeddings(self, texts: List[str]) -> List[List[float]]:
        embeddings = self.model.encode(texts)
        # Convert to list of lists of floats for ChromaDB compatibility
        return [list(map(float, emb)) for emb in embeddings]
        
    def generate_embedding(self, text: str) -> List[float]:
        embedding = self.model.encode([text])[0]
        return list(map(float, embedding))

embedding_service = EmbeddingService()
