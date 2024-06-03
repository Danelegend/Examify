from typing import List

import psycopg2

from logger import Logger

from database.helpers import connect, disconnect

def log_completed_exams_success(message: str):
    """
    Logs a successful exam operation
    """
    Logger.log_database("Completed Exams", message)

def log_completed_exams_error(message: str):
    """
    Logs an error in exam operation
    """
    Logger.log_database_error("Completed Exams", message)

def insert_user_completed_exam(user_id: int, exam_id: int):
    """
    Inserts a new user completed exam into the database
    """
    try:
        conn = connect()
        with conn.cursor() as cur:
            cur.execute(
                """
                INSERT INTO completed_exams (account, exam) 
                VALUES (%(account)s, %(exam)s);
                """, {
                    'account': user_id,
                    'exam': exam_id
                })

        conn.commit()
        log_completed_exams_success("Finished inserting the User Completed Exam into Database")
    except psycopg2.Error as e:
        log_completed_exams_error(f"Error inserting the User Completed Exam: {e}")
        conn.rollback()
        raise e
    finally:
        disconnect(conn)

def get_user_completed_exams(user_id: int, size=10) -> List[int]:
    """
    Gets a user's completed exams from the database
    """
    try:
        conn = connect()
        with conn.cursor() as cur:
            cur.execute(
                """
                SELECT exam FROM completed_exams 
                WHERE account = %(account)s 
                ORDER BY date_completed DESC 
                LIMIT %(size)s;
                """, {
                    "account": user_id,
                    "size": size
                    })
            exams = cur.fetchall()

        log_completed_exams_success("Finished getting the User Completed Exams from Database")
    except psycopg2.Error as e:
        log_completed_exams_error(f"Error getting the User Completed Exams: {e}")
        raise e
    finally:
        disconnect(conn)
    
    return [exam[0] for exam in exams] if exams else []
