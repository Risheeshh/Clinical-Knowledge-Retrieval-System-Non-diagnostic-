from pypdf import PdfReader
from typing import List, Dict

class PdfProcessor:
    def __init__(self, chunk_size: int = 500, chunk_overlap: int = 50):
        self.chunk_size = chunk_size
        self.chunk_overlap = chunk_overlap

    def process_pdf(self, file_path: str) -> List[Dict[str, str]]:
        try:
            reader = PdfReader(file_path)
            chunks = []
            
            for i, page in enumerate(reader.pages):
                text = page.extract_text()
                if not text:
                    continue
                    
                page_chunks = self._chunk_text(text)
                for chunk in page_chunks:
                    chunks.append({
                        "text": chunk,
                        "metadata": {"page": i + 1, "source": file_path}
                    })
                    
            return chunks
        except Exception as e:
            raise ValueError(f"Error processing PDF: {str(e)}")

    def _chunk_text(self, text: str) -> List[str]:
        chunks = []
        start = 0
        text_length = len(text)
        
        while start < text_length:
            end = start + self.chunk_size
            chunks.append(text[start:end])
            start += self.chunk_size - self.chunk_overlap
            
        return chunks

pdf_processor = PdfProcessor()
