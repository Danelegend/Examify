from typing import List

import psycopg2

from logger import Logger

from database.db_types.db_request import NotificationCreationRequest
from database.db_types.db_response import NotificationResponse
from database.helpers import connect, disconnect

def log_notification_success(message: str):
    """
    Logs a successful notification operation
    """
    Logger.log_database("Notification", message)

def log_notification_error(message: str):
    """
    Logs an error in a notification operation
    """
    Logger.log_database_error("Notification", message)

def insert_notification(notification_request: NotificationCreationRequest):
    """
    Inserts a new notification into the database
    """
    try:
        conn = connect()
        with conn.cursor() as cur:
            cur.execute(
                """
                INSERT INTO notifications (user, sender, title, message, link)
                VALUES (%(user)s, %(sender)s, %(title)s, %(message)s, %(link)s);
                """, 
                {
                    'user': notification_request.user_id,
                    'sender': notification_request.sender_id,
                    'title': notification_request.title,
                    'message': notification_request.message,
                    'link': notification_request.link
                }
            )
            conn.commit()
            log_notification_success("Finished inserting notification into the database")
    except psycopg2.Error as e:
        log_notification_error(f"Error inserting the notification: {e}")
        conn.rollback()
        raise e
    finally:
        disconnect(conn)
            
def get_user_notifications(user_id: int) -> List[NotificationResponse]:
    """
    Gets all notifications for a given user
    """
    try:
        conn = connect()
        with conn.cursor() as cur:
            cur.execute(
                """
                SELECT id, user, sender, title, message, link, date_sent
                FROM notifications
                WHERE user = %(user)s
                """, {
                    'user': user_id
                }
            )

            notifications = cur.fetchall()

        log_notification_success("Finished getting the user's notifications from database")
    except psycopg2.Error as e:
        log_notification_error(f"Error getting the user's notifications from database: {e}")
        raise e
    finally:
        disconnect(conn)
    
    return [NotificationResponse(
        id=id,
        user=user,
        sender=sender,
        title=title,
        message=message,
        link=link,
        date_sent=date_sent
    ) for id, user, sender, title, message, link, date_sent in notifications]

def get_user_unread_notifications(user_id: int) -> List[NotificationResponse]:
    """
    Gets all the unread notifications for a given user
    """
    try:
        conn = connect()
        with conn.cursor() as cur:
            cur.execute(
                """
                SELECT id, user, sender, title, message, link, date_sent
                FROM notifications
                WHERE user = %(user)s AND read = FALSE;
                """, {
                    'user': user_id
                }
            )

            notifications = cur.fetchall()

        log_notification_success("Finished getting the user's notifications from database")
    except psycopg2.Error as e:
        log_notification_error(f"Error getting the user's notifications from database: {e}")
        raise e
    finally:
        disconnect(conn)
    
    return [NotificationResponse(
        id=id,
        user=user,
        sender=sender,
        title=title,
        message=message,
        link=link,
        date_sent=date_sent
    ) for id, user, sender, title, message, link, date_sent in notifications]

def update_notification_as_read(notification_id: int):
    """
    Updates a notification to denote it as read
    """
    try:
        conn = connect()
        with conn.cursor() as cur:
            cur.execute(
                """
                UPDATE notifications
                SET read = TRUE, date_read = CURRENT_TIMESTAMP
                WHERE id = %(id)s;
                """, {
                    'id': notification_id
                }
            )
        
        conn.commit()
        log_notification_success("Marked notification as read")
    except psycopg2.Error as e:
        log_notification_error(f"Error updating notification: {e}")
        conn.rollback()
        raise e
    finally:
        disconnect(conn)

def notification_belongs_user(notification_id: int, user_id: int) -> bool:
    """
    Returns true if the notification_id belongs to the user
    """
    try:
        conn = connect()
        with conn.cursor() as cur:
            cur.execute("""
                        SELECT EXISTS(SELECT 1 FROM notifications WHERE user = %(user_id)s AND id = %(notification_id)s);
                        """, {
                            "user_id": user_id, 
                            "notification_id": notification_id})
            exists = cur.fetchone()

        log_notification_success("Successfully checked if notification belongs to user")
    except psycopg2.Error as e:
        log_notification_error(f"Error checking if notification belongs to user: {e}")
        raise e
    finally:
        disconnect(conn)

    return exists[0] if exists else False
