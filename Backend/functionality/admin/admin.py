import os
from typing import List

from fastapi import UploadFile

from errors import AuthenticationError

from logger import Logger

from functionality.google.gdrive import delete_file_from_review, get_files_in_review, move_file_from_review_to_current, upload_file_to_drive
from functionality.authentication.authentication import GetUserPermissions
from functionality.types import ExamType

from database.db_types.db_request import ExamCreationRequest
from database.helpers.exam import delete_exam, get_exam, get_exams, insert_exam
from database.helpers.school import get_or_create_school

from router.api_types.api_response import CurrentExamResponse, ReviewExamResponse

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

    # Get or create the school object
    school_id = get_or_create_school(school)

    # Create new exam
    insert_exam(ExamCreationRequest(
        school=school_id,
        exam_type=ExamType.MapNameToPrefix(exam_type),
        year=year,
        file_location=new_file_name,
        subject=subject
    ))

def delete_file_from_current(file_name: str) -> None:
    delete_file(os.path.join(CURRENT_EXAMS_DIRECTORY, file_name))

def delete_file(file_location: str) -> None:
    os.remove(file_location)

def DeleteReviewExam(file_location: str) -> None:
    delete_file_from_review(file_location)

def DeleteCurrentExam(exam_id: int) -> None:
    """
    Delets the exam with the given id
    """
    exam = get_exam(id=exam_id)

    delete_file_from_current(exam.file_location)

    # Remove the exam record
    delete_exam(exam_id)

async def UploadExam(school: str, year: int, exam_type: str, subject: str, file: UploadFile) -> None:
    # Generate name for the file

    new_file_name = f"{school}-{year}_{subject}_{exam_type}.pdf"

    new_path = os.path.join(REVIEW_EXAMS_DIRECTORY, new_file_name)

    # Write the file to the new location
    data = await file.read()

    with open(new_path, "wb+") as destination:
        destination.write(data)

    # Upload the exam to google drive
    upload_file_to_drive(new_path, "review")

    os.remove(new_path)
