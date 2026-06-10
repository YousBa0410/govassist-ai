from fastapi import APIRouter
from pydantic import BaseModel
from app.api.chat_service import chat

router = APIRouter()


class ChatRequest(BaseModel):
    message: str

@router.post("/chat")
def chat_endpoint(request: ChatRequest):
    return chat(request.message)