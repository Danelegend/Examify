from typing import List, Optional

from logger import Logger

from functionality.util import datetime_to_string
from functionality.token import get_user_id
from functionality.exams.FilterConfig import FilterConfig
from functionality.types import ExamType, SubjectType
from functionality.exam.exam import ExamFavouriteOfUser

from database.helpers.exam import get_exam, get_exams
from database.helpers.favourite import get_user_favourite_exams
from database.helpers.recent import get_user_recently_viewed_exams
from database.helpers.school import get_schools

from router.api_types.api_response import ExamDetails

def GetExams(accessToken: Optional[str], filterConfig: FilterConfig, sortType="DEFAULT") -> List[ExamDetails]:
    print("T1")
    Logger.log_backend("Exam", "Yes")
    queryset = get_exams()
    Logger.log_backend("Exam", "No")

    print("T2")
    exams = []

    for item in queryset:
        print("Test")
        exams.append(ExamDetails(
            id=item.id,
            school_name=item.school,
            type=ExamType.MapPrefixToName(item.exam_type),
            year=item.year,
            favourite=False if accessToken is None else ExamFavouriteOfUser(accessToken, item.id),
            upload_date=datetime_to_string(item.date_uploaded),
            likes=item.likes,
            subject=SubjectType.MapPrefixToName(item.subject)
        ))
        print("T3")
    print("T4")
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
                favourite=False,
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