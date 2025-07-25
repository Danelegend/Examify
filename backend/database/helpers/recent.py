from typing import List

import psycopg2

from logger import Logger

from database.helpers import connect, disconnect

def log_recent_success(message: str):
    """
    Logs a successful exam operation
    """
    Logger.log_database("Recent", message)

def log_recent_error(message: str):
    """
    Logs an error in exam operation
    """
    Logger.log_database_error("Recent", message)

def insert_user_recently_viewed_exam(user_id: int, exam_id: int):
    """
    Inserts a new user recently viewed exam into the database
    """
    try:
        conn = connect()
        with conn.cursor() as cur:
            cur.execute(
                """
                INSERT INTO recently_viewed_exams (account, exam) 
                VALUES (%(account)s, %(exam)s);
                """, {
                    'account': user_id,
                    'exam': exam_id
                })

        conn.commit()
        log_recent_success("Finished inserting the User Recently Viewed Exam into Database")
    except psycopg2.Error as e:
        log_recent_error(f"Error inserting the User Recently Viewed Exam: {e}")
        conn.rollback()
        raise e
    finally:
        disconnect(conn)

def get_user_recently_viewed_exams(user_id: int, size=10) -> List[int]:
    """
    Gets a user recently viewed exams from the database
    """
    try:
        conn = connect()
        with conn.cursor() as cur:
            cur.execute(
                """
                SELECT exam FROM recently_viewed_exams 
                WHERE account = %(account)s 
                ORDER BY date_viewed DESC 
                LIMIT %(size)s;
                """, {
                    "account": user_id,
                    "size": size
                    })
            exams = cur.fetchall()

        log_recent_success("Finished getting the User Recently Viewed Exams from Database")
    except psycopg2.Error as e:
        log_recent_error(f"Error getting the User Recently Viewed Exams: {e}")
        raise e
    finally:
        disconnect(conn)
    
    return [exam[0] for exam in exams] if exams else []
