from typing import List, Optional

from pydantic import BaseModel

from router.api_types.api_response import NotificationResponse

from database.db_types.db_request import NotificationCreationRequest
from database.helpers.notifications import get_user_notifications, get_user_unread_notifications, insert_notification, notification_belongs_user, update_notification_as_read

from functionality.token import get_user_id

class NotificationContent(BaseModel):
    title: str
    message: str
    link: Optional[str]

def get_notifications(access_token: str, read: bool) -> List[NotificationResponse]:
    """
    Returns either only unread notifications or all notifications depending on flag
    """
    return get_all_notifications(access_token) if read else get_unread_notifications(access_token)

def get_unread_notifications(access_token: str) -> List[NotificationResponse]:
    """
    Given an access token, returns a list of the user's unread notifications
    """
    user_id = get_user_id(access_token)

    unread_notifications = get_user_unread_notifications(user_id)

    return [
        NotificationResponse(
            id=notification.id,
            sender=notification.sender,
            title=notification.title,
            message=notification.message,
            link=notification.link,
            date_sent=notification.date_sent
                                 
        ) for notification in unread_notifications
    ]

def get_all_notifications(access_token: str) -> List[NotificationResponse]:
    """
    Given an access token, returns a list of the all the user's notifications
    """
    user_id = get_user_id(access_token)

    notifications = get_user_notifications(user_id)

    return [
        NotificationResponse(
            id=notification.id,
            sender=notification.sender,
            title=notification.title,
            message=notification.message,
            link=notification.link,
            date_sent=notification.date_sent
        ) for notification in notifications
    ]

def push_notification(receiver: int, content: NotificationContent, sender: Optional[int] = None):
    """
    Pushes a notification to a receiver
    """

    notification_request = NotificationCreationRequest(
        user_id=receiver,
        sender_id=sender,
        title=content.title,
        message=content.message,
        link=content.link
    )

    insert_notification(notification_request)

def mark_notifications_seen(access_token: str, notification_ids: List[int]):
    """
    Given an access token and a list of notification ids, marks all the notifications as seen
    """
    user_id = get_user_id(access_token)

    for notification_id in notification_ids:
        # Check that the notification belongs to the user
        if (notification_belongs_user(notification_id, user_id)):
            update_notification_as_read(notification_id)
