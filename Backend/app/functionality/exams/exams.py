from typing import List

from app.functionality.token import get_user
from app.models import FavouriteExam, RecentlyViewedExam
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
            "school_name": item.school_name,
            "type": item.exam_type,
            "year": item.year,
            "favourite": False if accessToken is None else ExamFavouriteOfUser(accessToken, item.id),
            "uploaded": item.date_uploaded,
            "likes": GetExamLikes(item.id),
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
            "school_name": exam.exam.school_name,
            "type": ExamType.MapPrefixToName(exam.exam.exam_type),
            "year": exam.exam.year,
            "favourite": True,
            "uploaded": exam.exam.date_uploaded,
            "likes": GetExamLikes(exam.exam.id)
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
            "school_name": exam.exam.school_name,
            "type": ExamType.MapPrefixToName(exam.exam.exam_type),
            "year": exam.exam.year,
            "favourite": ExamFavouriteOfUser(access_token, exam.exam.id),
            "uploaded": exam.exam.date_uploaded,
            "likes": GetExamLikes(exam.exam.id)
        })

    return recents
