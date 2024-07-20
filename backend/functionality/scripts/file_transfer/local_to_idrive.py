import os

import boto3

from database.helpers.exam import get_exams

def transfer_files():
    # Transfer files from local to idrive
    
    # Go through all the exams
    exams = get_exams()
    client = _create_client()

    for exam in exams:
        file_name = exam.file_location
        file_path = _get_exam_file_path(file_name)
        
        res = _upload_file(file_path, client, file_name)

        #if res:
            # Delete the file locally
            #_delete_file_locally(file_path)


def _get_exam_file_path(exam_file_name: str) -> str:
    # Get the path of the exam file
    return os.path.join(os.environ.get("CURRENT_EXAMS_DIRECTORY"), exam_file_name)

def _upload_file(file_path: str, client: boto3.client, file_name: str) -> bool:
    """
    Upload the file to idrive
    
    Return whether operation was successful
    """
    # Upload the file
    if not os.path.exists(file_path):
        print(f"File {file_path} does not exist")
        return False

    try:
        client.upload_file(file_path, "exams", file_name)
    except Exception as e:
        print(f"Error uploading file: {e}")
        return False
    return True

def _create_client() -> boto3.client:
    """
    Create a client for the idrive service
    
    Return the client
    """
    endpoint = "https://h0w8.la5.idrivee2-11.com"
    client = boto3.client("s3", endpoint_url=endpoint)
    return client

def _delete_file_locally(file_path: str):
    # Delete the file locally
    os.remove(file_path)