from typing import List

from database.helpers.completed import get_exams_completed_by_user
from database.helpers.user import get_user_details, get_user_subjects


def get_first_name(user_id: int) -> str:
    """
    Given a user id, returns the first name of the user
    """
    user_details = get_user_details(user_id)

    return user_details.first_name

def get_users_subjects(user_id: int) -> List[str]:
    """
    Given a user id, returns a list of subjects the user studies
    """
    subjects = get_user_subjects(user_id)

    if len(subjects) == 0:
        s = set()
        
        user_completed_exams = get_exams_completed_by_user(user_id)

        for exam in user_completed_exams:
            s.add(exam.subject)
        subjects = list(s)

    return subjects