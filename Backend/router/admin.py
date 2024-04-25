from typing import Annotated
from fastapi import APIRouter, HTTPException, Security, status, UploadFile

from app.functionality.admin.admin import DeleteCurrentExam, DeleteReviewExam, GetCurrentExams, GetExamsToReview, SubmitReviewExam, UploadExam, ValidateToken
from app.functionality.authentication.authentication import GetUserPermissions

from router import HTTPBearer401
from router.api_types.api_request import DeleteReviewExamRequest, SubmitReviewExamRequest, UploadExamRequest
from router.api_types.api_response import CurrentExamsResponse, ReviewExamsResponse

router = APIRouter()

def TokenValidation(token: str):
    if GetUserPermissions(token) != "ADM":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User is not an admin")

@router.get("/exams/current", status_code=status.HTTP_200_OK, response_model=CurrentExamsResponse)
async def get_current_exams(token: Annotated[str, Security(HTTPBearer401())]) -> CurrentExamsResponse:
    TokenValidation(token)

    exams = GetCurrentExams()

    return CurrentExamsResponse(exams=exams)

@router.get("/exams/review", status_code=status.HTTP_200_OK, response_model=ReviewExamsResponse)
async def get_review_exams(token: Annotated[str, Security(HTTPBearer401())]) -> ReviewExamsResponse:
    TokenValidation(token)

    exams = GetExamsToReview()

    return ReviewExamsResponse(exams=exams)

@router.post("/exam/review/submit", status_code=status.HTTP_200_OK)
async def submit_review_exam(exam_submit: SubmitReviewExamRequest, token: Annotated[str, Security(HTTPBearer401())]) -> None:
    TokenValidation(token)

    submit_review_exam(exam_submit.school, 
                       exam_submit.exam_type, 
                       exam_submit.year, 
                       exam_submit.subject, 
                       exam_submit.file_location)

@router.delete("/exam/review/delete", status_code=status.HTTP_200_OK)
async def delete_review_exam(exam_delete: DeleteReviewExamRequest, token: Annotated[str, Security(HTTPBearer401())]) -> None:
    TokenValidation(token)

    DeleteReviewExam(exam_delete.file_location)

@router.delete("/exam/current/{exam_id}", status_code=status.HTTP_200_OK)
async def delete_current_exam(exam_id: int, token: Annotated[str, Security(HTTPBearer401())]) -> None:
    TokenValidation(token)

    DeleteCurrentExam(exam_id)

@router.post("/exam/upload", status_code=status.HTTP_200_OK)
async def upload_exam(upload_request: UploadExamRequest, file: UploadFile, token: Annotated[str, Security(HTTPBearer401())]) -> None:
    TokenValidation(token)

    UploadExam(upload_request.school,
                upload_request.year,
                upload_request.exam_type,
                upload_request.subject,
                file)