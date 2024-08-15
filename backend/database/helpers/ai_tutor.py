from typing import List, Literal, Optional
import psycopg2

from logger import Logger

from database.db_types.db_response import AiTutorConversationResponse, AiTutorMessageResponse
from database.helpers import connect, disconnect

def log_success(message: str):
    """
    Logs a successful exam operation
    """
    Logger.log_database("AI Tutor", message)

def log_error(message: str):
    """
    Logs an error in exam operation
    """
    Logger.log_database_error("AI Tutor", message)

def insert_ai_tutor_conversation(user_id: int, subject: str, topic: str, title: str) -> int:
    """
    Inserts a new ai tutor conversation into the database
    
    Returns the id of the conversation
    """
    try:
        conn = connect()
        with conn.cursor() as cur:
            cur.execute(
                """
                INSERT INTO ai_tutor_conversations (account, subject, topic, title) 
                VALUES (%(account)s, %(subject)s, %(topic)s, %(title)s)
                RETURNING conversation_id;
                """, {
                    'account': user_id,
                    'subject': subject,
                    'topic': topic,
                    'title': title
                })
            
            conversation_id = cur.fetchone()

        conn.commit()
        log_success("Finished inserting the Ai Tutor Conversation into Database")
    except psycopg2.Error as e:
        log_error(f"Error inserting the Ai Tutor Conversation: {e}")
        conn.rollback()
        raise e
    finally:
        disconnect(conn)

    return conversation_id[0]

def get_conversations_for_user(user_id: int, sort_method: Literal["TIME_DESC"] = "TIME_DESC") -> List[AiTutorConversationResponse]:
    """
    Gets all the users conversations sorted based on the sort method
    """
    query = """
            SELECT conversation_id, time_created, subject, topic, title
            FROM ai_tutor_conversations
            WHERE account = %(account)s
            ORDER BY %(order)s;
            """

    if sort_method == "TIME_DESC":
        order = "time_created DESC"

    try:
        conn = connect()
        with conn.cursor() as cur:
            cur.execute(query, {
                'account': user_id,
                'order': order
            })

            conversations = cur.fetchall()

        log_success("Finished getting Ai Tutor Conversations from the database!")
    except psycopg2.Error as e:
        log_error(f"Error getting the Ai Tutor Conversations: {e}")
        raise e
    finally:
        disconnect(conn)

    return [AiTutorConversationResponse(
        id=id,
        time_created=creation_time,
        subject=subject,
        topic=topic,
        title=title
    ) for id, creation_time, subject, topic, title in conversations]

def insert_ai_tutor_message_from_student(conversation_id: int, message: str, supporting_image: Optional[str]) -> int:
    return _insert_ai_tutor_message(conversation_id, message, "STU", supporting_image_loc=supporting_image)

def insert_ai_tutor_message_from_tutor(conversation_id: int, message: str, supporting_image: Optional[str] = None) -> int:
    return _insert_ai_tutor_message(conversation_id, message, "TUT", supporting_image)

def _insert_ai_tutor_message(conversation_id: int, message: str, sender: Literal["STU", "TUT"], supporting_image_loc: Optional[str] = None) -> int:
    """
    Inserts a new ai tutor message into the database. If supporting_image_loc is provided, it will be included in the insert.
    
    Returns the id of the message
    """
    try:
        conn = connect()
        with conn.cursor() as cur:
            if supporting_image_loc:
                cur.execute(
                    """
                    INSERT INTO ai_tutor_messages (conversation_id, supporting_image_loc, message_contents, user_sent) 
                    VALUES (%(conversation_id)s, %(supporting_image_loc)s, %(message_contents)s, %(user_sent)s)
                    RETURNING message_id;
                    """, {
                        'conversation_id': conversation_id,
                        'supporting_image_loc': supporting_image_loc,
                        'message_contents': message,
                        'user_sent': sender == "STU"
                    })
            else:
                cur.execute(
                    """
                    INSERT INTO ai_tutor_messages (conversation_id, message_contents, user_sent) 
                    VALUES (%(conversation_id)s, %(message_contents)s, %(user_sent)s)
                    RETURNING message_id;
                    """, {
                        'conversation_id': conversation_id,
                        'message_contents': message,
                        'user_sent': sender == "STU"
                    })
            
            message_id = cur.fetchone()

        conn.commit()
        log_success("Finished inserting the Ai Tutor Message into Database")
    except psycopg2.Error as e:
        log_error(f"Error inserting the Ai Tutor Message: {e}")
        conn.rollback()
        raise e
    finally:
        disconnect(conn)

    return message_id[0]

def get_ai_tutor_conversation_messages(conversation_id: int) -> List[AiTutorMessageResponse]:
    """
    Given a conversation_id, return all the messages in the conversation in ascending time order
    """
    try:
        conn = connect()
        with conn.cursor() as cur:
            cur.execute(
                """
                SELECT m.message_id, m.supporting_image_loc, m.message_contents, m.user_sent, m.time_created
                FROM ai_tutor_messages m
                WHERE m.conversation_id = %(conversation_id)s
                ORDER BY m.time_created ASC
                """, {
                    'conversation_id': conversation_id
                })
            
            messages = cur.fetchall()
        log_success(f"Succesfully got all message for conversation with id {conversation_id}")
    except psycopg2.Error as e:
        log_error(f"Error Getting message for conversation with id {conversation_id}: {e}")
        conn.rollback()
        raise e
    finally:
        disconnect(conn)

    return [AiTutorMessageResponse(
        id=message_id,
        supporting_image_location=image_loc,
        message=message,
        sender="STU" if sender else "TUT",
        time_created=time_created
    ) for message_id, image_loc, message, sender, time_created in messages]

def get_conversation(conversation_id: int ) -> AiTutorConversationResponse:
    """
    Given a conversation id, get the conversation details
    """
    try:
        conn = connect()
        with conn.cursor() as cur:
            cur.execute(
                """
                SELECT time_created, subject, topic, title
                FROM ai_tutor_conversations
                WHERE conversation_id = %(conversation_id)s
                """, {
                    'conversation_id': conversation_id
                })
            
            conversation = cur.fetchone()
        log_success(f"Succesfully got conversation with id {conversation_id}")
    except psycopg2.Error as e:
        log_error(f"Error Getting conversation with id {conversation_id}: {e}")
        conn.rollback()
        raise e
    finally:
        disconnect(conn)

    return AiTutorConversationResponse(
        id=conversation_id,
        time_created=conversation[0],
        subject=conversation[1],
        topic=conversation[2],
        title=conversation[3]
    )

def user_can_access_conversation(user_id: int, conversation_id: int) -> bool:
    """
    Given a conversation id and user id, check if the user can access the conversation
    """
    try:
        conn = connect()
        with conn.cursor() as cur:
            cur.execute(
                """
                SELECT EXISTS(
                    SELECT 1 FROM ai_tutor_conversations 
                    WHERE account = %(account)s AND conversation_id = %(conversation_id)s
                );
                """, {
                    'account': user_id,
                    'conversation_id': conversation_id
                }
            )

            exists = cur.fetchone()
        log_success("Finished checking if user can access conversation")
    except psycopg2.Error as e:
        log_error(f"Error checking if user can access conversation: {e}")
        raise e
    finally:
        disconnect(conn)

    return exists[0] if exists else False

def get_image_location_for_message(message_id: int, conversation_id: int) -> str:
    """
    Given a message id and conversation id, get the image location for the message
    """
    try:
        conn = connect()
        with conn.cursor() as cur:
            cur.execute(
                """
                SELECT supporting_image_loc
                FROM ai_tutor_messages
                WHERE message_id = %(message_id)s AND conversation_id = %(conversation_id)s
                """, {
                    'message_id': message_id,
                    'conversation_id': conversation_id
                }
            )

            image_loc = cur.fetchone()
        log_success("Finished getting image location for message")
    except psycopg2.Error as e:
        log_error(f"Error getting image location for message: {e}")
        raise e
    finally:
        disconnect(conn)

    return image_loc[0] if image_loc else None

def preallocate_message_id(conversation_id: int, isUser=False) -> int:
    """
    Preallocates a message id for the conversation
    """
    try:
        conn = connect()
        with conn.cursor() as cur:
            cur.execute(
                """
                INSERT INTO ai_tutor_messages (conversation_id, user_sent)
                VALUES (%(conversation_id)s, %(isUser)s)
                RETURNING message_id;
                """, {
                    'conversation_id': conversation_id,
                    'isUser': isUser
                }
            )

            message_id = cur.fetchone()
        log_success("Finished preallocating message id")
    except psycopg2.Error as e:
        log_error(f"Error preallocating message id: {e}")
        conn.rollback()
        raise e
    finally:
        disconnect(conn)

    return message_id[0] if message_id else None

def edit_message_contents(conversation_id: int, message_id: int, message_contents: str):
    """
    Edits the message contents of a message
    """
    try:
        conn = connect()
        with conn.cursor() as cur:
            cur.execute(
                """
                UPDATE ai_tutor_messages
                SET message_contents = %(message_contents)s
                WHERE conversation_id = %(conversation_id)s AND message_id = %(message_id)s
                """, {
                    'message_contents': message_contents,
                    'conversation_id': conversation_id,
                    'message_id': message_id
                }
            )

        conn.commit()
        log_success("Finished editing message contents")
    except psycopg2.Error as e:
        log_error(f"Error editing message contents: {e}")
        conn.rollback()
        raise e
    finally:
        disconnect(conn)

def get_conversations() -> List[AiTutorConversationResponse]:
    """
    Gets all the conversations
    """
    try:
        conn = connect()
        with conn.cursor() as cur:
            cur.execute(
                """
                SELECT conversation_id, time_created, subject, topic, title
                FROM ai_tutor_conversations
                ORDER BY time_created DESC
                """
            )

            conversations = cur.fetchall()
        log_success("Finished getting all conversations")
    except psycopg2.Error as e:
        log_error(f"Error getting all conversations: {e}")
        raise e
    finally:
        disconnect(conn)

    return [AiTutorConversationResponse(
        id=id,
        time_created=creation_time,
        subject=subject,
        topic=topic,
        title=title
    ) for id, creation_time, subject, topic, title in conversations]