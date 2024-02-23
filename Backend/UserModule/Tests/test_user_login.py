import pytest

from UserModule.Functionality.user import RegisterUser, LoginUser
from UserModule.Functionality.UserProfile import UserProfile

@pytest.fixture
def registered_user_ids():
    up = UserProfile()
    up.password = "ThisIsAGoodPassword123"
    up.first_name = "Dane"
    up.last_name = "Urban"
    up.email = "danelegend13@examify.com"

    response = RegisterUser(up)

    return [response["user_id"]]


@pytest.mark.django_db
class TestUserLoginSuccess:
    def test_basic_user_login(self, registered_user_ids):
        expected_user_id = registered_user_ids[0]

        email = "danelegend13@examify.com"
        password = "ThisIsAGoodPassword123"

        response = LoginUser(email, password)

        assert response["user_id"] == expected_user_id
