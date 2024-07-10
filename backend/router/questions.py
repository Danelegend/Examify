from typing import Annotated, Optional
from fastapi import APIRouter, HTTPException, Security, status

from functionality.token import get_user_id
from functionality.questions.questions import get_question_cards, get_question_subjects, get_question_topics

from router import OptionalHTTPBearer
from router.api_types.api_request import QuestionsRequest
from router.api_types.api_response import QuestionsResponse, QuestionsSubjectsResponse, QuestionsTopicsResponse


router = APIRouter()

@router.post("/", status_code=status.HTTP_200_OK, response_model=QuestionsResponse)
async def get_questions(questions_request: QuestionsRequest, token: Annotated[Optional[str], Security(OptionalHTTPBearer())], page: int = 1, page_length: int = 50) -> QuestionsResponse:
    page = max(page, 1)
    page_length = 50 if page_length < 1 else page_length

    try:
        user_id = get_user_id(token)
    except:
        user_id = None
    
    try:
        questions = get_question_cards(user_id, questions_request.filter, page, page_length)

        return QuestionsResponse(
            questions=questions
        )
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="An error occurred") from e


@router.get("/subjects", status_code=status.HTTP_200_OK, response_model=QuestionsSubjectsResponse)
async def get_questions_subjects() -> QuestionsSubjectsResponse:
    return QuestionsSubjectsResponse(
        subjects=get_question_subjects()
    )

@router.get("/topics", status_code=status.HTTP_200_OK, response_model=QuestionsTopicsResponse)
async def get_questions_topics(subject=None) -> QuestionsTopicsResponse:
    return QuestionsTopicsResponse(
        topics=get_question_topics(subject)
    )