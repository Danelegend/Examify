from typing import List, Optional

from database.helpers.questions import get_question, get_questions_with_pagination, get_subjects, get_topics, insert_question, insert_user_answers
from database.db_types.db_request import QuestionInsertionRequest

from router.api_types.api_request import QuestionCreationRequest, QuestionsFilter
from router.api_types.api_response import QuestionCard, QuestionResponse

def question_insert(question: QuestionCreationRequest) -> int:
    """
    Inserts a new question in the database
    """
    question_id = insert_question(QuestionInsertionRequest(
        subject=question.subject,
        topic=question.topic,
        title=question.title,
        grade=question.grade,
        difficulty=question.difficulty,
        question=question.question,
        answers=question.answers,
        image_locations=question.images
    ))

    return question_id

def get_question_details(question_id: int) -> QuestionResponse:
    """
    Given a question id, returns the question details
    """
    question = get_question(question_id)

    return QuestionResponse(
        id=question.id,
        subject=question.subject,
        topic=question.topic,
        title=question.title,
        grade=question.grade,
        difficulty=question.difficulty,
        question=question.question,
        answers=question.answers,
        image_locations=question.image_locations
    )

def get_question_cards(user_id: Optional[int], filter: QuestionsFilter, page: int = 1, page_length: int = 50) -> List[QuestionCard]:
    """
    Given a user id, returns a list of question cards
    """
    # Get questions in bounds of (page - 1) * page_length <= x < page * (page_length)
    lower = (page - 1) * page_length

    questions = get_questions_with_pagination(lower, page_length, filter)

    for item in questions:
        questions.append(QuestionCard(
            id=item.id,
            subject=item.subject,
            topic=item.topic,
            title=item.title,
            grade=item.grade,
            difficulty=item.difficulty
        ))

    return questions

def submit_user_answer(user_id: int, question_id: int, answers: List[str]) -> bool:
    """
    Given a user id, question id, and answers, submits the user's answer
    """
    answer = ''

    for i in range(len(answers)):
        if i == len(answers) - 1:
            answer += answers[i]
        else:
            answer += answers[i] + ', '

    insert_user_answers(user_id, question_id, answer)

def get_question_subjects() -> List[str]:
    """
    Returns a list of subjects
    """
    return get_subjects()

def get_question_topics(subject: Optional[str]) -> List[str]:
    """
    Returns a list of topics
    """
    return get_topics(subject)