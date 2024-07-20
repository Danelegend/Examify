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