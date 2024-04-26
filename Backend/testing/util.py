import os

from io import BufferedReader
from testing import client

def check_cookies(response):
    """
    Checks that the response receives both refresh_token and access token in cookies
    """
    # Check that we get refresh_token in cookie
    cookie = response.cookies.get(os.environ.get("REFRESH_TOKEN_COOKIE_KEY", "refresh"))
    assert cookie is not None, "missing: refresh token (from cookies)"

    # Check that we get the access token, user id and user type
    assert "access_token" in response.json(), "missing: access token"

    return {
        "cookie": cookie,
        "access_token": response.json().get("access_token")
    }

def register(first_name: str, last_name: str, email: str, password: str):
    # Signup
    payload = {
        "first_name": first_name,
        "last_name": last_name,
        "email": email,
        "password": password
    }

    response = client.post("/api/auth/register", json=payload)

    assert response.status_code == 200

    return check_cookies(response)

def login(email: str, password: str):
    # Login
    payload = {
        "email": email,
        "password": password
    }

    response = client.post("/api/auth/login", json=payload)

    assert response.status_code == 200

    return check_cookies(response)

def logout(token: str):
    response = client.delete("/api/auth/logout", headers={"Authorization": f"bearer {token}"})

    assert response.status_code == 200

def refresh(refresh_token: str):
    response = client.get("/api/auth/refresh", cookies={os.environ.get("REFRESH_TOKEN_COOKIE_KEY", "refresh"): refresh_token})

    print(response.status_code)

    assert response.status_code == 200

    assert "access_token" in response.json(), "missing: access token"

    return response.json()

def admin_get_current_exams(token: str):
    response = client.get("/api/admin/exams/current", headers={"Authorization": f"bearer {token}"})

    assert response.status_code == 200
    assert "exams" in response.json()

    return response.json()

def admin_get_review_exams(token: str):
    response = client.get("/api/admin/exams/review", headers={"Authorization": f"bearer {token}"})

    assert response.status_code == 200
    assert "exams" in response.json()

    return response.json()

def admin_submit_review_exam(token: str, school: str, exam_type: str, year: int, subject: str, file_location: str):
    payload = {
        "school": school,
        "exam_type": exam_type,
        "year": year,
        "subject": subject,
        "file_location": file_location
    }

    response = client.post("/api/admin/exam/submit", json=payload, headers={"Authorization": f"bearer {token}"})

    assert response.status_code == 200

    return response.json()

def admin_upload_exam(file: BufferedReader, school: str, exam_type: str, year: int, subject: str):
    payload = {
        "school": school,
        "type": exam_type,
        "year": year,
        "subject": subject,
        "grade": 12,
        "file": file
    }

    response = client.post("/api/admin/exam/upload", files=payload)

    assert response.status_code == 200

    return response.json()