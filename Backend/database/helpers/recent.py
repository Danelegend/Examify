from typing import List, Optional

import psycopg2

from logger import log_green, log_red

from database.helpers import connect, disconnect

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
        log_green("Finished inserting the User Recently Viewed Exam into Database")
    except psycopg2.Error as e:
        log_red(f"Error inserting the User Recently Viewed Exam: {e}")
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
                LIMIT %(size)s
                ORDERBY date_viewed desc;
                """, {
                    "account": user_id,
                    "size": size
                    })
            exams = cur.fetchall()

        log_green("Finished getting the User Recently Viewed Exams from Database")
    except psycopg2.Error as e:
        log_red(f"Error getting the User Recently Viewed Exams: {e}")
        raise e
    finally:
        disconnect(conn)
    
    return [exam[0] for exam in exams] if exams else []
