import os
import pytest

from app.functionality.authentication.authentication import LoginUser, RegisterUser
from app.functionality.token import get_user_id
from app.functionality.authentication.user_form import UserForm

@pytest.fixture(autouse=True)
def token_setup():
    os.environ["REFRESH_TOKEN_SECRET"] = "DreamTeamH18A"
    os.environ["REFRESH_TOKEN_EXPIRY_DAYS"] = "7"

    os.environ["ACCESS_TOKEN_SECRET"] = "ThisIsADummyKey"
    os.environ["ACCESS_TOKEN_EXPIRY_MINUTES"] = "15"

@pytest.fixture
def registered_user_ids():
    up = UserForm()
    up.password = "ThisIsAGoodPassword123"
    up.first_name = "Dane"
    up.last_name = "Urban"
    up.email = "danelegend13@examify.com"

    response = RegisterUser(up)

    return [get_user_id(response["access_token"])]


@pytest.mark.django_db
class TestUserLoginSuccess:
    def test_basic_user_login(self, registered_user_ids):
        expected_user_id = registered_user_ids[0]

        email = "danelegend13@examify.com"
        password = "ThisIsAGoodPassword123"

        response = LoginUser(email, password)

        assert get_user_id(response["access_token"]) == expected_user_id
