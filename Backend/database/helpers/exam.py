from typing import List, Optional

import psycopg2

from logger import log_green, log_red

from database.helpers import connect, disconnect
from database.helpers.school import get_school_by_id
from database.db_types.db_request import ExamCreationRequest, ExamFilterRequest
from database.db_types.db_response import ExamDetailsResponse

def insert_exam(exam: ExamCreationRequest) -> int:
    """
    Inserts a new exam into the database
    """
    try:
        conn = connect()
        with conn.cursor() as cur:
            cur.execute(
                """
                INSERT INTO exams (school, exam_type, year, file_location, subject) 
                VALUES (%(school)s, %(exam_type)s, %(year)s, %(file_location)s, %(subject)s) RETURNING id;
                """, {
                    'school': exam.school,
                    'exam_type': exam.exam_type,
                    'year': exam.year,
                    'file_location': exam.file_location,
                    'subject': exam.subject
                })

            exam_id = cur.fetchone()

        conn.commit()
        log_green("Finished inserting the Exam into Database")
    except psycopg2.Error as e:
        log_red(f"Error inserting the Exam: {e}")
        conn.rollback()
        raise e
    finally:
        disconnect(conn)
    
    return exam_id[0]


def get_exam(exam_id: int) -> ExamDetailsResponse:
    """
    Gets a exam from the database
    """
    try:
        conn = connect()
        with conn.cursor() as cur:
            cur.execute("SELECT school, exam_type, year, file_location, date_uploaded, subject FROM exams WHERE id = %(id)s;", {"id": exam_id})
            exam = cur.fetchone()

            school, exam_type, year, file_location, date_uploaded, subject = exam

        log_green("Finished getting the Exam from Database")
    except psycopg2.Error as e:
        log_red(f"Error getting the Exam: {e}")
        raise e
    finally:
        disconnect(conn)
    
    return ExamDetailsResponse(id=exam_id,
                               school=school, 
                               exam_type=exam_type, 
                               year=year, 
                               file_location=file_location, 
                               date_uploaded=date_uploaded, 
                               subject=subject)

def get_exams() -> List[ExamDetailsResponse]:
    """
    Gets all exams from the database
    """
    try:
        conn = connect()
        with conn.cursor() as cur:
            cur.execute("SELECT id, school, exam_type, year, file_location, date_uploaded, subject FROM exams;")
            exams = cur.fetchall()

        log_green("Finished getting the Exams from Database")
    except psycopg2.Error as e:
        log_red(f"Error getting the Exams: {e}")
        raise e
    finally:
        disconnect(conn)

    return [ExamDetailsResponse(id=id,
                                school=get_school_by_id(school).name, 
                                exam_type=exam_type, 
                                year=year, 
                                file_location=file_location, 
                                date_uploaded=date_uploaded, 
                                subject=subject) for id, school, exam_type, year, file_location, date_uploaded, subject in exams]

def get_exams_using_filter(exam_filter_request: ExamFilterRequest) -> List[ExamDetailsResponse]:
    """
    Get a list of exams that meet the filter criteria
    """
    try:
        conn = connect()
        with conn.cursor() as cur:
            cur.execute(
                """
                SELECT id, school, exam_type, year, file_location, date_uploaded, subject 
                FROM exams WHERE school = (
                SELECT id FROM schools WHERE name = %(school)s
                ) AND exam_type = %(exam_type)s AND year = %(year)s;
                """, {
                    "school": exam_filter_request.school, 
                    "exam_type": exam_filter_request.exam_type, 
                    "year": exam_filter_request.year
                })
            exams = cur.fetchall()

        log_green("Finished getting the Exams from Database using Filter")
    except psycopg2.Error as e:
        log_red(f"Error getting the Exams using Filter: {e}")
        raise e
    finally:
        disconnect(conn)
    
    return [ExamDetailsResponse(id=id,
                                school=school, 
                                exam_type=exam_type, 
                                year=year, 
                                file_location=file_location, 
                                date_uploaded=date_uploaded, 
                                subject=subject) for id, school, exam_type, year, file_location, date_uploaded, subject in exams]

def delete_exam(exam_id: int):
    """
    Deletes a exam from the database
    """
    try:
        conn = connect()
        with conn.cursor() as cur:
            cur.execute("DELETE FROM exams WHERE id = %(id)s;", {"id": exam_id})

        conn.commit()
        log_green("Finished deleting the Exam from Database")
    except psycopg2.Error as e:
        log_red(f"Error deleting the Exam: {e}")
        conn.rollback()
        raise e
    finally:
        disconnect(conn)

def get_exam_id_from_schoool_year_type(school: str, year: int, type: str) -> Optional[int]:
    """
    Gets the exam id from school, year and type
    """
    try:
        conn = connect()
        with conn.cursor() as cur:
            cur.execute("SELECT id FROM exams WHERE school = (SELECT id FROM schools WHERE name = %(school)s) AND year = %(year)s AND exam_type = %(type)s;", {"school": school, "year": year, "type": type})
            exam_id = cur.fetchone()

        log_green("Finished getting the Exam ID from School, Year and Type in Database")
    except psycopg2.Error as e:
        log_red(f"Error getting the Exam ID from School, Year and Type: {e}")
        raise e
    finally:
        disconnect(conn)
    
    return exam_id[0] if exam_id else None

def check_exam_exists(exam_id: int) -> bool:
    """
    Checks if the exam exists in DB
    """
    try:
        conn = connect()
        with conn.cursor() as cur:
            cur.execute("SELECT EXISTS(SELECT 1 FROM exams WHERE id = %(id)s);", {"id": exam_id})
            exists = cur.fetchone()

        log_green("Finished checking if the Exam exists in Database")
    except psycopg2.Error as e:
        log_red(f"Error checking if the Exam exists: {e}")
        raise e
    finally:
        disconnect(conn)
    
    return exists[0]