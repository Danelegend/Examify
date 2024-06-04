import os

def reinsert_exams():
    # Get all the files in the folder
    current_exam_directory = os.environ.get("CURRENT_EXAMS_DIRECTORY")

    # Get all the files in the directory
    files = os.listdir(current_exam_directory)

    parsed_files = []

    for file_name in files:
        parsed_files.append(_parse_filename(file_name))

    return parsed_files

def _parse_filename(file_name: str):
    """
    A filename takes the form {school}-{year}_{subject}_{exam_type}.pdf
    """
    file_name = file_name.replace(".pdf", "")

    first_split = file_name.split('-')
    second_split = first_split[1].split('_')

    return {
        'school': first_split[0],
        'year': second_split[0],
        'subject': second_split[1],
        'exam_type': second_split[2]
    }