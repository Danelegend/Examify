from UserModule.Functionality.UserProfile import UserProfile
from UserModule.Functionality.errors import ValidationError

from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout

from rest_framework.authtoken.models import Token

from UserModule.models import UserProfile
    
def RegisterUser(user_profile: UserProfile):
    """
    Attempts to register a user given the provided details

    This function will insert the users details in the database
    
    Paramaters:
     - user_profile: A profile consisting of the user's details

    Return:
     - user_id: The id for the user. This is determined by their user primary key
     - token: Responsible for the session management for the user
     - message: Details possible error cases in registration
     
    Error:
     - Returned id is -1 implies failure
     - Validation error could be thrown
    """

    def clean_email(email: str):
        if User.objects.filter(email=email).exists():
            raise ValidationError("User with email already exists")

    REGISTRATION_MESSAGE = {
        "error": True
    }

    # Validate the user profile
    user_profile.ValidateProfile()
    
    # Check if user already exists
    clean_email(user_profile.email)

    # Create a new user
    user_record = User.objects.create_user(user_profile.email, first_name=user_profile.first_name, email=user_profile.email, password=user_profile.password)

    user_record.last_name = user_profile.last_name

    user_record.save() 

    # Create a new UserProfile
    user_profile_record = UserProfile.objects.create(user=user_record, school_year=user_profile.school_year, school_name=user_profile.school_name)

    user_profile_record.full_clean()
    user_profile_record.save()

    token = Token.objects.create(user=user_record)

    REGISTRATION_MESSAGE["user_id"] = user_record.pk
    REGISTRATION_MESSAGE["message"] = "User registration successful"
    REGISTRATION_MESSAGE["token"] = token
    REGISTRATION_MESSAGE["error"] = False

    return REGISTRATION_MESSAGE


def LoginUser(email, password):
    """
    Attempts to login the user given the provided username and password

    Parameters:
     - username: The username for the account to login to
    """
    LOGIN_MESSAGE = {
        "error": True
    }

    user = authenticate(username=email, password=password)

    if user is None:
        LOGIN_MESSAGE["message"] = "Incorrect email or password"

        return LOGIN_MESSAGE

    token, created = Token.objects.get_or_create(user=user)

    # Otherwise user is authenticated
    LOGIN_MESSAGE["user_id"] = user.pk
    LOGIN_MESSAGE["message"] = "Login Successful"
    LOGIN_MESSAGE["token"] = token.key

    return LOGIN_MESSAGE


def LogoutUser(request):
    logout(request)


def AddFavourite(user_id, exam_id):
    pass

