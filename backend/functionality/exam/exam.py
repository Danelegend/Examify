from errors import DuplicationError, ValidationError

from logger import Logger

from functionality.bucket.bucket import get_file
from functionality.token import get_user_id
from functionality.types import ExamType, SubjectType

from database.helpers.completed import check_if_user_complete_exam_exists, insert_user_completed_exam, remove_user_completed_exam
from database.helpers.exam import check_exam_exists, get_exam, get_exam_id_from_subject_school_year_type, insert_exam_flag
from database.helpers.favourite import check_if_user_favourite_exam_exists, delete_user_favourite_exam, get_exam_likes_count, insert_user_favourite_exam
from database.helpers.recent import insert_user_recently_viewed_exam

def GetExamId(subject: str, school: str, year: int, type: str) -> int:
    """
    Gets an exam given school, year and type
    """
    type = ExamType.MapNameToPrefix(type)
    subject = SubjectType.MapPrefixToName(subject)

    exam_id = get_exam_id_from_subject_school_year_type(subject, school, year, type)

    if exam_id is None:
        raise ValidationError("Exam not found")
    
    return exam_id

def GetExamPdf(exam_id: int):
    file_name = get_exam(exam_id).file_location

    return get_file(file_name)

def GetExamLikes(exam_id: int):
    """
    Given an exam id, return the number of likes it has
    """
    
    return get_exam_likes_count(exam_id)

def GetFavouriteExam(user_id: int, exam_id: int):
    """
    Determines whether the given exam is a favourite of the user
    """
    return check_if_user_favourite_exam_exists(user_id, exam_id)

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

def GetUserCompletedExam(user_id: int, exam_id: int) -> bool:
    """
    Given a user id and exam id, determines whether the user has
    completed the exam
    """
    return check_if_user_complete_exam_exists(user_id, exam_id)

def AddUserCompletedExam(user_id: int, exam_id: int):
    """
    Given a user_id and exam id, denotes that this exam hass been completed
    by the user
    """
    insert_user_completed_exam(user_id, exam_id)

def RemoveUserCompletedExam(user_id: int, exam_id: int):
    """
    Given a user id and exam id, removes any nature of this exam being
    completed by the user
    """
    remove_user_completed_exam(user_id, exam_id)

def FlagExam(exam_id: int):
    """
    Flags the exam with the given id
    """
    Logger.log_backend("Admin", f"Flagging exam, id={exam_id}")

    insert_exam_flag(exam_id)
