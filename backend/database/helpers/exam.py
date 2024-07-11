from typing import List, Literal, Optional

import psycopg2

from logger import Logger

from database.helpers import connect, disconnect
from database.helpers.school import get_or_create_school, get_school_by_id
from database.db_types.db_request import ExamCreationRequest, ExamFilterRequest, ExamTypes, ExamUpdateRequest
from database.db_types.db_response import ExamDetailsResponse

from router.api_types.api_request import ExamsFilter

def log_exam_success(message: str):
    """
    Logs a successful exam operation
    """
    Logger.log_database("Exam", message)

def log_exam_error(message: str):
    """
    Logs an error in exam operation
    """
    Logger.log_database_error("Exam", message)

def insert_exam(exam: ExamCreationRequest) -> int:
    """
    Inserts a new exam into the database
    """
    log_exam_success(f"Inserting a new Exam into Database \
                        school={exam.school}, exam_type={exam.exam_type}, year={exam.year}, \
                            file_location={exam.file_location}, subject={exam.subject}")
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
        log_exam_success(f"Finished inserting the Exam into Database, exam_id={exam_id[0]}")
    except psycopg2.Error as e:
        log_exam_error(f"Error inserting the Exam: {e}")
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
            cur.execute("""
                        SELECT e.school, e.exam_type, e.year, e.file_location, e.date_uploaded, e.subject, COUNT(fe.exam) AS likes
                        FROM exams e
                        LEFT JOIN favourite_exams fe ON e.id = fe.exam
                        WHERE e.id = %(id)s
                        GROUP BY e.school, e.exam_type, e.year, e.file_location, e.date_uploaded, e.subject;
                        """, {"id": exam_id})
            exam = cur.fetchone()

            school, exam_type, year, file_location, date_uploaded, subject, likes = exam

        log_exam_success("Finished getting the Exam from Database")
    except psycopg2.Error as e:
        log_exam_error(f"Error getting the Exam: {e}")
        raise e
    finally:
        disconnect(conn)
    
    return ExamDetailsResponse(id=exam_id,
                               school=get_school_by_id(school).name, 
                               exam_type=exam_type, 
                               year=year, 
                               file_location=file_location, 
                               date_uploaded=date_uploaded, 
                               subject=subject,
                               likes=likes)

def get_exam_id_from_file_location(file_location: str) -> Optional[int]:
    """
    Gets the exam id from the file location
    """
    try:
        conn = connect()
        with conn.cursor() as cur:
            cur.execute("SELECT id FROM exams WHERE file_location = %(file_location)s;", {"file_location": file_location})
            exam_id = cur.fetchone()

        log_exam_success("Finished getting the Exam ID from File Location in Database")
    except psycopg2.Error as e:
        log_exam_error(f"Error getting the Exam ID from File Location: {e}")
        raise e
    finally:
        disconnect(conn)
    
    return exam_id[0] if exam_id else None

def get_exams() -> List[ExamDetailsResponse]:
    """
    Gets all exams from the database
    """
    try:
        conn = connect()
        with conn.cursor() as cur:
            cur.execute("""
                        SELECT e.id, e.school, e.exam_type, e.year, e.file_location, e.date_uploaded, e.subject, COUNT(fe.exam) AS likes
                        FROM exams e
                        LEFT JOIN favourite_exams fe ON e.id = fe.exam
                        GROUP BY e.id, e.school, e.exam_type, e.year, e.file_location, e.date_uploaded, e.subject;
                        """)
            exams = cur.fetchall()

        log_exam_success("Finished getting the Exams from Database")
    except psycopg2.Error as e:
        log_exam_error(f"Error getting the Exams: {e}")
        raise e
    finally:
        disconnect(conn)

    return [ExamDetailsResponse(id=id,
                                school=get_school_by_id(school).name, 
                                exam_type=exam_type, 
                                year=year, 
                                file_location=file_location, 
                                date_uploaded=date_uploaded, 
                                subject=subject,
                                likes=likes) for id, school, exam_type, year, file_location, date_uploaded, subject, likes in exams]

def get_exams_with_pagination(start: int, size: int, filter: ExamsFilter, sort: Literal["relevance", "newest", "oldest", "most liked", "least liked", "recently uploaded"]) -> List[ExamDetailsResponse]:
    """
    Gets all exams in the bounds start <= exam < start + size
    """
    s = """
    SELECT e.id, s.name, e.exam_type, e.year, e.file_location, e.date_uploaded, e.subject, COUNT(fe.exam) AS likes
    FROM exams e
    LEFT JOIN favourite_exams fe ON e.id = fe.exam
    LEFT JOIN schools s ON e.school = s.id
    """

    where_flag = True

    for i in range(len(filter.schools)):
        if i == 0:
            if where_flag:
                s += f"\nWHERE s.name = \'{filter.schools[i]}\'"
                where_flag = False
            else:
                s+= f" OR s.name = \'{filter.schools[i]}\'"
        else:
            s += f" OR s.name = \'{filter.schools[i]}\'"
        
    for i in range(len(filter.subjects)):
        if i == 0:
            if where_flag:
                s += f"\nWHERE e.subject = \'{filter.subjects[i]}\'"
                where_flag = False
            else:
                s += f" OR e.subject = \'{filter.subjects[i]}\'"
        else:
            s += f" OR e.subject = \'{filter.subjects[i]}\'"
        
    for i in range(len(filter.years)):
        if i == 0:
            if where_flag:
                s += f"\nWHERE e.year = {filter.years[i]}"
                where_flag = False
            else:
                s += f" OR e.year = {filter.years[i]}"
        else:
            s += f" OR e.year = {filter.years[i]}"

    s += """
        GROUP BY e.id, s.name, e.exam_type, e.year, e.file_location, e.date_uploaded, e.subject
        """
    
    def sql_from_sort_strategy(sort: str):
        ret = "ORDER BY "

        if sort == "relevance":
            ret += "e.year DESC"
        elif sort == "newest":
            ret += "e.year DESC"
        elif sort == "oldest":
            ret += "e.year ASC"
        elif sort == "most liked":
            ret += "likes DESC"
        elif sort == "least liked":
            ret += "likes ASC"
        elif sort == "recently uploaded":
            ret += "e.date_uploaded DESC"
        else:
            raise Exception()

        return ret
    
    s += sql_from_sort_strategy(sort)

    s += """
        LIMIT %(size)s OFFSET %(start)s;
        """

    try:
        conn = connect()
        with conn.cursor() as cur:
            cur.execute(s, {
                            'size': size,
                            'start': start
                        })
            exams = cur.fetchall()

        log_exam_success("Finished getting the Exams from Database in pagination fashion")
    except psycopg2.Error as e:
        log_exam_error(f"Error getting the Exams: {e}")
        raise e
    finally:
        disconnect(conn)

    return [ExamDetailsResponse(id=id,
                                school=school, 
                                exam_type=exam_type, 
                                year=year, 
                                file_location=file_location, 
                                date_uploaded=date_uploaded, 
                                subject=subject,
                                likes=likes) for id, school, exam_type, year, file_location, date_uploaded, subject, likes in exams]

def get_exams_using_filter(exam_filter_request: ExamFilterRequest) -> List[ExamDetailsResponse]:
    """
    Get a list of exams that meet the filter criteria
    """
    try:
        conn = connect()
        with conn.cursor() as cur:
            cur.execute(
                """
                SELECT e.school, e.exam_type, e.year, e.file_location, e.date_uploaded, e.subject, COUNT(fe.exam) AS likes
                FROM exams e
                LEFT JOIN favourite_exams fe ON e.id = fe.exam
                WHERE school = (SELECT id FROM schools WHERE name = %(school)s) AND exam_type = %(exam_type)s AND year = %(year)s
                GROUP BY e.school, e.exam_type, e.year, e.file_location, e.date_uploaded, e.subject;
                """, {
                    "school": exam_filter_request.school, 
                    "exam_type": exam_filter_request.exam_type, 
                    "year": exam_filter_request.year
                })
            exams = cur.fetchall()

        log_exam_success("Finished getting the Exams from Database using Filter")
    except psycopg2.Error as e:
        log_exam_error(f"Error getting the Exams using Filter: {e}")
        raise e
    finally:
        disconnect(conn)
    
    return [ExamDetailsResponse(id=id,
                                school=school, 
                                exam_type=exam_type, 
                                year=year, 
                                file_location=file_location, 
                                date_uploaded=date_uploaded, 
                                subject=subject,
                                likes=likes) for id, school, exam_type, year, file_location, date_uploaded, subject, likes in exams]

def delete_exam(exam_id: int):
    """
    Deletes a exam from the database
    """
    try:
        conn = connect()
        with conn.cursor() as cur:
            cur.execute("DELETE FROM exams WHERE id = %(id)s;", {"id": exam_id})

        conn.commit()
        log_exam_success("Finished deleting the Exam from Database")
    except psycopg2.Error as e:
        log_exam_error(f"Error deleting the Exam: {e}")
        conn.rollback()
        raise e
    finally:
        disconnect(conn)

def get_exam_id_from_subject_school_year_type(subject: str, school: str, year: int, type: ExamTypes) -> Optional[int]:
    """
    Gets the exam id from school, year and type
    """
    try:
        conn = connect()
        with conn.cursor() as cur:
            cur.execute("""
                        SELECT id 
                        FROM exams 
                        WHERE school = (SELECT id FROM schools WHERE name = %(school)s) AND year = %(year)s AND exam_type = %(type)s AND subject = %(subject)s;
                        """, {"school": school, "year": year, "type": type, "subject": subject})
            exam_id = cur.fetchone()

        log_exam_success("Finished getting the Exam ID from School, Year and Type in Database")
    except psycopg2.Error as e:
        log_exam_error(f"Error getting the Exam ID from School, Year and Type: {e}")
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

        log_exam_success("Finished checking if the Exam exists in Database")
    except psycopg2.Error as e:
        log_exam_error(f"Error checking if the Exam exists: {e}")
        raise e
    finally:
        disconnect(conn)
    
    return exists[0]

def update_exam(request: ExamUpdateRequest) -> None:
    """
    Updates the exam in the database
    """
    def construct_query(request: ExamUpdateRequest) -> str:
        s = "UPDATE exams SET "

        if request.school:
            s += f"school = {get_or_create_school(request.school)}, "
        if request.exam_type:
            s += f"exam_type = '{request.exam_type}', "
        if request.year:
            s += f"year = {request.year}, "
        if request.subject:
            s += f"subject = '{request.subject}', "
        if request.file_location:
            s += f"file_location = '{request.file_location}', "

        s = s[:-2]

        s += f" WHERE id = {request.id};"

        return s

    try:
        conn = connect()
        with conn.cursor() as cur:
            s = construct_query(request)
            Logger.log_debug(s)
            cur.execute(s)
        conn.commit()
        log_exam_success("Finished updating the Exam in Database")
    except psycopg2.Error as e:
        log_exam_error(f"Error updating the Exam: {e}")
        conn.rollback()
        raise e
    finally:
        disconnect(conn)

def insert_exam_flag(exam_id: int) -> None:
    """
    Flags an exam in the database
    """
    try:
        conn = connect()
        with conn.cursor() as cur:
            cur.execute("INSERT INTO flagged_exams (exam) VALUES (%(exam)s);", {"exam": exam_id})
        conn.commit()
        log_exam_success("Finished inserting the Exam Flag into Database")
    except psycopg2.Error as e:
        log_exam_error(f"Error inserting the Exam Flag: {e}")
        conn.rollback()
        raise e
    finally:
        disconnect(conn)
