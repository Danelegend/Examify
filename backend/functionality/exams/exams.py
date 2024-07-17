from typing import List, Optional

from logger import Logger

from functionality.util import datetime_to_string
from functionality.token import get_user_id
from functionality.types import ExamType, SubjectType
from functionality.exam.exam import ExamFavouriteOfUser

from database.helpers.completed import get_exams_completed_by_user, get_user_completed_exams
from database.helpers.exam import get_exam, get_exams_with_pagination, get_recommended_exams
from database.helpers.favourite import check_if_user_favourite_exam_exists, get_user_favourite_exams
from database.helpers.recent import get_user_recently_viewed_exams
from database.helpers.school import get_schools

from router.api_types.api_response import ExamDetails
from router.api_types.api_request import ExamsFilter

def GetExams(accessToken: Optional[str], filter: ExamsFilter, page: int, page_length: int, sort: str="relevance") -> List[ExamDetails]:
    # Get exams in bounds of (page - 1) * page_length <= x < page * (page_length)
    lower = (page - 1) * page_length
    
    queryset = get_exams_with_pagination(lower, page_length, filter, sort)

    exams = []

    for item in queryset:
        exams.append(ExamDetails(
            id=item.id,
            school_name=item.school,
            type=ExamType.MapPrefixToName(item.exam_type),
            year=item.year,
            favourite=False if accessToken is None else ExamFavouriteOfUser(accessToken, item.id),
            upload_date=datetime_to_string(item.date_uploaded),
            likes=item.likes,
            subject=SubjectType.MapPrefixToName(item.subject),
            difficulty=item.difficulty
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
            subject=SubjectType.MapPrefixToName(exam.subject),
            difficulty=exam.difficulty
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
                favourite=ExamFavouriteOfUser(access_token, exam.id),
                upload_date=datetime_to_string(exam.date_uploaded),
                likes=exam.likes,
                subject=SubjectType.MapPrefixToName(exam.subject),
                difficulty=exam.difficulty
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

def _get_recommended_exams_at_level_for_subject(user_id: int, subject: str, difficulty: int, size: int = 1) -> List[ExamDetails]:
    database_response = get_recommended_exams(user_id, subject, difficulty, size)
    
    return [ExamDetails(
        id=exam.id,
        school_name=exam.school,
        type=ExamType.MapPrefixToName(exam.exam_type),
        year=exam.year,
        favourite=check_if_user_favourite_exam_exists(user_id, exam.id),
        upload_date=datetime_to_string(exam.date_uploaded),
        likes=exam.likes,
        subject=SubjectType.MapPrefixToName(exam.subject),
        difficulty=exam.difficulty
    ) for exam in database_response]

def GetRecommendedExams(user_id: int) -> List[ExamDetails]:
    """
    Given a user id, returns a list of recommended exams
    
    Approach for getting recommended exams:
     - Get the subjects that the user has previously completed
     - Get the exams that the user has previously completed
     - Get the average difficulty of the past 5 exams of a subject that a user has completed
     - Return an exam of the same subject with a difficulty within 1 of the average difficulty
    """
    user_completed_exams = get_exams_completed_by_user(user_id)

    if len(user_completed_exams) == 0:
         return [ExamDetails(
            id=exam.id,
            school_name=exam.school,
            type=ExamType.MapPrefixToName(exam.exam_type),
            year=exam.year,
            favourite=check_if_user_favourite_exam_exists(user_id, exam.id),
            upload_date=datetime_to_string(exam.date_uploaded),
            likes=exam.likes,
            subject=SubjectType.MapPrefixToName(exam.subject),
            difficulty=exam.difficulty
         ) for exam in get_exams_with_pagination(0, 10, ExamsFilter(), "relevance")]

    subjects = {}
    
    for exam in user_completed_exams:
        count, summation = subjects.get(exam.subject, (0, 0))
        subjects[exam.subject] = (count + 1, summation + exam.difficulty)

    num_exams_per_subject = 3 if len(subjects) < 4 else 2

    recommendations = []

    # Get exams for each subject
    for subject in subjects:
        count, summation = subjects[subject]

        average_difficulty = summation / count

        recommended_exams = _get_recommended_exams_at_level_for_subject(user_id, subject, average_difficulty, size=num_exams_per_subject)

        recommendations.extend(recommended_exams)

    return recommendations