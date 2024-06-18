from typing import Annotated
from fastapi import APIRouter, Security, status

from functionality.token import get_user_id
from functionality.notifications.notifications import get_notifications, mark_notifications_seen
from functionality.user.analytics import get_user_activity_analytics, get_user_subject_analytics
from functionality.user.user import get_first_name

from router import HTTPBearer401
from router.api_types.api_response import ExamsComplete, UserAnalyticsActivityResponse, UserAnalyticsCompletedSubjectExamsResponse, UserNotificationsResponse, UserProfileResponse
from router.api_types.api_request import NotificationsSeenRequest

router = APIRouter()

@router.get("/profile", status_code=status.HTTP_200_OK, response_model=UserProfileResponse)
async def get_profile(token: Annotated[str, Security(HTTPBearer401())]) -> UserProfileResponse:
    user_id = get_user_id(token)

    return UserProfileResponse(
        name=get_first_name(user_id)
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

    print(result)

    return UserAnalyticsCompletedSubjectExamsResponse(
        analytics=[ExamsComplete(
            subject=subject,
            number_complete=result[subject]
        ) for subject in result]
    )

@router.get("/analytics/activity", status_code=status.HTTP_200_OK, response_model=UserAnalyticsActivityResponse)
async def get_user_analytics_for_activity(token: Annotated[str, Security(HTTPBearer401())]) -> UserAnalyticsActivityResponse:
    user_id = get_user_id(token)

    result = get_user_activity_analytics(user_id)

    # Get map of datetime to list
    date_to_exams_complete = {}

    for date, exams_complete in result:
        date_to_exams_complete[date] = [ExamsComplete(
            subject=subject,
            number_complete=number
        ) for subject, number in exams_complete]

    return UserAnalyticsActivityResponse(
        analytics=[(date, date_to_exams_complete[date]) for date in date_to_exams_complete]
    )