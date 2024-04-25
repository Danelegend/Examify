import psycopg2

from typing import Optional

from logger import log_green, log_red

from database.helpers import connect, disconnect
from database.db_types.db_response import SessionDetailResponse
from database.db_types.db_request import SessionCreationRequest


def create_session(session: SessionCreationRequest) -> Optional[int]:
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
        log_green("Finished inserting the Session in Database")
    except psycopg2.Error as e:
        log_red(f"Error inserting the Session in Database: {e}")
        conn.rollback()
        raise e
    finally:
        disconnect(conn)
    
    if session_id:
        return session_id[0]
    
    return None

def check_if_session_exists(session_id: int) -> Optional[bool]:
    """
    Checks if the session exists in DB
    """
    try:
        conn = connect()
        with conn.cursor() as cur:
            cur.execute("SELECT EXISTS(SELECT 1 FROM sessions WHERE id = %(id)s);", {"id": session_id})
            exists = cur.fetchone()

        log_green("Finished checking if the Session exists in Database")
    except psycopg2.Error as e:
        log_red(f"Error checking if the Session exists: {e}")
        raise e
    finally:
        disconnect(conn)

    if exists:
        return exists[0]

    return None

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

        log_green("Finished getting information about the Session in Database")
    except psycopg2.Error as e:
        log_red(f"Error getting information about the Session: {e}")
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
        log_green("Finished deleting the Session from Database")
    except psycopg2.Error as e:
        log_red(f"Error deleting the Session from Database: {e}")
        conn.rollback()
        raise e
    finally:
        disconnect(conn)

