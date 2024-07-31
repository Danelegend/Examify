from typing import Annotated
from fastapi import APIRouter, HTTPException, Response, Security, status, UploadFile, Form, File

from functionality.admin.admin import DeleteCurrentExam, DeleteReviewExam, GetCurrentExams, GetExamsToReview, SubmitReviewExam, UpdateExam, UploadExam, ValidateToken, get_all_users, submit_feedback
from functionality.authentication.authentication import GetUserPermissions
from functionality.token import get_user_id

from router import HTTPBearer401, OptionalHTTPBearer
from router.api_types.api_request import DeleteReviewExamRequest, FeedbackRequest, SubmitReviewExamRequest, UpdateExamRequest, UploadExamRequest
from router.api_types.api_response import CurrentExamsResponse, RegisteredUsersResponse, ReviewExamsResponse, UpdateExamResponse

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
def submit_review_exam(exam_submit: SubmitReviewExamRequest, token: Annotated[str, Security(HTTPBearer401())]) -> None:
    TokenValidation(token)

    SubmitReviewExam(exam_submit.school, 
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
async def upload_exam(
    school: Annotated[str, Form()],
    year: Annotated[int, Form()],
    type: Annotated[str, Form()],
    subject: Annotated[str, Form()],
    grade: Annotated[int, Form()],
    file: Annotated[UploadFile, File()]
) -> Response:
    await UploadExam(school,
                    year,
                    type,
                    subject,
                    file)
    
    return Response(status_code=status.HTTP_200_OK)

@router.put("/exam/{exam_id}", status_code=status.HTTP_200_OK, response_model=UpdateExamResponse)
async def update_exam(request: UpdateExamRequest, exam_id: int, token: Annotated[str, Security(HTTPBearer401())]) -> UpdateExamResponse:
    TokenValidation(token)

    success, message = UpdateExam(exam_id, 
                                  request.school, 
                                  request.year, 
                                  request.exam_type, 
                                  request.subject)

    return UpdateExamResponse(success=success, message=message)

@router.get("/users", status_code=status.HTTP_200_OK, response_model=RegisteredUsersResponse)
async def get_registered_users(token: Annotated[str, Security(HTTPBearer401())]) -> RegisteredUsersResponse:
    TokenValidation(token)

    users = get_all_users()

    return RegisteredUsersResponse(users=users)

@router.post("/feedback", status_code=status.HTTP_200_OK)
async def post_feedback(request: FeedbackRequest, token: Annotated[str | None, Security(OptionalHTTPBearer())]) -> None:
    try:
        user_id = None if token is None else get_user_id(token)
    except Exception as e:
        user_id = None

    submit_feedback(request.name, request.email, request.feedback, user_id)