import math

from datetime import datetime, timedelta
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
    
    Determine how many days ago the time was from today
    """
    number_days_since = (datetime.now() - time).days
    
    # Determine which number bucket
    bucket_num = math.floor(number_days_since / period + 1)

    num_days = period * bucket_num

    return datetime.now() - timedelta(days=num_days)


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
        date_complete = user_complete_exam.date_complete

        bucket_date = _calculate_time_bucket(date_complete, period)

        if bucket_date not in result:
            result[bucket_date] = {}

        result[bucket_date][subject] = result[bucket_date].get(subject, 0) + 1

    return result
