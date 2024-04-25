import psycopg2

from logger import log_green, log_red

from database.helpers import connect, disconnect
from database.db_types.db_request import SchoolCreationRequest
from database.db_types.db_response import SchoolDetailsResponse

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

        log_green("Finished inserting the School into Database")
    except psycopg2.Error as e:
        log_red(f"Error inserting the School: {e}")
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

        log_green("Finished getting the School from Database")
    except psycopg2.Error as e:
        log_red(f"Error getting the School: {e}")
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

        log_green("Finished getting the School from Database")
    except psycopg2.Error as e:
        log_red(f"Error getting the School: {e}")
        raise e
    finally:
        disconnect(conn)
    
    return SchoolDetailsResponse(
        name=school, 
        logo_location=logo_location
    )

def get_schools() -> list[SchoolDetailsResponse]:
    """
    Gets all schools from the database
    """
    try:
        conn = connect()
        with conn.cursor() as cur:
            cur.execute("SELECT id, name, logo_location FROM schools;")
            schools = cur.fetchall()

        log_green("Finished getting all Schools from Database")
    except psycopg2.Error as e:
        log_red(f"Error getting all Schools: {e}")
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
            school = cur.fetchone()

            if not school:
                cur.execute(
                    """
                    INSERT INTO schools (name) 
                    VALUES (%(name)s) RETURNING id;
                    """, {
                        'name': school
                    })

                school_id = cur.fetchone()
            else:
                school_id = school[0]

        log_green("Finished getting or creating the School from Database")
    except psycopg2.Error as e:
        log_red(f"Error getting or creating the School: {e}")
        raise e
    finally:
        disconnect(conn)
    
    if not school:
        return SchoolDetailsResponse(
            name=school, 
            logo_location=None
        )
    
    return SchoolDetailsResponse(
        name=school[1], 
        logo_location=school[2]
    )

def get_or_create_school(school: str) -> int:
    """
    Gets or creates a school in the database
    """
    try:
        conn = connect()
        with conn.cursor() as cur:
            cur.execute("SELECT id FROM schools WHERE name = %(name)s;", {"name": school})
            school = cur.fetchone()

            if not school:
                cur.execute(
                    """
                    INSERT INTO schools (name) 
                    VALUES (%(name)s) RETURNING id;
                    """, {
                        'name': school
                    })

                school_id = cur.fetchone()
            else:
                school_id = school[0]

        log_green("Finished getting or creating the School from Database")
    except psycopg2.Error as e:
        log_red(f"Error getting or creating the School: {e}")
        raise e
    finally:
        disconnect(conn)
    
    return school_id
