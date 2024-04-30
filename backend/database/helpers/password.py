from typing import List, Optional

import psycopg2

from logger import Logger

from database.db_types.db_request import PasswordCreationRequest
from database.helpers import connect, disconnect

def log_password_success(message: str):
    """
    Logs a successful exam operation
    """
    Logger.log_database("Password", message)

def log_password_error(message: str):
    """
    Logs an error in exam operation
    """
    Logger.log_database_error("Password", message)

def insert_password(password: PasswordCreationRequest):
    """
    Inserts a new password into the database
    """
    try:
        conn = connect()
        with conn.cursor() as cur:
            cur.execute(
                """
                INSERT INTO passwords (account, password) 
                VALUES (%(account)s, %(password)s);
                """, {
                    'account': password.user_id,
                    'password': password.password
                })

        conn.commit()
        log_password_success("Finished inserting the Password into Database")
    except psycopg2.Error as e:
        log_password_error(f"Error inserting the Password: {e}")
        conn.rollback()
        raise e
    finally:
        disconnect(conn)

def check_user_id_and_password_match(user: int, password: str) -> bool:
    """
    Checks if the user and password match in DB
    """
    try:
        conn = connect()
        with conn.cursor() as cur:
            cur.execute("SELECT EXISTS(SELECT 1 FROM passwords WHERE account = %(account)s AND password = %(password)s);", {"account": user, "password": password})
            exists = cur.fetchone()

        log_password_success("Finished checking if the User and Password match in Database")
    except psycopg2.Error as e:
        log_password_error(f"Error checking if the User and Password match: {e}")
        raise e
    finally:
        disconnect(conn)

    return exists[0]

def get_user_from_email_and_password(email: str, password: str) -> Optional[int]:
    """
    Gets the user id from email and password
    """
    try:
        conn = connect()
        with conn.cursor() as cur:
            cur.execute("SELECT account FROM passwords WHERE account = (SELECT id FROM accounts WHERE email = %(email)s) AND password = %(password)s;", {"email": email, "password": password})
            user_id = cur.fetchone()

        log_password_success("Finished getting the User from Email and Password in Database")
    except psycopg2.Error as e:
        log_password_error(f"Error getting the User from Email and Password: {e}")
        raise e
    finally:
        disconnect(conn)

    return user_id[0] if user_id else None
