from uuid import uuid4

from fastapi import APIRouter
from pydantic import BaseModel

from app.api.chat_service import chat

router = APIRouter()


class ChatRequest(BaseModel):
    session_id: str | None = None
    message: str


@router.post("/chat")
def chat_endpoint(request: ChatRequest):

    session_id = request.session_id or str(uuid4())
    return chat(
        session_id=session_id,
        message=request.message
    )