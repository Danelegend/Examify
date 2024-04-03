from app.errors import DuplicationError, ValidationError
from app.models import Exam, FavouriteExam, RecentlyViewedExam
from app.functionality.token import get_user
from app.types import ExamType
from app.security import FileLocationAccessible
from app.functionality.DatabaseAccessor import DatabaseAccessor

URL = "http://localhost:8080"

def GetExam2(school: str, year: int, type: str) -> dict:
    """
    Gets an exam given school, year and type
    """
    exam = Exam.objects.filter(school_name=school, year=year, exam_type=type)

    if exam.exists():
        return {
            "exam_id": exam[0].id,
        }
    
    raise ValidationError("Exam not found")

def GetExam(exam_id: int):
    """
    Given an id for an exam, get the details regarding it

    Parameters:
        exam_id: The id for the exam we want to search about
    
    Return:
        json serialized document with following keys:
         - id
         - school_name
         - type
         - year
         - exam_link

    Errors:
        Returns None if no record is found with the given exam_id
    """
    record = DatabaseAccessor().GetExam(exam_id)

    if record is None:
        return None

    file_location = record.file_location
    exam_link = URL + "/api/exam/exampdf?location=" + file_location

    data = {
        "id": record.id,
        "school_name": record.school_name,
        "type": ExamType.MapPrefixToName(record.exam_type),
        "year": record.year,
        "exam_link": exam_link
    }

    return data

def GetExamPdf(location: str):
    if not FileLocationAccessible(location):
        raise ValueError("Unaccessible location")
    
    return open(location, "rb")

def GetExamLikes(exam_id: int):
    """
    Given an exam id, return the number of likes it has
    """
    return FavouriteExam.objects.filter(exam=exam_id).count()

def AddFavouriteExam(access_token: str, exam_id: int):
    """
    access_token is the provided access token

    exam id is the id of the exam to add to the user's favourites
    """
    # Check that the token is valid and get the user
    user = get_user(access_token)

    # Check that the exam is valid
    exam = DatabaseAccessor().GetExam(exam_id)

    if exam is None:
        raise ValidationError("Invalid exam id")

    # Check that the user doesn't already have the exam favourited
    if ExamFavouriteOfUser(access_token, exam_id):
        raise DuplicationError("Exam already favourited")

    # Add the exam to the user's favourites
    FavouriteExam.objects.create(user=user, exam=exam).save()

def RemoveFavouriteExam(access_token: str, exam_id: int):
    """
    Removes a favourite exam from the user's list of favourites
    """
    user = get_user(access_token)

    exam = DatabaseAccessor().GetExam(exam_id)

    if exam is None:
        raise ValidationError("Invalid exam id")
    
    if not ExamFavouriteOfUser(access_token, exam_id):
        raise ValidationError("Exam not favourited")
    
    FavouriteExam.objects.filter(user=user, exam=exam).delete()

def AddRecentlyViewedExam(access_token: str, exam_id: int):
    """
    Adds an exam to the user's recently viewed exams
    """
    user = get_user(access_token)

    exam = DatabaseAccessor().GetExam(exam_id)

    if exam is None:
        raise ValidationError("Invalid exam id")

    if RecentlyViewedExam.objects.filter(user=user, exam=exam).exists():
        return

    RecentlyViewedExam.objects.create(user=user, exam=exam).save()

def ExamFavouriteOfUser(access_token: str, exam_id: int) -> bool:
    """
    access_token is the provided access token

    exam id is the id of the exam to add to the user's favourites
    """
    # Check that the token is valid and get the user
    user = get_user(access_token)
    exam = DatabaseAccessor().GetExam(exam_id)

    return FavouriteExam.objects.filter(user=user, exam=exam).exists()