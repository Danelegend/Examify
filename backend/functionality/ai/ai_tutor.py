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
    """
    The AI tutor class
    """
    def __init__(self, conversation_id: int, subject: str, topic: str):
        # A list of messages in the conversation
        self.message_context = []
        self.messages = {}
        self.generators = {}

        self.subject = subject
        self.topic = topic

        self.conversation_id = conversation_id

    def add_messages(self, messages: List[MessageResponse]):
        self.messages = messages

        for message in messages:
            self.message_context.append(MessageContext(
                user=MapUserForResponseToContext(message.user),
                message=message.message
            ))


    def send_message(self, message: str) -> int:
        """
        Returns a stream of the messages being received
        
        Returns the id of the message to be sent
        """
        message_id = self._preallocate_message_id()

        self._send_message(message, message_id)

        return message_id
    
    def send_message(self, message: str, image_location: Optional[str] = None) -> int:
        """
        Returns a stream of the messages being received
        
        Returns the id of the message to be sent
        """
        if image_location is None:
            return self.send_message(message)

        message_id = self._preallocate_message_id()

        self._send_message(message, message_id, image_location)

        return message_id

    def _send_message(self, message: str, tutor_preallocated_message_id: int):
        """
        Sends a message to the AI API
        """
        self.message_context.append(MessageContext(
                user="user", 
                message=message,
            ))
        
        generator = create_generator(self.message_context)
        
        messageResponse = MessageResponse(
            user="tutor",
            message="",
            message_id=tutor_preallocated_message_id,
            isComplete=False
        )

        self.messages[tutor_preallocated_message_id] = copy.copy(messageResponse)
        self.message_context.append(copy.copy(messageResponse))

        self.generators[tutor_preallocated_message_id] = generator

    def get_message_stream(self, message_id: int) -> Generator[str, None, str]:
        """
        Returns a stream of the messages being received
        """
        if (message_id in self.messages and self.messages[message_id].isComplete):
            return self.messages[message_id].message

        content = ""

        for event in self.generators[message_id]:
            if "content" in event:
                content += event["content"]
                yield event["content"]

        self._on_message_stream_complete(message_id, content)

        return ""
    
    def _on_message_stream_complete(self, message_id: int, message: str):
        edit_message_contents(self.conversation_id, message_id, message)

        self.messages[message_id].isComplete = True
        self.messages[message_id].message = message

        self.message_context.append(MessageContext(
            user="assistant",
            message=message
        ))

        self.generators.pop(message_id)

    def _preallocate_message_id(self) -> int:
        return preallocate_message_id(self.conversation_id, isUser=False)

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
        return self.ai_tutors.get(conversation_id, AiTutorFactory.create_ai_tutor())

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
        conversation_id = insert_ai_tutor_conversation(user_id, subject, topic, title)

        ai_tutor = AiTutorFactory.create_ai_tutor(conversation_id)
        self.ai_tutors[conversation_id] = ai_tutor

        return ai_tutor, conversation_id