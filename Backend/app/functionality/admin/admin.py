import os
from typing import List

from app.functionality.google.gdrive import delete_file_from_review, get_files_in_review, move_file_from_review_to_current, upload_file_to_drive
from app.models import Exam, Schools
from app.errors import AuthenticationError
from app.functionality.authentication.authentication import GetUserPermissions
from app.types import ExamType

REVIEW_EXAMS_DIRECTORY = "D:\Examify\Examify\\review_exams"
CURRENT_EXAMS_DIRECTORY = "D:\Examify\Examify\exams"

def ValidateToken(token: str):
    # Check that the token is valid
    if GetUserPermissions(token) != "ADM":
        raise AuthenticationError("User is not an admin")

def GetCurrentExams() -> list:
    # Get the current exams
    exams = []

    for exam in Exam.objects.all():
        exams.append({
            "id": exam.id,
            "school": exam.school.name,
            "type": ExamType.MapPrefixToName(exam.exam_type),
            "year": exam.year,
            "subject": exam.subject,
            "file_location": exam.file_location
        })

    return exams

def GetExamsToReview() -> List[str]:
    # Get the exams to review
    return get_files_in_review()

def SubmitReviewExam(school: str, exam_type: str, year: int, subject: str, file_location: str) -> None:
    # Generate name for the file
    new_file_name = f"{school}-{year}_{subject}_{exam_type}.pdf"

    print(new_file_name)

    # Down the file from google drive
    move_file_from_review_to_current(file_location, new_file_name)

    # Get or create the school object
    school, _ = Schools.objects.get_or_create(name=school)

    # Create the exam object
    new_exam_record = Exam.objects.create(school=school, 
                        exam_type=exam_type, 
                        year=year, 
                        subject=subject, 
                        file_location=new_file_name)

    new_exam_record.save()

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
    exam = Exam.objects.get(id=exam_id)

    delete_file_from_current(exam.file_location)

    # Remove the exam record
    exam.delete()

def UploadExam(school: str, year: int, exam_type: str, subject: str, file: bytes) -> None:
    # Generate name for the file
    new_file_name = f"{school}-{year}_{subject}_{exam_type}.pdf"

    new_path = os.path.join(REVIEW_EXAMS_DIRECTORY, new_file_name)

    # Write the file to the new location
    with open(new_path, "wb+") as destination:
        for chunk in file.chunks():
            destination.write(chunk)

    # Upload the exam to google drive
    upload_file_to_drive(new_path, "review")

    os.remove(new_path)
