from typing import List, Optional

import psycopg2

from logger import Logger

from database.helpers import connect, disconnect
from database.db_types.db_request import QuestionCreationRequest
from database.db_types.db_response import QuestionCardResponse, QuestionsDetailsResponse

from router.api_types.api_request import QuestionsFilter


def log_question_success(message: str):
    """
    Logs a successful questions operation
    """
    Logger.log_database("Questions", message)

def log_question_error(message: str):
    """
    Logs an error in questions operation
    """
    Logger.log_database_error("Questions", message)

def insert_question(question: QuestionCreationRequest) -> int:
    """
    Inserts a new question in the database
    """
    log_question_success("Beginning inserting the Question into Database")
    try:
        conn = connect()
        with conn.cursor() as cur:
            cur.execute("""
                        INSERT INTO questions (title, subject, topic, question, grade, difficulty)
                        VALUES (%(title)s, %(subject)s, %(topic)s, %(question)s, %(grade)s, %(difficulty)s)
                        RETURNING id;
                        """, {
                            'title': question.title,
                            'subject': question.subject,
                            'topic': question.topic,
                            'question': question.question,
                            'grade': question.grade,
                            'difficulty': question.difficulty
                        })
            question_id = cur.fetchone()[0]

            for answer in question.answers:
                cur.execute("""
                            INSERT INTO answers (question, answer)
                            VALUES (%(question)s, %(answer)s);
                            """, {
                                'question': question_id,
                                'answer': answer
                            })
            
            for image_location in question.image_locations:
                cur.execute("""
                            INSERT INTO question_images (question, image_location)
                            VALUES (%(question)s, %(image_location)s);
                            """, {
                                'question': question_id,
                                'image_location': image_location
                            })
            
            conn.commit()

            log_question_success("Finished inserting the Question into Database")
    except psycopg2.Error as e:
        log_question_error(f"Error inserting the Question into Database: {e}")
        conn.rollback()
        raise e
    finally:
        disconnect(conn)

    return question_id

def get_questions_with_pagination(start: int, size: int, filter: QuestionsFilter) -> List[QuestionCardResponse]:
    """
    Get all questions in the bounds start <= question < start + size that match the filter
    """
    
    s = """
    SELECT id, title, subject, topic, grade, difficulty
    FROM questions
    """

    where_flag = True

    for i in range(len(filter.subjects)):
        if i == 0 and where_flag:
            if where_flag:
                s += f"\nWHERE subject = \'{filter.subjects[i]}\'"
                where_flag = False
        else:
            s += f" OR subject = \'{filter.subjects[i]}\'"

    for i in range(len(filter.topics)):
        if i == 0 and where_flag:
            if where_flag:
                s += f"\nWHERE topic = \'{filter.topics[i]}\'"
                where_flag = False
        else:
            s += f" OR topic = \'{filter.topics[i]}\'"

    for i in range(len(filter.grades)):
        if i == 0 and where_flag:
            if where_flag:
                s += f"\nWHERE grade = \'{filter.grades[i]}\'"
                where_flag = False
        else:
            s += f" OR grade = \'{filter.grades[i]}\'"
    
    s += "\nLIMIT %(size)s OFFSET %(start)s"

    try: 
        conn = connect()
        with conn.cursor() as cur:
            cur.execute(s, {
                'size': size,
                'start': start
            })
            questions = cur.fetchall()
        
        log_question_success("Finished getting the Questions from Database in pagination fashion")
    except psycopg2.Error as e:
        log_question_error(f"Error in getting the Questions from Database in pagination fashion: {e}")
        raise e
    finally:
        disconnect(conn)

    return [QuestionCardResponse(
        id=item[0],
        title=item[1],
        subject=item[2],
        topic=item[3],
        grade=item[4],
        difficulty=item[5]
    ) for item in questions]

def get_question(question_id: int) -> QuestionsDetailsResponse:
    """
    Get the details of a question
    """
    try:
        conn = connect()
        with conn.cursor() as cur:
            cur.execute("""
                        SELECT q.subject, q.topic, q.title, q.grade, q.difficulty, q.question, a.answer, i.image_location
                        FROM questions q
                        LEFT JOIN answers a ON q.id = a.question
                        LEFT JOIN question_images i ON q.id = i.question
                        WHERE q.id = %(id)s
                        """, {"id": question_id})

            result = cur.fetchall()

            # Initialize containers
            answers = []
            question_images = []

            # Extract data from the result
            subject, topic, title, grade, difficulty, question = result[0][:6]

            for row in result:
                if row[6] is not None:
                    answers.append(row[6])
                if row[7] is not None:
                    question_images.append(row[7])

        log_question_success("Finished getting the Question from Database")
    except psycopg2.Error as e:
        log_question_error(f"Error getting the Question: {e}")
        raise e
    finally:
        disconnect(conn)
    
    return QuestionsDetailsResponse(
        id=question_id,
        subject=subject,
        topic=topic,
        title=title,
        grade=grade,
        difficulty=difficulty,
        question=question,
        answers=answers,
        question_images=question_images
    )

def get_subjects() -> List[str]:
    """
    Gets the unique subjects in the questions table
    """
    try:
        conn = connect()
        with conn.cursor() as cur:
            cur.execute("""
                        SELECT DISTINCT subject
                        FROM questions
                        """)
            subjects = cur.fetchall()
        
        log_question_success("Finished getting the Subjects from Database")
    except psycopg2.Error as e:
        log_question_error(f"Error getting the Subjects: {e}")
        raise e
    finally:
        disconnect(conn)

    return [subject[0] for subject in subjects]

def get_topics(subject: Optional[str] = None) -> List[str]:
    """
    Gets the unique topics in the questions table where the subject is chosen
    """
    try:
        conn = connect()
        with conn.cursor() as cur:
            s = """
                SELECT DISTINCT topic
                FROM questions 
                """
            
            if subject is not None:
                s += f"\nWHERE subject = \'{subject}\'"

            cur.execute(s)
            topics = cur.fetchall()
        
        log_question_success("Finished getting the Topics from Database")
    except psycopg2.Error as e:
        log_question_error(f"Error getting the Topics: {e}")
        raise e
    finally:
        disconnect(conn)

    return [topic[0] for topic in topics]

def insert_user_answers(user_id: int, question_id: int, answer: str):
    """
    Inserts the user's answers into the database
    """
    try:
        conn = connect()
        with conn.cursor() as cur:
            cur.execute("""
                        INSERT INTO user_answers (user_id, question_id, answer)
                        VALUES (%(user_id)s, %(question_id)s, %(answer)s)
                        """, {
                            'user_id': user_id,
                            'question_id': question_id,
                            'answer': answer
                        })
            conn.commit()
        
        log_question_success("Finished inserting the User's Answers into Database")
    except psycopg2.Error as e:
        log_question_error(f"Error inserting the User's Answers into Database: {e}")
        conn.rollback()
        raise e
    finally:
        disconnect(conn)
