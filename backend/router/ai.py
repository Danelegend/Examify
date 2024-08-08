from typing import Annotated, Optional
from fastapi import APIRouter, HTTPException, Response, Security, status, UploadFile, Form, File

from functionality.token import get_user_id
from functionality.ai_tutor.ai_tutor import get_conversation_messages

from router import HTTPBearer401
from router.api_types.api_response import GetConversationResponse, GetConversationsResponse, PostConversationMessageResponse, PostNewConversationResponse
from router.api_types.api_request import PostConversationMessageRequest


router = APIRouter()

# Routes
# /ai/conversation/{id} GET - Gets a conversation with id
# /ai/conversation/{id} POST - Posts a message to the conversation
# /ai/conversation/ POST - Creates a new conversation
# /ai/conversations GET - Gets a list of all conversations

def TokenValidation(token: str):
    # TODO: Finish this function
    # Token is valid if user is ADMIN or user has PREMIUM
    
    raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User is not an admin")


@router.get("/conversation/{conversation_id}", status_code=status.HTTP_200_OK, response_model=GetConversationResponse)
async def GetConversation(conversation_id: int, token: Annotated[str, Security(HTTPBearer401())]) -> GetConversationResponse:
    TokenValidation(token)
    
    user_id = get_user_id(token)

    # TODO: Setup conversation response to return image
    # Might have to refactor into new endpoint
    return GetConversationResponse(
        messages=get_conversation_messages(conversation_id, user_id)
    )

@router.post("/conversation/{conversation_id}", status_code=status.HTTP_200_OK, response_model=PostConversationMessageResponse)
async def PostConversationMessage(conversation_id: int, request: PostConversationMessageRequest, token: Annotated[str, Security(HTTPBearer401())]) -> PostConversationMessageResponse:
    TokenValidation(token)
    pass

@router.post("/conversation", status_code=status.HTTP_200_OK, response_model=PostNewConversationResponse)
async def PostNewConversation(subject: Annotated[str, Form()],
                                topic: Annotated[str, Form()],
                                question: Annotated[str, Form()],
                                token: Annotated[str, Security(HTTPBearer401())],
                                supporting_image: Optional[Annotated[UploadFile, File()]] = None) -> PostNewConversationResponse:
    TokenValidation(token)
    pass

@router.get("/conversations", status_code=status.HTTP_200_OK, response_model=GetConversationsResponse)
async def GetConversations(token: Annotated[str, Security(HTTPBearer401())]) -> GetConversationsResponse:
    TokenValidation(token)
    pass