import psycopg2

from typing import Optional

from logger import Logger

from database.helpers import connect, disconnect
from database.db_types.db_response import SessionDetailResponse
from database.db_types.db_request import SessionCreationRequest

def log_session_success(message: str):
    """
    Logs a successful exam operation
    """
    Logger.log_database("Session", message)

def log_session_error(message: str):
    """
    Logs an error in exam operation
    """
    Logger.log_database_error("Session", message)

def create_session(session: SessionCreationRequest) -> int:
    """
    Creates a session in the database.
    """
    try:
        conn = connect()
        with conn.cursor() as cur:
            cur.execute(
                """
                INSERT INTO sessions (refresh_id, account) VALUES (%(refresh_id)s, %(account)s) RETURNING id;
                """, {
                    'refresh_id': session.refresh_id,
                    'account': session.user
                }
            )
            
            session_id = cur.fetchone()

        conn.commit()
        log_session_success("Finished inserting the Session in Database")
    except psycopg2.Error as e:
        log_session_error(f"Error inserting the Session in Database: {e}")
        conn.rollback()
        raise e
    finally:
        disconnect(conn)

    return session_id[0]

def check_if_session_exists(session_id: int) -> bool:
    """
    Checks if the session exists in DB
    """
    try:
        conn = connect()
        with conn.cursor() as cur:
            cur.execute("SELECT EXISTS(SELECT 1 FROM sessions WHERE id = %(id)s);", {"id": session_id})
            exists = cur.fetchone()

        log_session_success("Finished checking if the Session exists in Database")
    except psycopg2.Error as e:
        log_session_error(f"Error checking if the Session exists: {e}")
        raise e
    finally:
        disconnect(conn)

    return exists[0]

def get_session(session_id: int) -> Optional[SessionDetailResponse]:
    """
    Fetches the information for a session in the DB
    """
    try:
        conn = connect()
        with conn.cursor() as cur:
            cur.execute("SELECT refresh_id, account FROM sessions WHERE id = %(id)s;", {"id": session_id})
            res = cur.fetchone()

            if res is None:
                return None

            refresh_id, user = res

        log_session_success("Finished getting information about the Session in Database")
    except psycopg2.Error as e:
        log_session_error(f"Error getting information about the Session: {e}")
        conn.rollback()
        raise e
    finally:
        disconnect(conn)

    return SessionDetailResponse(
        refresh_id=refresh_id,
        user=user
    )

def delete_session(session_id: int):
    """
    Deletes a session from the database
    """
    try:
        conn = connect()
        with conn.cursor() as cur:
            cur.execute("DELETE FROM sessions WHERE id = %(id)s;", {"id": session_id})

        conn.commit()
        log_session_success("Finished deleting the Session from Database")
    except psycopg2.Error as e:
        log_session_error(f"Error deleting the Session from Database: {e}")
        conn.rollback()
        raise e
    finally:
        disconnect(conn)

