import os
import pytest

@pytest.fixture(autouse=True)
def reset_db():
    """
    Used for resetting the testing database each test
    """
    from database.linker import DatabaseSetup # pylint: disable=import-outside-toplevel

    DatabaseSetup().clear_tables(DatabaseSetup().list_tables())

@pytest.fixture(autouse=True)
def setup():
    os.environ["REFRESH_TOKEN_COOKIE_KEY"] = "refresh"
    os.environ["REFRESH_TOKEN_SECRET"] = "DreamTeamH18A"
    os.environ["REFRESH_TOKEN_EXPIRY_DAYS"] = "7"
    os.environ["ACCESS_TOKEN_SECRET"] = "ThisIsADummyKey"
    os.environ["ACCESS_TOKEN_EXPIRY_MINUTES"] = "15"
    os.environ["CURRENT_EXAMS_DIRECTORY"] = "D:\Examify\Examify\Backend\\app\Tests\\test_current_exams"
    os.environ["REVIEW_FOLDER_ID"] = "1C8m3UTJ63iPxQZettgGo3ARaPxhAhCDz"