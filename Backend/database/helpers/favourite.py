from typing import List

import psycopg2

from logger import log_green, log_red

from database.helpers import connect, disconnect

def insert_user_favourite_exam(user_id: int, exam_id: int):
    """
    Inserts a new user favourite exam into the database
    """
    try:
        conn = connect()
        with conn.cursor() as cur:
            cur.execute(
                """
                INSERT INTO favourite_exams (account, exam) 
                VALUES (%(account)s, %(exam)s);
                """, {
                    'account': user_id,
                    'exam': exam_id
                })

        conn.commit()
        log_green("Finished inserting the User Favourite Exam into Database")
    except psycopg2.Error as e:
        log_red(f"Error inserting the User Favourite Exam: {e}")
        conn.rollback()
        raise e
    finally:
        disconnect(conn)

def delete_user_favourite_exam(user_id: int, exam_id: int):
    """
    Deletes a user favourite exam from the database
    """
    try:
        conn = connect()
        with conn.cursor() as cur:
            cur.execute(
                """
                DELETE FROM favourite_exams WHERE account = %(account)s AND exam = %(exam)s;
                """, {
                    'account': user_id,
                    'exam': exam_id
                })

        conn.commit()
        log_green("Finished deleting the User Favourite Exam from Database")
    except psycopg2.Error as e:
        log_red(f"Error deleting the User Favourite Exam: {e}")
        conn.rollback()
        raise e
    finally:
        disconnect(conn)

def check_if_user_favourite_exam_exists(user_id: int, exam_id: int) ->bool:
    """
    Checks if the user favourite exam exists in DB
    """
    try:
        conn = connect()
        with conn.cursor() as cur:
            cur.execute("SELECT EXISTS(SELECT 1 FROM favourite_exams WHERE account = %(account)s AND exam = %(exam)s);", {"account": user_id, "exam": exam_id})
            exists = cur.fetchone()

        log_green("Finished checking if the User Favourite Exam exists in Database")
    except psycopg2.Error as e:
        log_red(f"Error checking if the User Favourite Exam exists: {e}")
        raise e
    finally:
        disconnect(conn)

    return exists[0] if exists else False

def get_user_favourite_exams(user_id: int) -> List[int]:
    """
    Gets a user's favourite exams from the database
    """
    try:
        conn = connect()
        with conn.cursor() as cur:
            cur.execute("SELECT exam FROM favourite_exams WHERE account = %(account)s;", {"account": user_id})
            exams = cur.fetchall()

        log_green("Finished getting the User Favourite Exams from Database")
    except psycopg2.Error as e:
        log_red(f"Error getting the User Favourite Exams: {e}")
        raise e
    finally:
        disconnect(conn)
    
    return [exam[0] for exam in exams] if exams else []


def get_exam_likes_count(exam_id: int) -> int:
    """
    Gets the number of likes of an exam
    """
    try:
        conn = connect()
        with conn.cursor() as cur:
            cur.execute("SELECT COUNT(*) FROM favourite_exams WHERE exam = %(exam)s;", {"exam": exam_id})
            count = cur.fetchone()

        log_green("Finished getting the Exam Likes Count from Database")
    except psycopg2.Error as e:
        log_red(f"Error getting the Exam Likes Count: {e}")
        raise e
    finally:
        disconnect(conn)
    
    return count[0] if count else 0
