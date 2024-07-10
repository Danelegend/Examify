from typing import Annotated
from fastapi import APIRouter, HTTPException, Security, status

from logger import Logger

from functionality.token import get_user_id
from functionality.questions.questions import get_question_details, question_insert, submit_user_answer
from functionality.authentication.authentication import GetUserPermissions

from router import HTTPBearer401
from router.api_types.api_request import QuestionAnswerRequest, QuestionCreationRequest
from router.api_types.api_response import QuestionResponse


router = APIRouter()

def AdminTokenValidation(token: str):
    Logger.log_backend("Validating admin token")
    if GetUserPermissions(token) != "ADM":
        Logger.log_backend("Token is not admin")
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User is not an admin")
    Logger.log_backend("Token is admin")

@router.post("/", status_code=status.HTTP_200_OK)
async def create_question(question: QuestionCreationRequest, token: Annotated[str, Security(HTTPBearer401())]):
    AdminTokenValidation(token)
    
    try:
        question_insert(question)
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"An error occurred: {e}") from e
    
@router.get("/{question_id}", status_code=status.HTTP_200_OK, response_model=QuestionResponse)
async def get_question(question_id: int) -> QuestionResponse:
    try:
        question = get_question_details(question_id)

        return question
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="An error occurred") from e
    
@router.post("/{question_id}/answer", status_code=status.HTTP_200_OK)
async def submit_answer(question_id: int, request: QuestionAnswerRequest, token: Annotated[str, Security(HTTPBearer401())]):
    try:
        user_id = get_user_id(token)
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User is not authenticated") from e
    
    submit_user_answer(user_id, question_id, request.answers)
