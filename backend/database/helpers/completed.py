from typing import List

import psycopg2

from database.db_types.db_response import CompletedExamsResponse, ExamDetailsResponse

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

def get_user_completed_exams(user_id: int, size=10) -> List[CompletedExamsResponse]:
    """
    Gets a user's completed exams from the database
    """
    try:
        conn = connect()
        with conn.cursor() as cur:
            cur.execute(
                """
                SELECT exam, date_completed FROM completed_exams 
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

    return [CompletedExamsResponse(
        exam=exam_id,
        date_complete=date_complete
    ) for exam_id, date_complete in exams]

def get_exam_ids_completed_by_user(user_id: int) -> List[int]:
    """
    Gets the exams completed by a user from the database
    """
    try:
        conn = connect()
        with conn.cursor() as cur:
            cur.execute(
                """
                SELECT DISTINCT exam FROM completed_exams 
                WHERE account = %(account)s;
                """, {
                    "account": user_id
                    })
            exams = cur.fetchall()

        log_completed_exams_success("Finished getting Exams Completed by User from Database")
    except psycopg2.Error as e:
        log_completed_exams_error(f"Error getting the Exams Completed by User: {e}")
        raise e
    finally:
        disconnect(conn)

    return [exam_id for exam_id in exams]

def remove_user_completed_exam(user_id: int, exam_id: int):
    """
    Given a user id and an exam id for a user, deletes a corresponding
    marking of exam completion
    """
    try:
        conn = connect()
        with conn.cursor() as cur:
            cur.execute(
                """
                DELETE FROM completed_exams
                WHERE account = %(account)s AND exam = %(exam)s
                """, {
                    'account': user_id,
                    'exam': exam_id
                })
        conn.commit()
        log_completed_exams_success("Succesffully removed completed exam denotion")
    except psycopg2.Error as e:
        log_completed_exams_error(f"Error removing completed exam from Database: {e}")
        conn.rollback()
        raise e
    finally:
        disconnect(conn)

def check_if_user_complete_exam_exists(user_id: int, exam_id: int) -> bool:
    """
    Checks if the user complete exam entry exists in DB
    """
    try:
        conn = connect()
        with conn.cursor() as cur:
            cur.execute("SELECT EXISTS(SELECT 1 FROM completed_exams WHERE account = %(account)s AND exam = %(exam)s);", {"account": user_id, "exam": exam_id})
            exists = cur.fetchone()

        log_completed_exams_success("Finished checking if the User Completed Exam exists in Database")
    except psycopg2.Error as e:
        log_completed_exams_error(f"Error checking if the User Completed Exam exists: {e}")
        raise e
    finally:
        disconnect(conn)

    return exists[0] if exists else False

def get_exams_completed_by_user(user_id: int) -> List[ExamDetailsResponse]:
    """
    Gets the exams completed by a user
    """
    try:
        conn = connect()
        with conn.cursor() as cur:
            cur.execute(
                """
                SELECT e.id, s.school, e.exam_type, e.year, e.file_location, e.date_uploaded, e.subject, COUNT(fe.exam) AS likes, e.difficulty
                FROM exams e
                LEFT JOIN favourite_exams fe ON e.id = fe.exam
                LEFT JOIN completed_exams c ON e.id = c.exam
                LEFT JOIN schools s ON e.school = s.id
                WHERE c.account = %(account)s
                GROUP BY e.id, s.school, e.exam_type, e.year, e.file_location, e.date_uploaded, e.subject;
                """, {
                    "account": user_id
                    })
            exams = cur.fetchall()

        log_completed_exams_success("Finished getting Exams Completed by User from Database")
    except psycopg2.Error as e:
        log_completed_exams_error(f"Error getting the Exams Completed by User: {e}")
        raise e
    finally:
        disconnect(conn)

    return [ExamDetailsResponse(
        id=exam_id,
        school=school,
        exam_type=exam_type,
        year=year,
        file_location=file_location,
        date_uploaded=date_uploaded,
        subject=subject,
        difficulty=difficulty,
        likes=likes
    ) for exam_id, school, exam_type, year, file_location, date_uploaded, subject, likes, difficulty in exams]
