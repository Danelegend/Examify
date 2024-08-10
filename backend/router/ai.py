from typing import Annotated, Optional
from fastapi import APIRouter, HTTPException, Response, Security, status, UploadFile, Form, File, FileResponse, StreamingResponse

from functionality.token import get_user_id
from functionality.ai_tutor.ai_tutor import get_conversation_messages, get_conversations, get_image_location, get_message_stream, post_conversation, post_conversation_message

from router import HTTPBearer401
from router.api_types.api_response import GetConversationResponse, GetConversationsResponse, PostConversationMessageResponse, PostNewConversationResponse
from router.api_types.api_request import PostConversationMessageRequest


router = APIRouter()

# Routes
# /ai/conversation/{id} GET - Gets a conversation with id
# /ai/conversation/{id} POST - Posts a message to the conversation
# /ai/conversation/ POST - Creates a new conversation
# /ai/conversations GET - Gets a list of all conversations
# /ai/image/{id} GET - Gets an image

def TokenValidation(token: str):
    # TODO: Finish this function
    # Token is valid if user is ADMIN or user has PREMIUM
    
    raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User is not an admin")

@router.get("/conversation/{conversation_id}/message/{message_id}/image", status_code=status.HTTP_200_OK)
async def GetImage(conversation_id: int, message_id: int, token: Annotated[str, Security(HTTPBearer401())]) -> Response:
    TokenValidation(token)

    user_id = get_user_id(token)
    
    try:
        image_location = get_image_location(user_id, conversation_id, message_id)
    except:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Image not found")
    
    return FileResponse(image_location)


@router.get("/conversation/{conversation_id}", status_code=status.HTTP_200_OK, response_model=GetConversationResponse)
async def GetConversation(conversation_id: int, token: Annotated[str, Security(HTTPBearer401())]) -> GetConversationResponse:
    TokenValidation(token)
    
    user_id = get_user_id(token)

    return GetConversationResponse(
        messages=get_conversation_messages(conversation_id, user_id)
    )

@router.post("/conversation/{conversation_id}", status_code=status.HTTP_200_OK, response_model=PostConversationMessageResponse)
async def PostConversationMessage(conversation_id: int, request: PostConversationMessageRequest, token: Annotated[str, Security(HTTPBearer401())]) -> PostConversationMessageResponse:
    TokenValidation(token)
    
    student_message, tutor_id = post_conversation_message(conversation_id, request.message)

    return PostConversationMessageResponse(
        tutor_message_id=tutor_id,
        student_message=student_message
    )

@router.get("/conversation/{conversation_id}/message/{message_id}/stream", status_code=status.HTTP_200_OK, response_model=str)
async def StreamMessage(conversation_id: int, message_id: int, token: Annotated[str, Security(HTTPBearer401())]) -> str:
    TokenValidation(token)
    
    return StreamingResponse(
        get_message_stream(conversation_id, message_id),
        media_type="text/plain"
    )


@router.post("/conversation", status_code=status.HTTP_200_OK, response_model=PostNewConversationResponse)
async def PostNewConversation(subject: Annotated[str, Form()],
                                topic: Annotated[str, Form()],
                                question: Annotated[str, Form()],
                                token: Annotated[str, Security(HTTPBearer401())],
                                supporting_image: Optional[Annotated[UploadFile, File()]] = None) -> PostNewConversationResponse:
    TokenValidation(token)

    user_id = get_user_id(token)

    conversation_id, tutor_message_id = post_conversation(user_id, subject, topic, question, supporting_image)

    return PostNewConversationResponse(
        conversation_id=conversation_id,
        tutor_message_id=tutor_message_id
    )

@router.get("/conversations", status_code=status.HTTP_200_OK, response_model=GetConversationsResponse)
async def GetConversations(token: Annotated[str, Security(HTTPBearer401())]) -> GetConversationsResponse:
    TokenValidation(token)
    
    user_id = get_user_id(token)

    return GetConversationsResponse(
        conversations=get_conversations(user_id)
    )