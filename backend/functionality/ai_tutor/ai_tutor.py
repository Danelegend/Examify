import aiofiles
import datetime
import os

from fastapi import UploadFile
from typing import List, Literal, Optional, Tuple
from errors import AuthenticationError

from database.helpers.ai_tutor import get_ai_tutor_conversation_messages, get_conversations_for_user, get_image_location_for_message, insert_ai_tutor_message_from_student, insert_ai_tutor_message_from_tutor, user_can_access_conversation

from functionality.ai.ai_tutor import AiTutorManager

from router.api_types.api_response import AiConversationMessage, ConversationBrief, GetConversationResponse

def get_conversation_messages(conversation_id: int, user_id: int) -> List[AiConversationMessage]:
    if not user_can_access_conversation(user_id, conversation_id):
        raise AuthenticationError(f"User does not have access to the conversation, conversation={conversation_id} user={user_id}")
    
    messages = get_ai_tutor_conversation_messages(conversation_id)

    ret = []
    sequence_num = 1

    for message in messages:
        ret.append(AiConversationMessage(
            id=message.id,
            sequence_number=sequence_num,
            author=_database_author_to_api_author(message.sender),
            contents=[message.message],
            timestamp=message.time_created,
            has_image=(message.supporting_image_location is not None)
        ))

        sequence_num += 1

    return ret

def get_image_location(conversation_id: int, message_id: int) -> str:
    image_name = get_image_location_for_message(message_id, conversation_id)

    image_location = os.path.join(os.environ.get("AI_TUTOR_IMAGE_DIRECTORY", "tutor_images"), image_name)

    if image_location is None:
        raise FileNotFoundError(f"Image not found for message_id={message_id} conversation_id={conversation_id}")

    return image_location

async def post_conversation(user_id: int, subject: str, topic: str, question: str) -> int:
    title = question if len(question) < 15 else question[:15] + "..."

    _, conversation_id = AiTutorManager().create_ai_tutor(user_id, subject, topic, title)

    return conversation_id

async def post_student_message(conversation_id: int, user_id: int, message: str, supporting_image: Optional[UploadFile] = None) -> AiConversationMessage:
    if not user_can_access_conversation(user_id, conversation_id):
        raise AuthenticationError(f"User does not have access to the conversation, conversation={conversation_id} user={user_id}")

    image_location = await _save_image(supporting_image, conversation_id) if supporting_image is not None else None

    student_message_id = insert_ai_tutor_message_from_student(conversation_id, message, image_location)

    return AiConversationMessage(
        id=student_message_id,
        sequence_number=_get_sequence_number(conversation_id, student_message_id),
        author=_database_author_to_api_author("STU"),
        contents=[message],
        timestamp=datetime.datetime.now(datetime.timezone.utc),
        has_image=(image_location is not None)
    )

async def post_tutor_message(conversation_id: int, query: str, image_location: Optional[str] = None) -> AiConversationMessage:
    ai_tutor = AiTutorManager().get_ai_tutor(conversation_id)
    response = await ai_tutor.send_message(query, image_location=image_location)

    tutor_message_id = insert_ai_tutor_message_from_tutor(conversation_id, response.message, None)

    return AiConversationMessage(
        id=tutor_message_id,
        sequence_number=ai_tutor.get_sequence_number(tutor_message_id),
        author=_database_author_to_api_author("TUT"),
        contents=[response.message],
        timestamp=datetime.datetime.now(datetime.timezone.utc),
        has_image=False
    )

async def get_conversations(user_id: int) -> List[ConversationBrief]:
    conversations = get_conversations_for_user(user_id)

    return [ConversationBrief(
        conversation_id=conversation.id,
        title=conversation.title,
        subject=conversation.subject,
        timestamp=conversation.time_created
    ) for conversation in conversations]

def _get_sequence_number(conversation_id: int, message_id: int) -> int:
    return 1

async def _save_image(upload: UploadFile, conversation_id: int) -> str:
    """
    Returns the file_name of the saved image
    """
    # Sanitize the datetime format for the file name
    timestamp = datetime.datetime.now().isoformat().replace(":", "-")
    file_name = f"{conversation_id}_{timestamp}.png"

    directory = os.environ.get("AI_TUTOR_IMAGE_DIRECTORY", "tutor_images")

    file_path = os.path.join(directory, file_name)

    async with aiofiles.open(file_path, 'wb') as f:
        content = await upload.read()
        await f.write(content)

    return file_name

def _database_author_to_api_author(author: Literal['STU', 'TUT']):
    if author == 'STU':
        return 'user'
    elif author == 'TUT':
        return "tutor"
    
    raise ValueError("Unexpected value")
