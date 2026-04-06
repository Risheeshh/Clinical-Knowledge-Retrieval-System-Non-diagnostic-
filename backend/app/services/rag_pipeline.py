import os
from google import genai
from typing import List, Dict, Any

from .embedding_service import embedding_service
        
try:
    client = genai.Client(api_key=os.environ.get("GEMINI_API_KEY"))
    MODEL_NAME = "gemini-2.5-flash-lite"
except Exception as e:
    client = None
    print(f"Warning: Failed to initialize Gemini Client. {e}")

class RagPipeline:
    def __init__(self):
        self.prompt_template = """
You are a clinical knowledge retrieval assistant.

STRICT RULES:
* You are NON-DIAGNOSTIC
* Do NOT provide diagnosis
* Do NOT suggest treatments or medications
* Only explain or summarize the provided context
* If the question asks for medical advice, respond: "Please consult a qualified healthcare professional."

Context:
{context}

Question:
{query}
"""

    def generate_answer(self, query: str, context: str) -> str:
        if not client:
            return "Error: Language Model is not configured correctly."
            
        prompt = self.prompt_template.format(context=context, query=query)
        
        try:
            response = client.models.generate_content(
                model=MODEL_NAME,
                contents=prompt
            )
            return response.text
        except Exception as e:
            return f"Failed to generate answer: {str(e)}"

rag_pipeline = RagPipeline()
