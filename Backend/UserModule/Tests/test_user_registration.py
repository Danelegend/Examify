import pytest

from UserModule.Functionality.user import RegisterUser, ValidationError
from UserModule.Functionality.UserProfile import UserProfile   


def check_all_user_profile_attributes_filled(obj: UserProfile) -> bool:
    from UserModule.Functionality.UserProfile import USER_PROFILE_DEFAULT_VAL

    def get_object_attributes(obj):
        return [a for a in dir(obj) if not a.startswith('__') and not callable(getattr(obj, a))]


    for attr in get_object_attributes(obj):
        assert getattr(obj, attr) is not USER_PROFILE_DEFAULT_VAL


@pytest.mark.django_db
class TestUserRegistrationSuccess:
    def check_successful_response(self, response):
        assert response["user_id"] > -1

    def test_minimum_successful_registration(self):
        basic_user = UserProfile()
        basic_user.password = "ThisIsAGoodPassword123"
        basic_user.first_name = "Dane"
        basic_user.last_name = "Urban"
        basic_user.email = "danelegend13@examify.com"

        response = RegisterUser(basic_user)

        self.check_successful_response(response)

    def test_successful_registration_password_length_8(self):
        basic_user = UserProfile()
        basic_user.password = "Minimum8"
        basic_user.first_name = "Dane"
        basic_user.last_name = "Urban"
        basic_user.email = "danelegend13@examify.com"

        response = RegisterUser(basic_user)

        self.check_successful_response(response)
    
    def test_maximum_filled_successful_registration(self):
        up = UserProfile()
        up.password = "ThisIsAGoodPassword123"
        up.first_name = "Dane"
        up.last_name = "Urban"
        up.email = "danelegend13@examify.com"
        up.school_year = 12
        up.school_name = "Freshwater Senior Campus"

        # Check that all attributes of user_profile
        check_all_user_profile_attributes_filled(up)

        response = RegisterUser(up)

        self.check_successful_response(response)

    def test_2_users_all_same_but_email(self):
        up = UserProfile()
        up.password = "ThisIsAGoodPassword123"
        up.first_name = "Dane"
        up.last_name = "Urban"
        up.email = "danelegend13@examify.com"
        up.school_year = 12
        up.school_name = "Freshwater Senior Campus"

        response1 = RegisterUser(up)
        self.check_successful_response(response1)

        up.email = "hello@gmail.com"

        response2 = RegisterUser(up)
        self.check_successful_response(response2)

        assert response1["user_id"] != response2["user_id"]

    def test_5_users_no_same_user_id(self):
        password = "SuccessfulPassw0rd"
        first_name = "John"
        last_name = "Smith"

        up1 = UserProfile()
        up2 = UserProfile()
        up3 = UserProfile()
        up4 = UserProfile()
        up5 = UserProfile()

        up1.password = up2.password = up3.password = up4.password = up5.password = password
        up1.first_name = up2.first_name = up3.first_name = up4.first_name = up5.first_name = first_name
        up1.last_name = up2.last_name = up3.last_name = up4.last_name = up5.last_name = last_name

        up1.email = "test1@gmail.com"
        up2.email = "test2@gmail.com"
        up3.email = "test3@gmail.com"
        up4.email = "test4@gmail.com"
        up5.email = "test5@gmail.com"

        set = {}

        response1 = RegisterUser(up1)
        self.check_successful_response(response1)
        set[response1["user_id"]] = True

        response2 = RegisterUser(up2)
        self.check_successful_response(response2)
        set[response2["user_id"]] = True

        response3 = RegisterUser(up3)
        self.check_successful_response(response3)
        set[response3["user_id"]] = True

        response4 = RegisterUser(up4)
        self.check_successful_response(response4)
        set[response4["user_id"]] = True

        response5 = RegisterUser(up5)
        self.check_successful_response(response5)
        set[response5["user_id"]] = True

        assert len(set) == 5


@pytest.mark.django_db
class TestUserAlreadyExists:
    def test_2_users_same_everything(self):
        user1 = UserProfile()
        user1.password = "ThisIsAGoodPassword123"
        user1.first_name = "Dane"
        user1.last_name = "Urban"
        user1.email = "danelegend13@examify.com"

        user2 = user1

        response1 = RegisterUser(user1)

        # Check user1 registration ok
        assert response1["user_id"] > -1

        # Check user2 registration failure
        with pytest.raises(ValidationError):
            RegisterUser(user2)

    def test_2_users_same_email(self):
        user1 = UserProfile()
        user1.password = "ThisIsAGoodPassword123"
        user1.first_name = "Dane"
        user1.last_name = "Urban"
        user1.email = "danelegend13@examify.com"

        user2 = UserProfile()
        user2.password = "AV3ryD1ff3r3ntPa55w0rd"
        user2.first_name = "Hop"
        user2.last_name = "Muq"
        user2.email = user1.email

        response1 = RegisterUser(user1)

        # Check user1 registration ok
        assert response1["user_id"] > -1

        # Check user2 registration failure
        with pytest.raises(ValidationError):
            RegisterUser(user2)


class TestValidationIssues:
    def test_first_name_empty(self):
        user1 = UserProfile()
        user1.password = "GoodPassword15"
        user1.first_name = ""
        user1.last_name = "Urban"
        user1.email = "danelegend13@examify.com"

        with pytest.raises(ValidationError):
            RegisterUser(user1)

    def test_last_name_empty(self):
        user1 = UserProfile()
        user1.password = "GoodPassword15"
        user1.first_name = "Dane"
        user1.last_name = ""
        user1.email = "danelegend13@examify.com"

        with pytest.raises(ValidationError):
            RegisterUser(user1)

class TestUserPasswordInvalid:
    def test_password_length_7(self):
        user1 = UserProfile()
        user1.password = "BadPas1"
        user1.first_name = "Dane"
        user1.last_name = "Urban"
        user1.email = "danelegend13@examify.com"

        with pytest.raises(ValidationError):
            RegisterUser(user1)

    def test_password_no_upper(self):
        user1 = UserProfile()
        user1.password = "badpassword1"
        user1.first_name = "Dane"
        user1.last_name = "Urban"
        user1.email = "danelegend13@examify.com"

        with pytest.raises(ValidationError):
            RegisterUser(user1)

    def test_password_no_lower(self):
        user1 = UserProfile()
        user1.password = "BADPASSWORD1"
        user1.first_name = "Dane"
        user1.last_name = "Urban"
        user1.email = "danelegend13@examify.com"

        with pytest.raises(ValidationError):
            RegisterUser(user1)
        
    def test_password_no_number(self):
        user1 = UserProfile()
        user1.password = "BADPASsword"
        user1.first_name = "Dane"
        user1.last_name = "Urban"
        user1.email = "danelegend13@examify.com"

        with pytest.raises(ValidationError):
            RegisterUser(user1)


class TestUserEmailInvalid:
    def test_email_invalid_nothing_before_at(self):
        basic_user = UserProfile()
        basic_user.password = "ThisIsAGoodPassword123"
        basic_user.first_name = "Dane"
        basic_user.last_name = "Urban"
        basic_user.email = "@examify.com"

        with pytest.raises(ValidationError):
            RegisterUser(basic_user)

    def test_email_invalid_no_at(self):
        basic_user = UserProfile()
        basic_user.password = "ThisIsAGoodPassword123"
        basic_user.first_name = "Dane"
        basic_user.last_name = "Urban"
        basic_user.email = "daneexamify.com"

        with pytest.raises(ValidationError):
            RegisterUser(basic_user)

    def test_email_invalid_no_dot(self):
        basic_user = UserProfile()
        basic_user.password = "ThisIsAGoodPassword123"
        basic_user.first_name = "Dane"
        basic_user.last_name = "Urban"
        basic_user.email = "dane@examifycom"

        with pytest.raises(ValidationError):
            RegisterUser(basic_user)

    def test_email_invalid_no_suffix(self):
        basic_user = UserProfile()
        basic_user.password = "ThisIsAGoodPassword123"
        basic_user.first_name = "Dane"
        basic_user.last_name = "Urban"
        basic_user.email = "dane@examify."

        with pytest.raises(ValidationError):
            RegisterUser(basic_user)

    def test_email_invalid_only_prefix_and_at(self):
        basic_user = UserProfile()
        basic_user.password = "ThisIsAGoodPassword123"
        basic_user.first_name = "Dane"
        basic_user.last_name = "Urban"
        basic_user.email = "dane@"

        with pytest.raises(ValidationError):
            RegisterUser(basic_user)

    def test_email_invalid_only_prefix_and_at_and_dot(self):
        basic_user = UserProfile()
        basic_user.password = "ThisIsAGoodPassword123"
        basic_user.first_name = "Dane"
        basic_user.last_name = "Urban"
        basic_user.email = "dane@."

        with pytest.raises(ValidationError):
            RegisterUser(basic_user)

    def test_email_invalid_no_domain(self):
        basic_user = UserProfile()
        basic_user.password = "ThisIsAGoodPassword123"
        basic_user.first_name = "Dane"
        basic_user.last_name = "Urban"
        basic_user.email = "dane@.com"

        with pytest.raises(ValidationError):
            RegisterUser(basic_user)

