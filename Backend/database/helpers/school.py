import psycopg2

from typing import List

from logger import Logger

from database.helpers import connect, disconnect
from database.db_types.db_request import SchoolCreationRequest
from database.db_types.db_response import SchoolDetailsResponse

def log_school_success(message: str):
    """
    Logs a successful exam operation
    """
    Logger.log_database("Recent", message)

def log_school_error(message: str):
    """
    Logs an error in exam operation
    """
    Logger.log_database_error("Recent", message)

def insert_school(school: SchoolCreationRequest) -> int:
    """
    Inserts a new school into the database
    """
    try:
        conn = connect()
        with conn.cursor() as cur:
            cur.execute(
                """
                INSERT INTO schools (name, logo_location) 
                VALUES (%(name)s, %(logo_location)s) RETURNING id;
                """, {
                    'name': school.name,
                    'logo_location': school.logo_location
                })

            school_id = cur.fetchone()

        conn.commit()
        log_school_success("Finished inserting the School into Database")
    except psycopg2.Error as e:
        log_school_error(f"Error inserting the School: {e}")
        conn.rollback()
        raise e
    finally:
        disconnect(conn)
    
    return school_id[0]


def get_school_by_id(school_id: int) -> SchoolDetailsResponse:
    """
    Gets a school from the database
    """
    try:
        conn = connect()
        with conn.cursor() as cur:
            cur.execute("SELECT name, logo_location FROM schools WHERE id = %(id)s;", {"id": school_id})
            school = cur.fetchone()

            name, logo_location = school

        log_school_success("Finished getting the School from Database")
    except psycopg2.Error as e:
        log_school_error(f"Error getting the School: {e}")
        raise e
    finally:
        disconnect(conn)
    
    return SchoolDetailsResponse(
        name=name, 
        logo_location=logo_location
    )

def get_school_by_name(school: str) -> SchoolDetailsResponse:
    """
    Gets a school from the database
    """
    try:
        conn = connect()
        with conn.cursor() as cur:
            cur.execute("SELECT id, logo_location FROM schools WHERE name = %(name)s;", {"name": school})
            school = cur.fetchone()

            _, logo_location = school

        log_school_success("Finished getting the School from Database")
    except psycopg2.Error as e:
        log_school_error(f"Error getting the School: {e}")
        raise e
    finally:
        disconnect(conn)
    
    return SchoolDetailsResponse(
        name=school, 
        logo_location=logo_location
    )

def get_schools() -> List[SchoolDetailsResponse]:
    """
    Gets all schools from the database
    """
    try:
        conn = connect()
        with conn.cursor() as cur:
            cur.execute("SELECT id, name, logo_location FROM schools;")
            schools = cur.fetchall()

        log_school_success("Finished getting all Schools from Database")
    except psycopg2.Error as e:
        log_school_error(f"Error getting all Schools: {e}")
        raise e
    finally:
        disconnect(conn)
    
    return [
        SchoolDetailsResponse(
            name=name, 
            logo_location=logo_location
        ) for _, name, logo_location in schools
    ]


def get_or_create_school(school: str) -> int:
    """
    Gets or creates a school in the database
    """
    try:
        conn = connect()
        with conn.cursor() as cur:
            cur.execute("SELECT id FROM schools WHERE name = %(name)s;", {"name": school})
            res = cur.fetchone()

            school_id = insert_school(SchoolCreationRequest(
                    name=school
                )) if not res else res[0]

        log_school_success("Finished getting or creating the School from Database")
    except psycopg2.Error as e:
        log_school_error(f"Error getting or creating the School: {e}")
        raise e
    finally:
        disconnect(conn)
    
    return school_id
