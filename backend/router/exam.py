from typing import Annotated

from fastapi import APIRouter, HTTPException, Response, Security, status
from fastapi.responses import FileResponse

from errors import AuthenticationError, DuplicationError, ValidationError

from functionality.exam.exam import AddFavouriteExam, AddRecentlyViewedExam, AddUserCompletedExam, GetExamId, GetExamPdf, GetFavouriteExam, GetUserCompletedExam, RemoveFavouriteExam, RemoveUserCompletedExam
from functionality.token import get_user_id

from router import HTTPBearer401
from router.api_types.api_response import ExamResponse

router = APIRouter()

@router.get("/{subject}/{school}/{year}/{type}", status_code=status.HTTP_200_OK, response_model=ExamResponse)
async def get_exam(subject: str, school: str, year: int, type: str) -> ExamResponse:
    try:
        exam_id = GetExamId(subject, school, year, type)
        
        return ExamResponse(
            exam_id=exam_id
        )
    except ValidationError as v:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=v.message) from v
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="An error occurred") from e
    
@router.get("/pdf/{exam_id}", status_code=status.HTTP_200_OK)
async def get_exam_pdf(exam_id: int) -> FileResponse:
    try:
        buffer = GetExamPdf(exam_id)
        
        return Response(buffer.read(), media_type='application/pdf')
    except Exception as e:
        print(str(e))
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e)) from e

@router.get("/{exam_id}/favourite", status_code=status.HTTP_200_OK)
async def get_favourite_exam(exam_id: int, token: Annotated[str, Security(HTTPBearer401())]) -> bool:
    try:
        user_id = get_user_id(token)
    except AuthenticationError as a:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, details=a.message) from a

    return GetFavouriteExam(user_id, exam_id)

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

@router.get("/{exam_id}/complete", status_code=status.HTTP_200_OK)
async def get_completed_exam(exam_id: int, token: Annotated[str, Security(HTTPBearer401())]) -> bool:
    try:
        user_id = get_user_id(token)
    except AuthenticationError as a:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, details=a.message) from a

    return GetUserCompletedExam(user_id, exam_id)

@router.post("/{exam_id}/complete", status_code=status.HTTP_200_OK)
async def add_completed_exam(exam_id: int, token: Annotated[str, Security(HTTPBearer401())]) -> Response:
    try:
        user_id = get_user_id(token)
    except AuthenticationError as a:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, details=a.message) from a

    AddUserCompletedExam(user_id, exam_id)

@router.delete("/{exam_id}/complete", status_code=status.HTTP_200_OK)
async def remove_completed_exam(exam_id: int, token: Annotated[str, Security(HTTPBearer401())]) -> Response:
    try:
        user_id = get_user_id(token)
    except AuthenticationError as a:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, details=a.message) from a

    RemoveUserCompletedExam(user_id, exam_id)