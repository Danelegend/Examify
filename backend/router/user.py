from typing import Annotated
from fastapi import APIRouter, Security, status

from functionality.token import get_user_id
from functionality.notifications.notifications import get_notifications, mark_notifications_seen
from functionality.user.analytics import get_user_activity_analytics, get_user_subject_analytics

from router import HTTPBearer401
from router.api_types.api_response import UserAnalyticsActivityResponse, UserAnalyticsCompletedSubjectExamsResponse, UserNotificationsResponse, UserProfileResponse
from router.api_types.api_request import NotificationsSeenRequest

router = APIRouter()

@router.get("/profile", status_code=status.HTTP_200_OK, response_model=UserProfileResponse)
async def get_profile() -> UserProfileResponse:
    return UserProfileResponse(
        name="Dane",
        exams_completed=6
    )

@router.get("/notifications", status_code=status.HTTP_200_OK, response_model=UserNotificationsResponse)
async def get_user_notifications(token: Annotated[str, Security(HTTPBearer401())], read: bool = False) -> UserNotificationsResponse:
    return UserNotificationsResponse(
        notifications=get_notifications(token, read)
    )

@router.put("/notifications/seen", status_code=status.HTTP_200_OK)
async def user_notifications_seen(token: Annotated[str, Security(HTTPBearer401())], request: NotificationsSeenRequest):
    mark_notifications_seen(token, request.notifications)

@router.get("/analytics/subject", status_code=status.HTTP_200_OK, response_model=UserAnalyticsCompletedSubjectExamsResponse)
async def get_user_analytics_for_subjects(token: Annotated[str, Security(HTTPBearer401())]) -> UserAnalyticsCompletedSubjectExamsResponse:
    user_id = get_user_id(token)

    result = get_user_subject_analytics(user_id)

    return UserAnalyticsCompletedSubjectExamsResponse(
        analytics=result
    )

@router.get("/analytics/activity", status_code=status.HTTP_200_OK, response_model=UserAnalyticsActivityResponse)
async def get_user_analytics_for_activity(token: Annotated[str, Security(HTTPBearer401())]) -> UserAnalyticsActivityResponse:
    user_id = get_user_id(token)

    result = get_user_activity_analytics(user_id)

    return UserAnalyticsActivityResponse(
        analytics=result
    )