import os

from logger import Logger

from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from google.oauth2 import service_account

SCOPES = ['https://www.googleapis.com/auth/spreadsheets']

def _authenticate():
    creds = service_account.Credentials.from_service_account_file(os.environ.get("GOOGLE_SERVICE_ACCOUNT_FILE", "service_account.json"), scopes=SCOPES)

    return creds

def create(title):
  """
  Creates the Sheet the user has access to.
  Load pre-authorized user credentials from the environment.
  TODO(developer) - See https://developers.google.com/identity
  for guides on implementing OAuth2 for the application.
  """
  creds = _authenticate()
  # pylint: disable=maybe-no-member
  try:
    service = build("sheets", "v4", credentials=creds)
    spreadsheet = {"properties": {"title": title}}
    spreadsheet = (
        service.spreadsheets()
        .create(body=spreadsheet, fields="spreadsheetId")
        .execute()
    )
    Logger.log_backend("Google Sheets", f"Spreadsheet ID: {(spreadsheet.get('spreadsheetId'))}")
    return spreadsheet.get("spreadsheetId")
  except HttpError as error:
    Logger.log_backend_error("Google Sheets", f"An error occurred: {error}")
    return error

def append_values(spreadsheet_id, range_name, value_input_option, _values):
  """
  Creates the batch_update the user has access to.
  Load pre-authorized user credentials from the environment.
  TODO(developer) - See https://developers.google.com/identity
  for guides on implementing OAuth2 for the application.
  """
  creds = _authenticate()
  # pylint: disable=maybe-no-member
  try:
    service = build("sheets", "v4", credentials=creds)

    values = [
        [
            # Cell values ...
        ],
        # Additional rows ...
    ]
    # [START_EXCLUDE silent]
    values = _values
    # [END_EXCLUDE]
    body = {"values": values}
    result = (
        service.spreadsheets()
        .values()
        .append(
            spreadsheetId=spreadsheet_id,
            range=range_name,
            valueInputOption=value_input_option,
            body=body,
        )
        .execute()
    )
    Logger.log_backend("Google Sheets", f"{(result.get('updates').get('updatedCells'))} cells appended.")
    return result

  except HttpError as error:
    Logger.log_backend_error("Google Sheets", f"An error occurred: {error}")
    return error