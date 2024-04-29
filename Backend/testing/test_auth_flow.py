import os

from datetime import datetime

from testing import client
from testing.util import edit_profile, register, login, logout, refresh

class TestUserAuthFlow:
    def test_user_signup_then_refresh_token(self):
        response1 = register("Dane", "Urban", "danelegend13@gmail.com", "ThisIsAGoodPassword123@")

        # Get the access token and cookie
        access_token1 = response1["access_token"]
        refresh_token1 = response1["cookie"]

        response2 = refresh(refresh_token1)

        access_token2 = response2["access_token"]

        assert access_token1 != access_token2

    def test_user_signup_then_logout_then_signin(self):
        # Signup
        response1 = register("Dane", "Urban", "danelegend13@gmail.com", "ThisIsAGoodPassword123@")
        access_token1 = response1["access_token"]
        refresh_token1 = response1["cookie"]

        # Logout
        logout(access_token1)

        # Attempt refresh, should fail
        response3 = client.get("/api/auth/refresh", cookies={os.environ.get("REFRESH_TOKEN_COOKIE_KEY", "refresh"): refresh_token1})

        assert response3.status_code == 403

        # Sign in
        response4 = login("danelegend13@gmail.com", "ThisIsAGoodPassword123@")

        refresh_token = response4["cookie"]

        # Refresh
        refresh(refresh_token)

    def test_user_signup_then_edit_profile(self):
        # Signup
        response1 = register("Dane", "Urban", "danelegend13@gmail.com", "ThisIsAGoodPassword123@")
        access_token1 = response1["access_token"]
        refresh_token1 = response1["cookie"]

        # Edit profile
        edit_profile(access_token1, datetime(year=2002, month=5, day=13), 12, "Freshwater Senior Campus")
        