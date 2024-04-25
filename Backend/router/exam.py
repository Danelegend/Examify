from typing import Annotated

from fastapi import APIRouter, HTTPException, Response, Security, status
from fastapi.responses import FileResponse

from errors import AuthenticationError, DuplicationError, ValidationError

from functionality.exam.exam import AddFavouriteExam, AddRecentlyViewedExam, GetExamId, GetExamPdf, RemoveFavouriteExam

from router import HTTPBearer401
from router.api_types.api_response import ExamResponse

router = APIRouter()

@router.get("/{school}/{year}/{type}", status_code=status.HTTP_200_OK, response_model=ExamResponse)
async def get_exam(school: str, year: int, type: str) -> ExamResponse:
    try:
        exam_id = GetExamId(school, year, type)

        return ExamResponse(
            exam_id=exam_id
        )
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="An error occurred") from e
    
@router.get("/pdf/{exam_id}", status_code=status.HTTP_200_OK)
async def get_exam_pdf(exam_id: int) -> FileResponse:
    try:
        buffer = GetExamPdf(exam_id)

        return Response(buffer, media_type='application/pdf')
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="An error occurred") from e
    
@router.post("/{exam_id}/favourite", status_code=status.HTTP_200_OK)
async def add_favourite_exam(exam_id: int, token: Annotated[str, Security(HTTPBearer401())]) -> Response:
    try:
        AddFavouriteExam(token, exam_id)

        return Response(status_code=status.HTTP_200_OK)
    except AuthenticationError as a:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=a.message) from a
    except ValidationError as v:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=v.message) from v
    except DuplicationError as d:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=d.message) from d
    
@router.delete("/{exam_id}/favourite", status_code=status.HTTP_200_OK)
async def remove_favourite_exam(exam_id: int, token: Annotated[str, Security(HTTPBearer401())]) -> Response:
    try:
        RemoveFavouriteExam(token, exam_id)

        return Response(status_code=status.HTTP_200_OK)
    except AuthenticationError as a:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=a.message) from a
    except ValidationError as v:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=v.message) from v
    except DuplicationError as d:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=d.message) from d
    
@router.post("/{exam_id}/recent", status_code=status.HTTP_200_OK)
async def add_recent_exam(exam_id: int, token: Annotated[str, Security(HTTPBearer401())]) -> Response:
    try:
        AddRecentlyViewedExam(token, exam_id)

        return Response(status_code=status.HTTP_200_OK)
    except AuthenticationError as a:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=a.message) from a
    except ValidationError as v:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=v.message) from v
    except DuplicationError as d:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=d.message) from d
