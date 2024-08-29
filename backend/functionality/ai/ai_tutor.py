import base64
import copy
import os

from pydantic import BaseModel

from typing import Generator, List, Literal, Optional, Tuple

from database.helpers.ai_tutor import edit_message_contents, get_ai_tutor_conversation_messages, get_conversation, get_conversations, insert_ai_tutor_conversation, preallocate_message_id

from functionality.ai.open_ai import MessageContext, create_generator, send_response

class MessageResponse(BaseModel):
    user: Literal["user", "tutor"]
    message: str
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

        self._add_premessage_context()

    def add_messages(self, messages: List[MessageResponse]):
        self.messages = messages

        for message in messages:
            self.message_context.append(MessageContext(
                user=MapUserForResponseToContext(message.user),
                message=message.message
            ))

    async def send_message(self, message: str, image_location: Optional[str] = None) -> MessageResponse:
        if image_location is not None:
            base64_image = base64.b64encode(open(image_location, "rb").read()).decode("utf-8")

            context_user = MessageContext(
                user="user",
                message=message,
                image_base64=base64_image
            )
        else:
            context_user = MessageContext(
                user="user",
                message=message
            )

        self.message_context.append(context_user)

        response = await send_response(self.message_context)

        context_tutor = MessageContext(
            user="assistant",
            message=response
        )

        self.message_context.append(context_tutor)

        return MessageResponse(
            user="tutor",
            message=response,
            isComplete=True
        )
    
    def get_sequence_number(self, message_id: int) -> int:
        return -1
    
    def _add_premessage_context(self):
        self.message_context.append(MessageContext(
            user="system",
            message=self._get_premessage_context()
        ))
    
    def _get_rag_context(self) -> str:
        subject = self.map_subject_to_code(self.subject)

        path = os.path.join("notes", subject, (self.map_topic_to_code(self.topic).replace(" ", "_") + ".txt"))

        data = ""

        with open(path, "r") as file:
            data += file.read()

        return data

    def _get_premessage_context(self) -> str:
        return """
            You are a helpful tutor made by Examify, who is here to assist students in their learning. A student will ask you a question and you must answer in a logical manner that is correct. 
            Double check your answers before sending them to the student. Also make sure to provide students with clear instructions and explanations.
            Ensure you also latex format your responses.
            
            """ + self._get_rag_context()
    
    def map_subject_to_code(self, subject: str) -> str:
        lowered_subject = subject.lower()
        
        if lowered_subject == "maths extension 2" or lowered_subject == "maths_extension_2":
            return "MX2"
        
        if lowered_subject == "maths extension 1" or lowered_subject == "maths_extension_1":
            return "MX1"
        
        if lowered_subject == "maths advanced" or lowered_subject == "maths_advanced":
            return "MA"
        
        if lowered_subject == "maths standard 2" or lowered_subject == "maths_standard_2":
            return "MS2"
        
        if lowered_subject == "chem" or lowered_subject == "chemistry":
            return "CHEM"
        
        if lowered_subject == "physics" or lowered_subject == "phys":
            return "PHYS"
        
        if lowered_subject == "biology" or lowered_subject == "bio":
            return "BIO"

        return subject
    
    def map_topic_to_code(self, topic: str) -> str:
        lower = topic.lower()

        if lower == "further work with functions":
            return "functions"
        
        if lower == "polynomials":
            return "polynomials"
        
        if lower == "graphing functions":
            return "graphing_functions"
        
        if lower == "further trigonoometric identities":
            return "trigonometric_identities"
        
        if lower == "inverse functions":
            return "inverse_functions"
        
        if lower == "permutations and combinations":
            return "permutations_and_combinations"
        
        if lower == "rates of change and their application":
            return "rates_of_change"
        
        if lower == "trigonometric equations":
            return "trigonometric_equations"
        
        if lower == "proof by mathematical induction":
            return "induction"
        
        if lower == "vectors in two dimensions":
            return "vectors"
        
        if lower == "applications of calculus":
            return "calculus_applications"
        
        if lower == "differential equations":
            return "differential_equations"
        
        if lower == "motion, forces and projectiles":
            return "motion_forces_projectiles"
        
        if lower == "the binomial distribution":
            return "binomial_distribution"

        return lower

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
            isComplete=True
        ))

        return self

    def build(self) -> AiTutor:
        if self.conversation_id is None:
            raise AttributeError("conversation_id must be set")
        
        ai_tutor = AiTutor(self.conversation_id, self.subject, self.topic)
        ai_tutor.add_messages(self.messages)

        return ai_tutor


class AiTutorFactory:
    @classmethod
    def create_ai_tutor(cls, conversation_id: int, subject: str, topic: str) -> AiTutor:
        return cls.create_ai_tutor_builder(conversation_id, subject, topic).build()

    @classmethod
    def create_ai_tutor_builder(cls, conversation_id: int) -> AiTutorBuilder:
        return AiTutorBuilder(conversation_id)
    
    @classmethod
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
        print(conversation_id)
        return self.ai_tutors.get(conversation_id, self.load_ai_tutor(conversation_id))

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
                message.message,
                message.id,
                _database_author_to_api_author(message.sender))

        ai_tutor = builder.build()
        self.ai_tutors[conversation_id] = ai_tutor

        return ai_tutor

    def create_ai_tutor(self, user_id: int, subject: str, topic: str, title: str) -> Tuple[AiTutor, int]:
        """
        Creates a new AI tutor
        """
        conversation_id = insert_ai_tutor_conversation(user_id, subject, topic, title)

        ai_tutor = AiTutorFactory.create_ai_tutor(conversation_id,  subject, topic)
        self.ai_tutors[conversation_id] = ai_tutor

        return ai_tutor, conversation_id