from typing import Annotated, Optional
from fastapi import APIRouter, Security, status, HTTPException

from errors import AuthenticationError

from functionality.exams.FilterConfig import FilterConfig
from functionality.exams.exams import GetExams, GetFavouriteExams, GetPopularSchools, GetRecentlyViewedExams

from router import HTTPBearer401, OptionalHTTPBearer
from router.api_types.api_response import ExamSchoolsResponse, ExamSubjectsResponse, FavouriteExamsResponse, RecentExamsResponse
from router.api_types.api_request import ExamsEndpointRequest
from router.api_types.api_response import ExamsResponse

router = APIRouter()

@router.post("/", status_code=status.HTTP_200_OK, response_model=ExamsResponse)
async def get_exams(exams_request: ExamsEndpointRequest, token: Annotated[Optional[str], Security(OptionalHTTPBearer())]) -> ExamsResponse:
    try:    
        filter_config = FilterConfig.Decode("")

        data = GetExams(token, filter_config)

        return ExamsResponse(
            exams=data
        )
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="An error occurred") from e

@router.get("/favourites", status_code=status.HTTP_200_OK, response_model=FavouriteExamsResponse)
async def get_favourite_exams(token: Annotated[str, Security(HTTPBearer401())]) -> FavouriteExamsResponse:
    try:
        exams = GetFavouriteExams(token)

        return FavouriteExamsResponse(
            exams=exams
        )
    except AuthenticationError as a:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=a.message) from a

@router.get("/recents", status_code=status.HTTP_200_OK, response_model=RecentExamsResponse)
async def get_recent_exams(token: Annotated[str, Security(HTTPBearer401())]) -> RecentExamsResponse:
    try:
        exams = GetRecentlyViewedExams(token)
        
        return RecentExamsResponse(
            exams=exams
        )
    except AuthenticationError as a:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=a.message) from a

@router.get("/schools", status_code=status.HTTP_200_OK, response_model=ExamSchoolsResponse)
async def get_schools() -> ExamSchoolsResponse:
    return ExamSchoolsResponse(
        schools=GetPopularSchools(10)
   )

@router.get("/subjects", status_code=status.HTTP_200_OK, response_model=ExamSubjectsResponse)
async def get_subjects() -> ExamSubjectsResponse:
    return ExamSubjectsResponse(
        subjects=[
                "Maths Extension 2",
                "Maths Extension 1",
                "Maths Advanced",
                "Maths Standard 2",
                "Chemistry",
                "Physics",
                "Biology",	
                ]
    )