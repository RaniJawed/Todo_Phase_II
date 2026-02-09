from fastapi import APIRouter
from ..schemas.chat import ChatRequest, ChatResponse
import time
import asyncio

router = APIRouter()

@router.post("/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    """
    Simple chat endpoint that provides predetermined responses based on keywords.
    """
    message = request.message.lower()
    
    # Simulate thinking delay
    await asyncio.sleep(1)
    
    if "hello" in message or "hi" in message:
        return ChatResponse(message="Hello there! Welcome to Mohsin's Todo App. How are you today?")
    
    if "name" in message:
        return ChatResponse(message="My name is Mohsin's Assistant. I'm here to help you manage your tasks.")
        
    if "project" in message or "todo" in message:
        return ChatResponse(message="This is a full-stack task management application designed by Mohsin Raza. It features a Next.js frontend and FastAPI backend.")
        
    if "help" in message:
        return ChatResponse(message="I can help you understand this application. You can ask me about the project, the author, or how to use the features.")
        
    return ChatResponse(message="I'm here to help! What can I do for you today?")
