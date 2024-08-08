from typing import List, Literal
from errors import AuthenticationError

from database.helpers.ai_tutor import get_ai_tutor_conversation_messages, user_can_access_conversation

from router.api_types.api_response import AiConversationMessage, GetConversationResponse

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
            timestamp=message.time_created
        ))

        sequence_num += 1

    return ret

def _database_author_to_api_author(author: Literal['STU', 'TUT']):
    if author == 'STU':
        return 'user'
    elif author == 'TUT':
        return "tutor"
    
    raise ValueError("Unexpected value")

