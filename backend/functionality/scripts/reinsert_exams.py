import os

def reinsert_exams():
    # Get all the files in the folder
    current_exam_directory = os.environ.get("CURRENT_EXAMS_DIRECTORY")

    # Get all the files in the directory
    files = os.listdir(current_exam_directory)

    return files