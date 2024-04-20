from typing import List

from app.functionality.util import datetime_to_string
from app.functionality.token import get_user
from app.models import FavouriteExam, RecentlyViewedExam, Schools
from app.functionality.exams.FilterConfig import FilterConfig
from app.types import ExamType
from app.functionality.DatabaseAccessor import DatabaseAccessor
from app.functionality.exam.exam import GetExamLikes, ExamFavouriteOfUser

def GetExams(accessToken, filterConfig: FilterConfig, sortType="DEFAULT"):
    queryset = DatabaseAccessor().GetExams(filterConfig, sortType)

    exams = []

    for item in queryset:
        exams.append({
            "id": item.id,
            "school_name": item.school.name,
            "type": item.exam_type,
            "year": item.year,
            "favourite": False if accessToken is None else ExamFavouriteOfUser(accessToken, item.id),
            "upload_date": datetime_to_string(item.date_uploaded),
            "likes": GetExamLikes(item.id),
            "subject": item.subject
        })

    return {
        "exams": exams
    }

def GetFavouriteExams(access_token: str) -> List[dict]:
    """
    Given an access token, returns a list of the user's favourite exams
    """
    user = get_user(access_token)

    exams = FavouriteExam.objects.filter(user=user)

    favourites = []

    for exam in exams:
        favourites.append({
            "id": exam.exam.id,
            "school_name": exam.exam.school.name,
            "type": ExamType.MapPrefixToName(exam.exam.exam_type),
            "year": exam.exam.year,
            "favourite": True,
            "upload_date": datetime_to_string(exam.exam.date_uploaded),
            "likes": GetExamLikes(exam.exam.id),
            "subject": exam.exam.subject
        })

    return favourites

def GetRecentlyViewedExams(access_token: str) -> List[dict]:
    """
    Given an access token, returs a list of the user's recently viewed exams
    """
    user = get_user(access_token)

    exams = RecentlyViewedExam.objects.filter(user=user)

    recents = []

    for exam in exams:
        recents.append({
            "id": exam.exam.id,
            "school_name": exam.exam.school.name,
            "type": ExamType.MapPrefixToName(exam.exam.exam_type),
            "year": exam.exam.year,
            "favourite": ExamFavouriteOfUser(access_token, exam.exam.id),
            "upload_date": datetime_to_string(exam.exam.date_uploaded),
            "likes": GetExamLikes(exam.exam.id),
            "subject": exam.exam.subject
        })

    return recents

def GetPopularSchools(size: int) -> List[str]:
    """
    Returns a list of the most popular schools
    """
    res = []

    # Get all the schools    
    for school in Schools.objects.all():
        res.append(school.name)

        if len(res) == size:
            return res
        
    return res