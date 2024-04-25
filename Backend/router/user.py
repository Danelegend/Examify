from fastapi import APIRouter, status

from router.api_types.api_response import UserProfileResponse


router = APIRouter()

@router.get("/profile", status_code=status.HTTP_200_OK, response_class=UserProfileResponse)
async def get_profile() -> UserProfileResponse:
    return UserProfileResponse(
        name="Dane",
        exams_completed=6
    )