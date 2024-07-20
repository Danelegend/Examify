import os

import boto3

from logger import Logger

def _create_client() -> boto3.client:
    """
    Create a client for the idrive service
    
    Return the client
    """
    endpoint = "https://h0w8.la5.idrivee2-11.com"
    client = boto3.client("s3", endpoint_url=endpoint)
    return client

client = _create_client()

def get_file(file_name: str):
    """
    Get the file from idrive
    
    Return the file
    """
    try:
        resp = client.get_object(Bucket="exams", Key=file_name)
    
        return resp['Body']
    except Exception as e:
        Logger.log_backend_error("S3 Bucket", f"Error viewing file: {e}")
        raise e
    
def upload_file(file_path: str, file_name: str) -> bool:
    """
    Upload the file to idrive

    Uploads the file at file_path to the bucket with the name file_name
    
    Return whether operation was successful
    """
    Logger.log_backend("S3 Bucket", f"Uploading file {file_name}")

    # Check if its already been uploaded
    if exam_exists(file_name):
        Logger.log_backend("S3 Bucket", f"File {file_name} already exists")
        return False

    # Check that the file exists
    if not os.path.exists(file_path):
        Logger.log_backend_error("S3 Bucket", f"File {file_path} does not exist")
        return False

    # Upload the file
    try:
        client.upload_file(file_path, "exams", file_name)
    except Exception as e:
        Logger.log_backend_error("S3 Bucket", f"Error uploading file: {e}")
        return False
    
    Logger.log_backend("S3 Bucket", f"File {file_name} uploaded")
    return True

def exam_exists(file_name: str) -> bool:
    # Check if the exam exists in idrive
    try:
        client.get_object(Bucket="exams", Key=file_name)
        return True
    except Exception as e:
        return False
    
def rename_file(old_file_name: str, new_file_name: str) -> bool:
    if exam_exists(new_file_name):
        Logger.log_backend("S3 Bucket", f"File with new name already exists: {new_file_name}")
        return False
    
    try:
        client.copy_object(Bucket="exams", CopySource={"Bucket": "exams", "Key": old_file_name}, Key=new_file_name)
        delete_file(old_file_name)
    except Exception as e:
        Logger.log_backend_error("S3 Bucket", f"Error renaming file: {e}")
        return False
    
    return True

def delete_file(file_name: str) -> bool:
    try:
        client.delete_object(Bucket="exams", Key=file_name)
    except Exception as e:
        Logger.log_backend_error("S3 Bucket", f"Error deleting file: {e}")
        return False
    
    return True