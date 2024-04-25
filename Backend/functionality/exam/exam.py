import os

from errors import DuplicationError, ValidationError

from functionality.token import get_user_id
from functionality.types import ExamType
from functionality.security import FileLocationAccessible

from database.helpers.exam import check_exam_exists, get_exam, get_exam_id_from_schoool_year_type
from database.helpers.favourite import check_if_user_favourite_exam_exists, delete_user_favourite_exam, get_exam_likes_count, insert_user_favourite_exam
from database.helpers.recent import insert_user_recently_viewed_exam

URL = "http://localhost:8080"

def GetExamId(school: str, year: int, type: str) -> int:
    """
    Gets an exam given school, year and type
    """

    exam_id = get_exam_id_from_schoool_year_type(school, year, type)

    if exam_id is None:
        raise ValidationError("Exam not found")
    
    return exam_id

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
    exam = get_exam(exam_id)

    file_location = exam.file_location
    exam_link = URL + "/api/exam/exampdf?location=" + file_location

    data = {
        "id": exam.id,
        "school_name": exam.school_name,
        "type": ExamType.MapPrefixToName(exam.exam_type),
        "year": exam.year,
        "exam_link": exam_link
    }

    return data

def GetExamPdf(file_name: str):
    location = os.path.join(os.environ.get("CURRENT_EXAMS_DIRECTORY"), file_name)

    if not FileLocationAccessible(location):
        raise ValueError("Unaccessible location")
    
    return open(location, "rb")

def GetExamLikes(exam_id: int):
    """
    Given an exam id, return the number of likes it has
    """
    
    return get_exam_likes_count(exam_id)

def AddFavouriteExam(access_token: str, exam_id: int):
    """
    access_token is the provided access token

    exam id is the id of the exam to add to the user's favourites
    """
    # Check that the token is valid and get the user
    user_id = get_user_id(access_token)

    # Check that the exam is valid
    if not check_exam_exists(exam_id):
        raise ValidationError("Exam does not exist")

    # Check that the user doesn't already have the exam favourited
    if ExamFavouriteOfUser(access_token, exam_id):
        raise DuplicationError("Exam already favourited")

    # Add the exam to the user's favourites
    insert_user_favourite_exam(user_id, exam_id)


def RemoveFavouriteExam(access_token: str, exam_id: int):
    """
    Removes a favourite exam from the user's list of favourites
    """
    user_id = get_user_id(access_token)

    # Check exam exists
    if not check_exam_exists(exam_id):
        raise ValidationError("Exam does not exist")
    
    if not ExamFavouriteOfUser(access_token, exam_id):
        raise ValidationError("Exam not favourited")
    
    delete_user_favourite_exam(user_id, exam_id)

def AddRecentlyViewedExam(access_token: str, exam_id: int):
    """
    Adds an exam to the user's recently viewed exams
    """
    user_id = get_user_id(access_token)

    # Check exam exists
    if not check_exam_exists(exam_id):
        raise ValidationError("Exam does not exist")

    insert_user_recently_viewed_exam(user_id, exam_id)

def ExamFavouriteOfUser(access_token: str, exam_id: int) -> bool:
    """
    access_token is the provided access token

    exam id is the id of the exam to add to the user's favourites
    
    precondition:
    exam_id is a valid exam id
    """
    # Check that the token is valid and get the user
    user_id = get_user_id(access_token)

    return check_if_user_favourite_exam_exists(user_id, exam_id)
