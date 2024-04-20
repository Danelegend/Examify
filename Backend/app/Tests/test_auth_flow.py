import os
from django.http import SimpleCookie
import pytest

from rest_framework.test import APIClient 

@pytest.fixture(autouse=True)
def setup():
    os.environ["REFRESH_TOKEN_COOKIE_KEY"] = "refresh"
    os.environ["REFRESH_TOKEN_SECRET"] = "DreamTeamH18A"
    os.environ["REFRESH_TOKEN_EXPIRY_DAYS"] = "7"
    os.environ["ACCESS_TOKEN_SECRET"] = "ThisIsADummyKey"
    os.environ["ACCESS_TOKEN_EXPIRY_MINUTES"] = "15"


@pytest.fixture(scope="function")  
def api_client() -> APIClient:   # type: ignore
    """  
    Fixture to provide an API client  
    :return: APIClient  
    """  
    yield APIClient()


@pytest.mark.django_db
class TestUserAuthFlow:
    def test_user_signup_then_refresh_token(self, api_client):
        payload = {
            "first_name": "Dane",
            "last_name": "Urban",
            "email": "danelegend13@gmail.com",
            "password": "ThisIsAGoodPassword123@"
        }

        response1 = api_client.post("/api/auth/register", data=payload, format="json")

        # Get the access token and cookie
        assert response1.status_code == 200
        assert "access_token" in response1.json()
        access_token1 = response1.json()["access_token"]

        assert os.environ["REFRESH_TOKEN_COOKIE_KEY"] in response1.cookies
        refresh_token = response1.cookies[os.environ["REFRESH_TOKEN_COOKIE_KEY"]]
        api_client.cookies = SimpleCookie({os.environ["REFRESH_TOKEN_COOKIE_KEY"]: refresh_token})
    
        response2 = api_client.get("/api/auth/refresh")

        assert response2.status_code == 200
        assert "access_token" in response2.json()
        access_token2 = response2.json()["access_token"]

        assert access_token1 != access_token2

    def test_user_signup_then_logout_then_signin(self, api_client):
        # Signup
        payload = {
            "first_name": "Dane",
            "last_name": "Urban",
            "email": "danelegend13@gmail.com",
            "password": "ThisIsAGoodPassword123@"
        }

        response1 = api_client.post("/api/auth/register", data=payload, format="json")

        # Get the access token and cookie
        assert response1.status_code == 200
        assert "access_token" in response1.json()
        access_token1 = response1.json()["access_token"]

        assert os.environ["REFRESH_TOKEN_COOKIE_KEY"] in response1.cookies
        refresh_token = response1.cookies[os.environ["REFRESH_TOKEN_COOKIE_KEY"]]
        api_client.cookies = SimpleCookie({os.environ["REFRESH_TOKEN_COOKIE_KEY"]: refresh_token})

        print(access_token1)

        # Logout
        response2 = api_client.delete("/api/auth/logout", HTTP_AUTHORIZATION=f"bearer {access_token1}")
        assert response2.status_code == 200

        # Attempt refresh, should fail
        response3 = api_client.get("/api/auth/refresh")
        assert response3.status_code == 403

        # Sign in
        payload = {
            "email": "danelegend13@gmail.com",
            "password": "ThisIsAGoodPassword123@"
        }

        response4 = api_client.post("/api/auth/login", data=payload, format="json")

        assert response4.status_code == 200
        refresh_token = response4.cookies[os.environ["REFRESH_TOKEN_COOKIE_KEY"]]
        api_client.cookies = SimpleCookie({os.environ["REFRESH_TOKEN_COOKIE_KEY"]: refresh_token})

        # Refresh
        response5 = api_client.get("/api/auth/refresh")
        assert response5.status_code == 200
