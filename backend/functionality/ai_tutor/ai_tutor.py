import datetime
import os

from fastapi import UploadFile
from typing import List, Literal, Optional, Tuple
from errors import AuthenticationError

from database.helpers.ai_tutor import get_ai_tutor_conversation_messages, get_conversations_for_user, get_image_location_for_message, insert_ai_tutor_conversation, insert_ai_tutor_message_from_student, user_can_access_conversation

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

def get_image_location(user_id: int, conversation_id: int, message_id: int) -> str:
    if not user_can_access_conversation(user_id, conversation_id):
        raise AuthenticationError(f"User does not have access to the conversation, conversation={conversation_id} user={user_id}")

    image_name = get_image_location_for_message(message_id, conversation_id)

    image_location = os.path.join(os.environ.get("AI_TUTOR_IMAGE_DIRECTORY", "tutor_images"), image_name)

    if image_location is None:
        raise FileNotFoundError(f"Image not found for message_id={message_id} conversation_id={conversation_id}")

    return image_location

async def post_conversation_message(conversation_id: int, user_id: int, message: str) -> Tuple[AiConversationMessage, int]:
    if not user_can_access_conversation(user_id, conversation_id):
        raise AuthenticationError(f"User does not have access to the conversation, conversation={conversation_id} user={user_id}")

    # Append this message to the database
    student_message_id = insert_ai_tutor_message_from_student(conversation_id, message, None)

    tutor_message_id = AiTutorManager.get_ai_tutor(conversation_id).send_message(message)

    return AiConversationMessage(
        id=student_message_id,
        sequence_number=1,
        author=_database_author_to_api_author("STU"),
        contents=[message],
        timestamp=datetime.datetime.now(datetime.timezone.utc),
        has_image=False
    ), tutor_message_id

async def get_message_stream(conversation_id: int, message_id: int) -> str:
    return AiTutorManager.get_ai_tutor(conversation_id).get_message_stream(message_id)

async def post_conversation(user_id: int, subject: str, topic: str, question: str, supporting_image: Optional[UploadFile] = None) -> Tuple[int, int]:
    title = question if len(question) < 15 else question[:15] + "..."

    ai_tutor, conversation_id = AiTutorManager.create_ai_tutor(user_id, subject, topic, title)
    
    image_location = _save_image(supporting_image, conversation_id) if supporting_image is not None else None

    student_message_id = insert_ai_tutor_message_from_student(conversation_id, question, image_location)
    preallocated_tutor_message_id = ai_tutor.send_message(question, image_location)

    return conversation_id, preallocated_tutor_message_id

async def get_conversations(user_id: int) -> List[ConversationBrief]:
    conversations = get_conversations_for_user(user_id)

    return [ConversationBrief(
        conversation_id=conversation.id,
        title=conversation.title,
        subject=conversation.subject,
        timestamp=conversation.time_created
    ) for conversation in conversations]

async def _save_image(image: UploadFile, conversation_id: int) -> str:
    """
    Returns the file_name of the saved image
    """
    file_name = f"{conversation_id}_{datetime.datetime.now().isoformat()}.png"

    with open(os.path.join(os.environ.get("AI_TUTOR_IMAGE_DIRECTORY", "tutor_images"), file_name), "wb") as file:
        file.write(image.file.read())

    return file_name

def _database_author_to_api_author(author: Literal['STU', 'TUT']):
    if author == 'STU':
        return 'user'
    elif author == 'TUT':
        return "tutor"
    
    raise ValueError("Unexpected value")
