import json
import os
import pytest

from rest_framework.test import APIClient 

@pytest.fixture(autouse=True)
def setup():
    os.environ["REFRESH_TOKEN_COOKIE_KEY"] = "refresh"
    os.environ["REFRESH_TOKEN_SECRET"] = "DreamTeamH18A"
    os.environ["REFRESH_TOKEN_EXPIRY_DAYS"] = "7"
    os.environ["ACCESS_TOKEN_SECRET"] = "ThisIsADummyKey"
    os.environ["ACCESS_TOKEN_EXPIRY_MINUTES"] = "15"
    os.environ["CURRENT_EXAMS_DIRECTORY"] = "D:\Examify\Examify\Backend\\app\Tests\\test_current_exams"
    os.environ["REVIEW_FOLDER_ID"] = "1C8m3UTJ63iPxQZettgGo3ARaPxhAhCDz"

@pytest.fixture(scope="function")  
def api_client() -> APIClient:   # type: ignore
    """  
    Fixture to provide an API client  
    :return: APIClient  
    """  
    yield APIClient()

@pytest.fixture(scope="function")
@pytest.mark.django_db
def register_admin(api_client):
    # Signup
    payload = {
        "first_name": "Dane",
        "last_name": "Urban",
        "email": "danelegend13@gmail.com",
        "password": "ThisIsAGoodPassword123@"
    }

    response = api_client.post("/api/auth/register", data=payload, format="json")

    assert response.status_code == 200

    return response.json()["access_token"]

@pytest.fixture(scope="function", autouse=True)
def clean_current_exams():
    # Clean the current exams directory
    for file in os.listdir(os.environ["CURRENT_EXAMS_DIRECTORY"]):
        os.remove(os.path.join(os.environ["CURRENT_EXAMS_DIRECTORY"], file))

@pytest.mark.django_db
class TestAdminFlow:
    def test_admin_get_current_exams(self, api_client, register_admin):
        token = register_admin

        response = api_client.get("/api/admin/exams/current", HTTP_AUTHORIZATION=f"bearer {token}")

        assert response.status_code == 200
        assert "exams" in response.json()
        assert response.json()["exams"] == []

    def test_admin_flow_from_review_to_current(self, api_client, register_admin):
        # Start by uploading an exam
        payload = {"file": open("D:\Examify\Examify\Backend\\app\Tests\\test.pdf", "rb"),
                   "school": "Test School",
                   "type": "Trial",
                   "year": 2021,
                   "subject": "Test Subject"}

        response = api_client.post("/api/admin/exam/upload", data=payload)

        assert response.status_code == 200

        # Register the admin
        token = register_admin

        # Check exams in review
        response2 = api_client.get("/api/admin/exams/review", HTTP_AUTHORIZATION=f"bearer {token}")

        assert response2.status_code == 200
        assert "exams" in response2.json()

        assert response2.json()["exams"] == ["Test School-2021_Test Subject_Trial.pdf"]

        # Check that there are currently no exams in the exams database
        response3 = api_client.get("/api/admin/exams/current", HTTP_AUTHORIZATION=f"bearer {token}")

        assert response3.status_code == 200
        assert response3.json()["exams"] == []

        # Check test_current_exams folder is empty
        assert len(os.listdir(os.environ["CURRENT_EXAMS_DIRECTORY"])) == 0

        # Submit the exam
        payload = {
            "school_name": "Test School",
            "exam_type": "TRI",
            "year": 2022,
            "subject": "Chemistry",
            "file_location": "Test School-2021_Test Subject_Trial.pdf"
        }

        response4 = api_client.post("/api/admin/exam/review/submit", data=json.dumps(payload), HTTP_AUTHORIZATION=f"bearer {token}", content_type='application/json')

        assert response4.status_code == 200

        # Check that the exam is now in the current exams
        response5 = api_client.get("/api/admin/exams/current", HTTP_AUTHORIZATION=f"bearer {token}")
        
        assert response5.status_code == 200
        assert len(response5.json()["exams"]) == 1

        # Check that the exam is no longer in the review exams
        response6 = api_client.get("/api/admin/exams/review", HTTP_AUTHORIZATION=f"bearer {token}")

        assert response6.status_code == 200
        assert response6.json()["exams"] == []

        # Check exam in current exams folder
        assert len(os.listdir(os.environ["CURRENT_EXAMS_DIRECTORY"])) == 1
