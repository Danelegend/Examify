from typing import Annotated, Optional
from fastapi import APIRouter, HTTPException, Response, Security, status, UploadFile, Form, File
from fastapi.responses import FileResponse

from functionality.token import get_user_id
from functionality.ai_tutor.ai_tutor import get_conversation_messages, get_conversations, get_image_location, post_conversation, post_student_message, post_tutor_message
from functionality.authentication.authentication import GetUserPermissions


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
    # Token is valid if user is ADMIN or user has PREMIUM
    
    if GetUserPermissions(token) != "ADM" and GetUserPermissions(token) != "PRE":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User is not an admin")
    return

@router.get("/conversation/{conversation_id}/message/{message_id}/image", status_code=status.HTTP_200_OK)
async def GetImage(conversation_id: int, message_id: int) -> FileResponse:
    try:
        image_location = get_image_location(conversation_id, message_id)
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
    
    user_id = get_user_id(token)

    student_message = await post_student_message(conversation_id, user_id, request.message)
    tutor_message = await post_tutor_message(conversation_id, request.message)

    return PostConversationMessageResponse(
        student_message=student_message,
        tutor_message=tutor_message
    )

@router.post("/conversation", status_code=status.HTTP_200_OK, response_model=PostNewConversationResponse)
async def PostNewConversation(subject: Annotated[str, Form()],
                                topic: Annotated[str, Form()],
                                question: Annotated[str, Form()],
                                token: Annotated[str, Security(HTTPBearer401())],
                                supporting_image: Annotated[Optional[UploadFile], File()] = None) -> PostNewConversationResponse:
    TokenValidation(token)

    user_id = get_user_id(token)

    conversation_id = await post_conversation(user_id, subject, topic, question)
    student_message = await post_student_message(conversation_id, user_id, question, supporting_image)
    tutor_message = await post_tutor_message(conversation_id, question, get_image_location(conversation_id, student_message.id))

    return PostNewConversationResponse(
        conversation_id=conversation_id,
        student_message=student_message,
        tutor_message=tutor_message
    )

@router.get("/conversations", status_code=status.HTTP_200_OK, response_model=GetConversationsResponse)
async def GetConversations(token: Annotated[str, Security(HTTPBearer401())]) -> GetConversationsResponse:
    TokenValidation(token)
    
    user_id = get_user_id(token)

    return GetConversationsResponse(
        conversations=get_conversations(user_id)
    )