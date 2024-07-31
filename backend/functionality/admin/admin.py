import datetime
import os
import uuid

from typing import List, Optional, Tuple

from fastapi import UploadFile

from errors import AuthenticationError

from logger import Logger

from functionality.bucket.bucket import delete_file, exam_exists, rename_file
from functionality.exam.exam import FlagExam
from functionality.google.gdrive import delete_file_from_review, get_files_in_review, move_file_from_review_to_current, upload_file_to_drive
from functionality.google.sheets import append_values
from functionality.authentication.authentication import GetUserPermissions
from functionality.types import ExamType

from database.db_types.db_request import ExamCreationRequest, ExamUpdateRequest
from database.helpers.user import get_user_details, get_users
from database.helpers.exam import delete_exam, get_exam, get_exam_id_from_file_location, get_exams, insert_exam, insert_exam_flag, update_exam
from database.helpers.school import get_or_create_school

from router.api_types.api_response import CurrentExamResponse, RegisteredUserData, ReviewExamResponse

REVIEW_EXAMS_DIRECTORY = os.environ.get("REVIEW_EXAMS_DIRECTORY", "review_exams")
CURRENT_EXAMS_DIRECTORY = os.environ.get("CURRENT_EXAMS_DIRECTORY", "exams")

def ValidateToken(token: str):
    # Check that the token is valid
    if GetUserPermissions(token) != "ADM":
        raise AuthenticationError("User is not an admin")

def GetCurrentExams() -> List[CurrentExamResponse]:
    # Get the current exams
    exams = []

    for exam in get_exams():
        exams.append(
            CurrentExamResponse(
                id=exam.id,
                school=exam.school,
                type=ExamType.MapPrefixToName(exam.exam_type),
                year=exam.year,
                subject=exam.subject,
                file_location=exam.file_location
            ))

    return exams

def GetExamsToReview() -> List[ReviewExamResponse]:
    exams = []

    # Get the exams to review
    for file in get_files_in_review():
        exams.append(ReviewExamResponse(
            file_location=file
        ))

    return exams

def SubmitReviewExam(school: str, exam_type: str, year: int, subject: str, file_location: str) -> None:
    Logger.log_backend("Admin", f"Submitting exam from review to current: {school}, {exam_type}, {year}, {subject}, {file_location}")
    
    # Generate name for the file
    new_file_name = f"{school}-{year}_{subject}_{exam_type}.pdf"

    # Down the file from google drive
    move_file_from_review_to_current(file_location, new_file_name)

    InsertExam(school, exam_type, year, subject, new_file_name)

def InsertExam(school: str, exam_type: str, year: int, subject: str, file_location: str):
    # Get or create the school object
    school_id = get_or_create_school(school)

    # Create new exam
    insert_exam(ExamCreationRequest(
        school=school_id,
        exam_type=ExamType.MapNameToPrefix(exam_type),
        year=year,
        file_location=file_location,
        subject=subject
    ))

def delete_file_from_current(file_name: str) -> None:
    _delete_file(file_name)

def _delete_file(file_name: str) -> None:
    delete_file(file_name)

def DeleteReviewExam(file_location: str) -> None:
    delete_file_from_review(file_location)

def DeleteCurrentExam(exam_id: int) -> None:
    """
    Delets the exam with the given id
    """
    exam = get_exam(exam_id)

    delete_file_from_current(exam.file_location)

    # Remove the exam record
    delete_exam(exam_id)

def _create_file_name(school: str, year: int, exam_type: str, subject: str) -> str:
    return f"{school}-{year}_{subject}_{exam_type}.pdf"

async def UploadExam(school: str, year: int, exam_type: str, subject: str, file: UploadFile) -> None:
    # Generate name for the file

    new_file_name = _create_file_name(school, year, exam_type, subject)

    new_path = os.path.join(REVIEW_EXAMS_DIRECTORY, new_file_name)

    # Write the file to the new location
    data = await file.read()

    with open(new_path, "wb+") as destination:
        destination.write(data)

    # Upload the exam to google drive
    upload_file_to_drive(new_path, "review")

    os.remove(new_path)

def _create_temporary_file_name(file_name: str) -> str:
    file_name_without_extension = file_name.split(".")[0]
    
    adder = 0

    while exam_exists(f"{file_name_without_extension}_{adder}.pdf"):
        adder += 1

    return f"{file_name_without_extension}_{adder}.pdf"

def UpdateExamFileLocation(exam_id: int, new_file_location: str):
    database_request = ExamUpdateRequest(
        id=exam_id,
        file_location=new_file_location
    )

    update_exam(database_request)

def _update_exam_file_location(exam_id: int, original_file_name: str, new_file_name: str):
    Logger.log_backend("Admin", f"Renaming file: {original_file_name} -> {new_file_name}")
    
    # Check if there exists a file with the new name
    if exam_exists(new_file_name):
        Logger.log_backend("Admin", f"File with new name already exists: {new_file_name}")

        flagged_exam_id = get_exam_id_from_file_location(new_file_name)

        FlagExam(flagged_exam_id)

        # Rename this file to a temporary name
        temp_name = _create_temporary_file_name(new_file_name)

        _update_exam_file_location(flagged_exam_id, new_file_name, temp_name)

    # Rename the file
    rename_file(original_file_name, new_file_name)

    UpdateExamFileLocation(exam_id, new_file_name)

    Logger.log_backend("Admin", f"Successfully renamed file: {original_file_name} -> {new_file_name}")

def UpdateExam(exam_id: int, school: Optional[str] = None, year: Optional[int] = None, exam_type: Optional[str] = None, subject: Optional[str] = None) -> Tuple[bool, str]:
    Logger.log_backend("Admin", f"Updating exam: {exam_id}")
    exam_details = get_exam(exam_id)

    if exam_details is None:
        return False, "Exam does not exist"

    school = school if school is not None else exam_details.school
    year = year if year is not None else exam_details.year
    exam_type = exam_type if exam_type is not None else exam_details.exam_type
    subject = subject if subject is not None else exam_details.subject

    new_file_name = _create_file_name(school, year, exam_type, subject)

    # Compare the new file name with the old one and rename the file if necessary
    if new_file_name != exam_details.file_location:
        _update_exam_file_location(exam_id, exam_details.file_location, new_file_name)

    database_request = ExamUpdateRequest(
        id=exam_id,
        school=school,
        year=year,
        exam_type=ExamType.MapNameToPrefix(exam_type),
        subject=subject,
        file_location=new_file_name
    )

    try:
        update_exam(database_request)
        
        after_exam = get_exam(exam_id)

        Logger.log_debug(f"Subject from {exam_details.subject} to {after_exam.subject}")

        return True, "Update Successful"
    except Exception as e:
        return False, str(e)

def get_all_users() -> List[RegisteredUserData]:
    users = []

    for user in get_users():
        users.append(
            RegisteredUserData(
                first_name=user.first_name,
                last_name=user.last_name,
                email=user.email,
                school="" if user.school is None else user.school,
                school_year=0 if user.grade is None else user.grade
            ))

    return users

def submit_feedback(name: Optional[str], email: Optional[str], feedback: str, user_id: Optional[int] = None) -> None:
    id = uuid.uuid4()

    feedback_time = datetime.datetime.now()

    if user_id:
        user = get_user_details(user_id)
        name = user.first_name + " " + user.last_name
        email = user.email

    name = "" if name is None else name
    email = "" if email is None else email

    Logger.log_backend("Admin", f"Feedback: {name}, {email}, {feedback}, {id}")

    if "FEEDBACK_SHEET_ID" not in os.environ:
        Logger.log_backend_error("Admin", "Feedback sheet id not found")
        return

    
    append_values(os.environ.get("FEEDBACK_SHEET_ID"), "'Feedback'!A1:A5", "USER_ENTERED", [[str(id), name, email, feedback, feedback_time.isoformat()]])

    Logger.log_backend("Admin", "Feedback submitted")
