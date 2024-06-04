import math

from datetime import datetime
from typing import Dict

from database.helpers.completed import get_user_completed_exams
from database.helpers.exam import get_exam

from functionality.types import SubjectType

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

def _calculate_time_bucket(time: datetime, period: int) -> datetime:
    """
    Given a datetime and period, determines which bucket the datetime
    should fall it. A  bucket is considered today - period.

    Ie. If a period is 7 days, and today is Monday, all days up to last
    Tuesday should fit in a bucket denoted by Tuesday's date
    """
    # Determine number of days since 2000
    # Today - 4 * Ceil(Num days since / 4) 
    # M T W T F S S M T W T

    number_days_since = (time - datetime(1970, 1, 1)).days

    return datetime.now() - period * math.ceil(number_days_since / period)


def get_user_activity_analytics(user_id: int, period=7) -> Dict[datetime, Dict[str, int]]:
    """
    Given a user's id, returns a dictionary of a date, mapping 
    the number of exams that have been completed in a defined period
    """
    user_completed_exams = get_user_completed_exams(user_id, size=10000)

    result = {}

    for user_complete_exam in user_completed_exams:
        exam = get_exam(user_complete_exam.exam)

        subject = SubjectType.MapPrefixToName(exam.subject)
