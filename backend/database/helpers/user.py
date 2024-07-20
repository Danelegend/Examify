from typing import List, Optional

import psycopg2

from logger import Logger

from database.helpers import connect, disconnect
from database.helpers.school import get_or_create_school
from database.db_types.db_request import RegistrationMethods, UserCreationRequest, UserUpdateRequest
from database.db_types.db_response import UserDetailsResponse

def log_user_success(message: str):
    """
    Logs a successful exam operation
    """
    Logger.log_database("User", message)

def log_user_error(message: str):
    """
    Logs an error in exam operation
    """
    Logger.log_database_error("User", message)

def insert_user(user: UserCreationRequest) -> int:
    """
    Inserts a new user into the database
    """
    try:
        conn = connect()
        with conn.cursor() as cur:
            cur.execute(
                """
                INSERT INTO accounts (first_name, last_name, email, phone, registeration_method, permission) 
                VALUES (%(first_name)s, %(last_name)s, %(email)s, %(phone)s, %(registration_method)s, %(permissions)s) RETURNING id;
                """, {
                    'first_name': user.first_name,
                    'last_name': user.last_name,
                    'email': user.email,
                    'phone': user.phone,
                    'registration_method': user.registration_method,
                    'permissions': user.permissions
                })

            user_id = cur.fetchone()

        conn.commit()
        log_user_success("Finished inserting the User into Database")
    except psycopg2.Error as e:
        log_user_error(f"Error inserting the User: {e}")
        conn.rollback()
        raise e
    finally:
        disconnect(conn)
    
    return user_id[0]

def check_if_user_exists(user_id: int) -> bool:
    """
    Checks if the user exists in DB
    """
    try:
        conn = connect()
        with conn.cursor() as cur:
            cur.execute("SELECT EXISTS(SELECT 1 FROM accounts WHERE id = %(id)s);", {"id": user_id})
            exists = cur.fetchone()

        log_user_success("Finished checking if the User exists in Database")
    except psycopg2.Error as e:
        log_user_error(f"Error checking if the User exists: {e}")
        raise e
    finally:
        disconnect(conn)

    return exists[0]

def get_user_id(email: str) -> int:
    """
    Gets the user id from the email
    """
    try:
        conn = connect()
        with conn.cursor() as cur:
            cur.execute("SELECT id FROM accounts WHERE email = %(email)s;", {"email": email})
            user_id = cur.fetchone()

        log_user_success("Finished getting the User ID from Database")
    except psycopg2.Error as e:
        log_user_error(f"Error getting the User ID: {e}")
        raise e
    finally:
        disconnect(conn)

    return user_id[0]

def get_user_permissions(user_id: int) -> str:
    """
    Gets the permissions of the user
    """
    try:
        conn = connect()
        with conn.cursor() as cur:
            cur.execute("SELECT permission FROM accounts WHERE id = %(id)s;", {"id": user_id})
            permissions = cur.fetchone()

        log_user_success("Finished getting the User Permissions from Database")
    except psycopg2.Error as e:
        log_user_error(f"Error getting the User Permissions: {e}")
        raise e
    finally:
        disconnect(conn)

    return permissions[0]

def update_user(user_update_request: UserUpdateRequest):
    """
    Updates the user in the database
    """
    def construct_query(user_update_request: UserUpdateRequest) -> str:
        """
        Constructs the query for updating the user in the database
        """
        query = "UPDATE accounts SET "
        if user_update_request.phone is not None:
            query += f"phone = '{user_update_request.phone}', "
        if user_update_request.dob is not None:
            query += f"dob = '{user_update_request.dob}', "
        if user_update_request.grade is not None:
            query += f"grade = {user_update_request.grade}, "
        if user_update_request.school is not None:
            query += f"school = '{get_or_create_school(user_update_request.school)}', "
        if user_update_request.permission is not None:
            query += f"permission = '{user_update_request.permission}', "
        
        query = query[:-2] + f" WHERE id = {user_update_request.user_id};"
        return query

    try:
        conn = connect()
        with conn.cursor() as cur:
            cur.execute(
                construct_query(user_update_request)
            )

        conn.commit()
        log_user_success("Finished updating the User in Database")
    except psycopg2.Error as e:
        log_user_error(f"Error updating the User: {e}")
        conn.rollback()
        raise e
    finally:
        disconnect(conn)

def check_user_email_exists(email: str) -> bool:
    """
    Checks if the user email exists in DB
    """
    try:
        conn = connect()
        with conn.cursor() as cur:
            cur.execute("SELECT EXISTS(SELECT 1 FROM accounts WHERE email = %(email)s);", {"email": email})
            exists = cur.fetchone()

        log_user_success("Finished checking if the User email exists in Database")
    except psycopg2.Error as e:
        log_user_error(f"Error checking if the User email exists: {e}")
        raise e
    finally:
        disconnect(conn)

    return exists[0]

def get_user_details(user_id: int) -> UserDetailsResponse:
    """
    Gets the user details from the user id
    """
    try:
        conn = connect()
        with conn.cursor() as cur:
            cur.execute(
                """
                SELECT first_name, last_name, email, phone, registeration_method, permission, school, grade 
                FROM accounts 
                WHERE id = %(id)s;
                """, {"id": user_id})
            first_name, last_name, email, phone, registration, permissions, school, grade = cur.fetchone()

        log_user_success("Finished getting the User Details from Database")
    except psycopg2.Error as e:
        log_user_error(f"Error getting the User Details: {e}")
        raise e
    finally:
        disconnect(conn)

    return UserDetailsResponse(
        first_name=first_name,
        last_name=last_name,
        email=email,
        phone=phone,
        registration_method=registration,
        permissions=permissions,
        school=school,
        grade=grade
   )

def get_user_by_email_and_registration(email: str, registration_method: RegistrationMethods) -> Optional[int]:
    """
    Gets the user id from email and registration method
    """
    try:
        conn = connect()
        with conn.cursor() as cur:
            cur.execute("SELECT id FROM accounts WHERE email = %(email)s AND registeration_method = %(registration_method)s;", {"email": email, "registration_method": registration_method})
            user_id = cur.fetchone()

        log_user_success("Finished getting the User from Email and Registration Method in Database")
    except psycopg2.Error as e:
        log_user_error(f"Error getting the User from Email and Registration Method: {e}")
        raise e
    finally:
        disconnect(conn)

    return user_id[0] if user_id else None

def get_user_subjects(user_id: int) -> List[str]:
    """
    Gets the subjects of the user
    """
    try:
        conn = connect()
        with conn.cursor() as cur:
            cur.execute("SELECT subject FROM user_subjects WHERE account = %(id)s;", {"id": user_id})
            subjects = cur.fetchall()

        log_user_success("Finished getting the User Subjects from Database")
    except psycopg2.Error as e:
        log_user_error(f"Error getting the User Subjects: {e}")
        raise e
    finally:
        disconnect(conn)

    return [subject for subject in subjects]

def insert_user_subject(user_id: int, subject: str):
    """
    Inserts a new subject for the user
    """
    try:
        conn = connect()
        with conn.cursor() as cur:
            cur.execute(
                """
                INSERT INTO user_subjects (account, subject) 
                VALUES (%(account)s, %(subject)s);
                """, {
                    'account': user_id,
                    'subject': subject
                })

        conn.commit()
        log_user_success("Finished inserting the User Subject into Database")
    except psycopg2.Error as e:
        log_user_error(f"Error inserting the User Subject: {e}")
        conn.rollback()
        raise e
    finally:
        disconnect(conn)

def get_users() -> List[UserDetailsResponse]:
    """
    Gets all the users in the database
    """
    try:
        conn = connect()
        with conn.cursor() as cur:
            cur.execute(
                """
                SELECT a.first_name, a.last_name, a.email, a.phone, a.registeration_method, a.permission, s.name, a.grade 
                FROM accounts a
                LEFT JOIN schools s ON a.school = s.id;
                """)
            users = cur.fetchall()

        log_user_success("Finished getting all the Users from Database")
    except psycopg2.Error as e:
        log_user_error(f"Error getting all the Users: {e}")
        raise e
    finally:
        disconnect(conn)

    return [UserDetailsResponse(
        first_name=first_name,
        last_name=last_name,
        email=email,
        phone=phone,
        registration_method=registration,
        permissions=permissions,
        school=school,
        grade=grade
    ) for first_name, last_name, email, phone, registration, permissions, school, grade in users]
