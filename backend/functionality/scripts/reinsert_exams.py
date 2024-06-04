import os

from pydantic import BaseModel

from functionality.admin.admin import InsertExam

class ParsedExam(BaseModel):
    school: str
    year: int
    subject: str
    exam_type: str

def reinsert_exams():
    # Get all the files in the folder
    current_exam_directory = os.environ.get("CURRENT_EXAMS_DIRECTORY")

    # Get all the files in the directory
    files = os.listdir(current_exam_directory)

    for file_name in files:
        parsed_file = _parse_filename(file_name)

        InsertExam(
            parsed_file.school,
            parsed_file.exam_type,
            parsed_file.year,
            parsed_file.subject,
            file_name
        )


def _parse_filename(file_name: str):
    """
    A filename takes the form {school}-{year}_{subject}_{exam_type}.pdf
    """
    file_name = file_name.replace(".pdf", "")

    first_split = file_name.split('-')
    second_split = first_split[1].split('_')

    return ParsedExam(
        school=first_split[0],
        year=int(second_split[0]),
        subject=second_split[1],
        exam_type=second_split[2]
    )
