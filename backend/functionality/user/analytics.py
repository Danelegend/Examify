from datetime import date
from typing import Dict, List

from database.helpers.completed import get_user_completed_exams
from database.helpers.exam import get_exam

from functionality.types import SubjectType

from router.api_types.api_response import ExamTimeStat

def get_user_subject_analytics(user_id: int) -> Dict[str, int]:
    """
    Given a user's id, returns a dictionary mapping a subject name
    to the number of exams completed for that subject
    """
    user_completed_exams = get_user_completed_exams(user_id, size=10000)

    result = {}

    for user_complete_exam in user_completed_exams:
        exam = get_exam(user_complete_exam.exam)
        
        subject = SubjectType.MapPrefixToName(exam.subject)

        if subject not in result:
            result[subject] = 0
        result[subject] += 1

    return result

def get_user_activity_analytics(user_id: int) -> List[ExamTimeStat]:
    """
    Given a user's id, get a list of the number exams they've completed
    """
    exams_completed = get_user_completed_exams(user_id)

    d: Dict[date, int] = {}

    for exam in exams_completed:
        exam_completion_date = exam.date_complete.date()

        if exam_completion_date not in d:
            d[exam_completion_date] = 0

        d[exam_completion_date] += 1

    return [ExamTimeStat(
        date=date.isoformat(),
        exams_complete=d[date]
    ) for date in d]
