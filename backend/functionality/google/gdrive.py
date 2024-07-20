import io
import os

from typing import List

from logger import Logger

from googleapiclient.discovery import build, MediaFileUpload
from googleapiclient.http import MediaIoBaseDownload
from google.oauth2 import service_account

from functionality.bucket.bucket import upload_file

SCOPES = ['https://www.googleapis.com/auth/drive']

REVIEW_FILES_TO_ID = {}

def _authenticate():
    creds = service_account.Credentials.from_service_account_file(os.environ.get("GOOGLE_SERVICE_ACCOUNT_FILE", "service_account.json"), scopes=SCOPES)

    return creds

def _get_drive_folder_id(type: str) -> str:
    if type == "review":
        return os.environ.get("REVIEW_FOLDER_ID", "1C8m3UTJ63iPxQZettgGo3ARaPxhAhCDz")
    
    raise Exception("Invalid type")

def upload_file_to_drive(file_path: str, type: str):
    Logger.log_backend("Google Drive", f"Uploading file to Google Drive: {file_path}")

    creds = _authenticate()
    service = build('drive', 'v3', credentials=creds)

    file_metadata = {
        'name': os.path.basename(file_path),
        'parents': [_get_drive_folder_id(type)]
    }

    media = MediaFileUpload(file_path, mimetype='application/pdf')
    file = service.files().create(
        body=file_metadata, 
        media_body=media).execute()
    
    Logger.log_backend("Google Drive", f"Successfully uploaded file")

def _add_to_file_map(file_name: str, file_id: str, type: str):
    if type == "review":
        REVIEW_FILES_TO_ID[file_name] = file_id
    else:
        raise Exception("Invalid type")

def _get_files(type: str) -> List[str]:
    creds = _authenticate()
    service = build('drive', 'v3', credentials=creds)

    results = service.files().list(
        q=f"parents = '{_get_drive_folder_id(type)}'",
        fields="files(id, name)").execute()

    items = results.get('files', [])

    res = []
    for item in items:
        id = item['id']
        name = item['name']

        _add_to_file_map(name, id, type)

        res.append(name)

    return res

def get_files_in_review() -> List[str]:
    return _get_files("review")

def _delete_file_from_drive(file_id: str):
    Logger.log_backend("Google Drive", f"Deleting file from Google Drive: {file_id}")

    creds = _authenticate()
    service = build('drive', 'v3', credentials=creds)

    service.files().delete(fileId=file_id).execute()
    Logger.log_backend("Google Drive", f"Successfully deleted file: {file_id}")

def delete_file_from_review(file_name: str):
    file_id = REVIEW_FILES_TO_ID[file_name]
    _delete_file_from_drive(file_id)
    REVIEW_FILES_TO_ID.pop(file_name)

def move_file_from_review_to_current(file_name: str, new_name: str) -> str:
    Logger.log_backend("Google Drive", f"Moving file from review to current: {file_name} -> {new_name}")
    
    # Get the file id
    file_id = REVIEW_FILES_TO_ID[file_name]

    _download_file(file_id, new_name)

    # Delete the file from review
    delete_file_from_review(file_name)
    Logger.log_backend("Google Drive", f"Successfully moved file from review to current: {file_name} -> {new_name}")


def _download_file(file_id: str, file_name: str):
    Logger.log_backend("Google Drive", f"Downloading file from Google Drive: {file_id}")

    creds = _authenticate()
    service = build('drive', 'v3', credentials=creds)

    request = service.files().get_media(fileId=file_id)

    fh = io.BytesIO()
    downloader = MediaIoBaseDownload(fh, request)

    done = False
    
    while not done:
        status, done = downloader.next_chunk()

    fh.seek(0)
                       
    file_loc = os.path.join(os.environ.get("CURRENT_EXAMS_DIRECTORY", "D:\\Examify\\Examify\\exams"), file_name)

    with open(file_loc, "wb") as f:
        f.write(fh.read())
        f.close()

    upload_file(file_loc, file_name)

    os.remove(file_loc)

    Logger.log_backend("Google Drive", f"Successfully downloaded file: file_location={file_loc}")
