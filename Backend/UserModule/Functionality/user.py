from UserModule.Functionality.UserProfile import UserProfile

from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout

from UserModule.models import UserProfile

def RegisterUser(user_profile: UserProfile):
    """
    Attempts to register a user given the provided details

    This function will insert the users details in the database
    
    Paramaters:
     - user_profile: A profile consisting of the user's details

    Return:
     - user_id: The id for the user. This is determined by their user primary key

    Error:
     - Returned id is -1 implies failure
     - Validation error could be thrown
    """
    REGISTRATION_MESSAGE = {
        "user_id": -1,
        "message": ""
    }

    # Validate the user profile
    if not user_profile.ValidateProfile():
        REGISTRATION_MESSAGE["message"] = "User registration form incorrect"
        return REGISTRATION_MESSAGE
    
    # Create a new user
    user_record = User.objects.create_user(user_profile.first_name, user_profile.email, user_profile.password)

    user_record.last_name = user_profile.last_name

    user_record.save() 

    # Create a new UserProfile
    user_profile_record = UserProfile.objects.create(user=user_record, school_year=user_profile.school_year, school_name=user_profile.school_name)

    user_profile_record.full_clean()
    user_profile_record.save()

    REGISTRATION_MESSAGE["user_id"] = user_record.pk
    REGISTRATION_MESSAGE["message"] = "User registration successful"

    return REGISTRATION_MESSAGE


def LoginUser(email, password, request):
    """
    Attempts to login the user given the provided username and password

    Parameters:
     - username: The username for the account to login to
    """
    LOGIN_MESSAGE = {
        "user_id": -1,
        "message": ""
    }

    user = authenticate(email=email, password=password)

    if user is None:
        LOGIN_MESSAGE["message"] = "Incorrect email or password"

        return LOGIN_MESSAGE

    login(request, user)

    # Otherwise user is authenticated
    LOGIN_MESSAGE["user_id"] = user.id
    LOGIN_MESSAGE["message"] = "Login Successful"

    return LOGIN_MESSAGE


def LogoutUser(request):
    logout(request)


def AddFavourite(user_id, exam_id):
    pass

