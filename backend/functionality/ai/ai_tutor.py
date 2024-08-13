import copy

from pydantic import BaseModel

from typing import Generator, List, Literal, Optional, Tuple

from database.helpers.ai_tutor import edit_message_contents, get_ai_tutor_conversation_messages, get_conversation, get_conversations, insert_ai_tutor_conversation, preallocate_message_id

from functionality.ai.open_ai import MessageContext, create_generator

class MessageResponse(BaseModel):
    user: Literal["user", "tutor"]
    message: str
    message_id: int
    isComplete: bool

def MapUserForResponseToContext(user: Literal["user", "tutor"]) -> Literal["user", "assistant"]:
    if user == "user":
        return "user"
    elif user == "tutor":
        return "assistant"
    else:
        return "assistant"

def _database_author_to_api_author(author: Literal['STU', 'TUT']):
    if author == 'STU':
        return 'user'
    elif author == 'TUT':
        return "tutor"
    
    raise ValueError("Unexpected value")

class AiTutor:
    def __init__(self, conversation_id: int, subject: str, topic: str):
        self.message_context = [] # This is the full history context of messages. It includes system messages that 
                                  # should not be viewable by the user
        self.messages = {}        # This shows all the messages from the student and tutor
                                  # It is mapped by the message's id

        self.conversation_id = conversation_id
        self.subject = subject
        self.topic = topic

    def add_messages(self, messages: List[MessageResponse]):
        self.messages = messages

        for message in messages:
            self.message_context.append(MessageContext(
                user=MapUserForResponseToContext(message.user),
                message=message.message
            ))

    def send_message(self, message: str) -> MessageResponse:
        message = ""
        message_id  = 1

        return MessageResponse(
            user="tutor",
            message=message,
            message_id=message_id,
            isComplete=True
        )

class AiTutorBuilder:
    def __init__(self, conversation_id: int):
        self.conversation_id = conversation_id
        self.subject = None
        self.topic = None
        self.messages = []

    def set_subject(self, subject: str):
        self.subject = subject

        return self
    
    def set_topic(self, topic: str):
        self.topic = topic

        return self
    
    def add_message(self, message: str, message_id: int, user: Literal["user", "tutor"]):
        self.messages.append(MessageResponse(
            user=user,
            message=message,
            message_id=message_id,
            isComplete=True
        ))

        return self

    def build(self) -> AiTutor:
        if (self.subject is None or self.conversation_id is None):
            raise AttributeError("Subject and conversation_id must be set")
        
        ai_tutor = AiTutor(self.conversation_id, self.subject, self.topic)
        ai_tutor.add_messages(self.messages)

        return ai_tutor


class AiTutorFactory:
    def create_ai_tutor(cls, conversation_id: int, subject: str, topic: str) -> AiTutor:
        return cls.create_ai_tutor_builder(conversation_id, subject, topic).build()

    def create_ai_tutor_builder(cls, conversation_id: int) -> AiTutorBuilder:
        return AiTutorBuilder(conversation_id)
    
    def create_ai_tutor_builder(cls, conversation_id: int, subject: str, topic: str) -> AiTutor:
        return AiTutorBuilder(conversation_id).set_subject(subject).set_topic(topic)

class SingletonClass(object):
  def __new__(cls):
    if not hasattr(cls, 'instance'):
      cls.instance = super(SingletonClass, cls).__new__(cls)
    return cls.instance

class AiTutorManager(SingletonClass):
    """
    A manager for AI tutors
    """
    def __init__(self):
        self.ai_tutors = {}

    def load_ai_tutors(self):
        """
        Loads an AI tutor based on context from the database
        """
        conversations = get_conversations()

        for conversation in conversations:
            self.load_ai_tutor(conversation.id)
    
    def get_ai_tutor(self, conversation_id) -> AiTutor:
        return self.ai_tutors.get(conversation_id, AiTutorFactory.create_ai_tutor(conversation_id, None, None))

    def load_ai_tutor(self, conversation_id) -> AiTutor:
        """
        Loads an AI tutor based on context from the database
        """
        conversation = get_conversation(conversation_id)
        messages = get_ai_tutor_conversation_messages(conversation_id)

        builder = AiTutorFactory.create_ai_tutor_builder(
            conversation_id, conversation.subject, conversation.topic
        )

        for message in messages:
            builder.add_message(
                message.contents,
                message.id,
                _database_author_to_api_author(message.author))

        ai_tutor = builder.build()
        self.ai_tutors[conversation_id] = ai_tutor

        return ai_tutor

    def create_ai_tutor(self, user_id: int, subject: str, topic: str, title: str) -> Tuple[AiTutor, int]:
        """
        Creates a new AI tutor
        """
        conversation_id = 1 #insert_ai_tutor_conversation(user_id, subject, topic, title)

        ai_tutor = AiTutorFactory.create_ai_tutor(conversation_id)
        self.ai_tutors[conversation_id] = ai_tutor

        return ai_tutor, conversation_id