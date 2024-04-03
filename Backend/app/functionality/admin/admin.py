import os
import shutil

from app.models import Exam
from app.errors import AuthenticationError
from app.functionality.authentication.authentication import GetUserPermissions
from app.types import ExamType

REVIEW_EXAMS_DIRECTORY = "D:\Examify\Examify\Backend\\review_exams"
CURRENT_EXAMS_DIRECTORY = "D:\Examify\Examify\Backend\exams"

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
            "school": exam.school_name,
            "type": ExamType.MapPrefixToName(exam.exam_type),
            "year": exam.year,
            "subject": exam.subject,
            "file_location": exam.file_location
        })

    return exams

def GetExamsToReview() -> list:
    # Get the exams to review
    return [f for f in os.listdir(REVIEW_EXAMS_DIRECTORY) if os.path.isfile(os.path.join(REVIEW_EXAMS_DIRECTORY, f))]

def SubmitExam(school: str, exam_type: str, year: int, subject: str, file_location: str) -> None:
    # Generate name for the file
    new_file_name = f"{school}-{year}_{subject}_{exam_type}.pdf"

    old_path = os.path.join(REVIEW_EXAMS_DIRECTORY, file_location)
    new_path = os.path.join(CURRENT_EXAMS_DIRECTORY, new_file_name)

    # Move the file to the new location
    # Note: This will remove in from original location
    shutil.move(old_path, new_path)

    # Create the exam object
    new_exam_record = Exam.objects.create(school_name=school, 
                        exam_type=exam_type, 
                        year=year, 
                        subject=subject, 
                        file_location="exams/" + new_file_name)
    
    new_exam_record.save()

def DeleteExam(file_location: str) -> None:
    os.remove(os.path.join(REVIEW_EXAMS_DIRECTORY, file_location))
