from typing import Annotated
from fastapi import APIRouter, Security, status, HTTPException

from functionality.token import get_user_id
from functionality.notifications.notifications import get_notifications, mark_notifications_seen
from functionality.user.analytics import GetUserTopicRecommendations, get_user_activity_analytics, get_user_subject_analytics
from functionality.user.user import get_first_name

from router import HTTPBearer401
from router.api_types.api_response import ExamsComplete, UserAnalyticsActivityResponse, UserAnalyticsCompletedSubjectExamsResponse, UserNotificationsResponse, UserProfileResponse, UserTopicRecommendationsResponse
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
    try:
        user_id = get_user_id(token)
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid Token")

    result = get_user_activity_analytics(user_id)

    return UserAnalyticsActivityResponse(
        analytics=result
    )

@router.get("/recommendations/topic", status_code=status.HTTP_200_OK, response_model=UserTopicRecommendationsResponse)
async def get_user_topic_recommendations(token: Annotated[str, Security(HTTPBearer401())]) -> UserTopicRecommendationsResponse:
    try:
        user_id = get_user_id(token)
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid Token")
    
    recommendations = GetUserTopicRecommendations(user_id)
    
    return UserTopicRecommendationsResponse(
        recommendations=recommendations
    )