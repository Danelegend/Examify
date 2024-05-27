from fastapi import APIRouter, status

from router.api_types.api_response import UserNotificationsResponse, UserProfileResponse

router = APIRouter()

@router.get("/profile", status_code=status.HTTP_200_OK, response_model=UserProfileResponse)
async def get_profile() -> UserProfileResponse:
    return UserProfileResponse(
        name="Dane",
        exams_completed=6
    )

@router.get("/notifications", status_code=status.HTTP_200_OK, response_model=UserNotificationsResponse)
async def get_notifications() -> UserNotificationsResponse:
    