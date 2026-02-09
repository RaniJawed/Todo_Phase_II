from pydantic import BaseModel
from typing import Literal

class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    message: str
    role: Literal["assistant", "user"] = "assistant"
