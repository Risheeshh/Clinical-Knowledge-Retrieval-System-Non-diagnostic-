from pydantic import BaseModel

class UploadResponse(BaseModel):
    session_id: str
    message: str

class QueryRequest(BaseModel):
    session_id: str
    query: str

class SourceMetadata(BaseModel):
    page: int
    source: str
    text: str

class QueryResponse(BaseModel):
    answer: str
    sources: list[SourceMetadata]
