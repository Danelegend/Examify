from typing import List, Optional

from functionality.util import datetime_to_string
from functionality.token import get_user_id
from functionality.types import ExamType, SubjectType
from functionality.exam.exam import ExamFavouriteOfUser

from database.helpers.completed import get_user_completed_exams_for_subject, get_user_completed_subjects
from database.helpers.exam import get_exam, get_exam_recommendations_for_user_in_difficulty_range, get_exams_with_pagination
from database.helpers.favourite import get_user_favourite_exams
from database.helpers.recent import get_user_recently_viewed_exams
from database.helpers.school import get_schools

from router.api_types.api_response import ExamDetails
from router.api_types.api_request import Filter

def GetExams(user_id: Optional[int], filter: Filter, page: int, page_length: int, sortType="DEFAULT") -> List[ExamDetails]:
    # Get exams in bounds of (page - 1) * page_length <= x < page * (page_length)
    lower = (page - 1) * page_length
    
    queryset = get_exams_with_pagination(lower, page_length, filter)

    exams = []

    for item in queryset:
        exams.append(ExamDetails(
            id=item.id,
            school_name=item.school,
            type=ExamType.MapPrefixToName(item.exam_type),
            year=item.year,
            favourite=False if user_id is None else ExamFavouriteOfUser(user_id, item.id),
            upload_date=datetime_to_string(item.date_uploaded),
            likes=item.likes,
            subject=SubjectType.MapPrefixToName(item.subject)
        ))

    return exams

def GetFavouriteExams(access_token: str) -> List[ExamDetails]:
    """
    Given an access token, returns a list of the user's favourite exams
    """
    user_id = get_user_id(access_token)

    exams = get_user_favourite_exams(user_id)

    favourites = []

    for exam_id in exams:
        exam = get_exam(exam_id)

        favourites.append(ExamDetails(
            id=exam_id,
            school_name=exam.school,
            type=ExamType.MapPrefixToName(exam.exam_type),
            year=exam.year,
            favourite=True,
            upload_date=datetime_to_string(exam.date_uploaded),
            likes=exam.likes,
            subject=SubjectType.MapPrefixToName(exam.subject)
        ))

    return favourites

def GetRecentlyViewedExams(access_token: str) -> List[ExamDetails]:
    """
    Given an access token, returs a list of the user's recently viewed exams
    """
    user_id = get_user_id(access_token)

    exam_ids = get_user_recently_viewed_exams(user_id)

    recents = []

    for exam_id in exam_ids:
        exam = get_exam(exam_id)

        recents.append(
            ExamDetails(
                id=exam_id,
                school_name=exam.school,
                type=ExamType.MapPrefixToName(exam.exam_type),
                year=exam.year,
                favourite=ExamFavouriteOfUser(user_id, exam.id),
                upload_date=datetime_to_string(exam.date_uploaded),
                likes=exam.likes,
                subject=SubjectType.MapPrefixToName(exam.subject)
            )
        )

    return recents

def GetPopularSchools(size: int) -> List[str]:
    """
    Returns a list of the most popular schools
    """
    res = []

    # Get all the schools    
    for school in get_schools():
        res.append(school.name)

        if len(res) == size:
            return res
        
    return res

def GetRecommendedExams(user_id: int, subject: Optional[str] = None) -> List[ExamDetails]:
    """
    Given a user id and subject, get a list of recommended exams for the subject that the user has not completed
    
    Process: 
     - Consider the user's last 5 complete for the subject
     = Take the average difficulty
     - Find exam in that difficulty range
    """
    return _get_recommended_exams_for_anything(user_id) if subject is None else _get_recommended_exams_for_subject(user_id, subject)

def _get_recommended_exams_for_subject(user_id: int, subject: str, size: int = 3) -> List[ExamDetails]:
    recently_complete = get_user_completed_exams_for_subject(user_id, subject, size=5)

    if len(recently_complete) == 0: return GetExams(user_id, Filter(schools=[], subjects=[subject], years=[]), 1, size)

    difficulty_summation = 0

    for exam_id in recently_complete:
        exam = get_exam(exam_id)
        difficulty_summation += exam.difficulty

    average_difficulty = difficulty_summation // len(recently_complete)

    search_difficulty = average_difficulty

    def _get_recommended_exams(difficulty: int, capacity: int, offset: int = 0, up=False, down=False):
        if capacity == 0: return []
        
        recommended_exams = []

        while len(recommended_exams) < capacity:
            exam_search_list = get_exam_recommendations_for_user_in_difficulty_range(user_id, difficulty, offset, 20)

            for exam in exam_search_list:
                recommended_exams.append(exam)

            if len(exam_search_list) == 0:
                if up: recommended_exams += _get_recommended_exams(difficulty + 1, capacity - len(recommended_exams), up=True)
                if down: recommended_exams += _get_recommended_exams(difficulty - 1, capacity - len(recommended_exams), down=True)
            else:
                offset += 20

    recommended_exams = _get_recommended_exams(search_difficulty, 3, up=True, down=True)

    return recommended_exams

def _get_recommended_exams_for_anything(user_id: int) -> List[ExamDetails]:
    """
    
    """
    # Infer subjects the user has completed
    user_subjects = get_user_completed_subjects(user_id)

    recommendations = []

    for subject in user_subjects:
        recommendations += _get_recommended_exams_for_subject(user_id, subject, 2)

    return recommendations

