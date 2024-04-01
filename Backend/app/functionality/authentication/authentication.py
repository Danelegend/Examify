from django.contrib.auth import authenticate

from django.contrib.auth.models import User

from app.functionality.token import access_token_valid, create_access_token, create_refresh_token, get_sid, remove_session
from app.functionality.authentication.user_form import UserForm
from app.errors import AuthenticationError, DuplicationError

from app.models import UserProfile


def RegisterUser(user_profile: UserForm):
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
            raise DuplicationError("User with email already exists")

    # Validate the user profile
    user_profile.ValidateProfile()
    
    # Check if user already exists
    clean_email(user_profile.email)

    # Create a new user
    user_record = User.objects.create_user(user_profile.email, first_name=user_profile.first_name, email=user_profile.email, password=user_profile.password, last_name = user_profile.last_name)

    user_record.save() 

    # Create a new UserProfile
    user_profile_record = UserProfile.objects.create(user=user_record, 
                                                     school_year=user_profile.school_year, 
                                                     school_name=user_profile.school_name,
                                                     registration_method="email")

    user_profile_record.full_clean()
    user_profile_record.save()
    uid = user_record.pk

    rt = create_refresh_token(uid)
    at = create_access_token(rt)

    return {
        "access_token": at,
        "refresh_token": rt,
    }


def LoginUser(email, password):
    """
    Attempts to login the user given the provided username and password

    Parameters:
     - username: The username for the account to login to
    """
    user = authenticate(username=email, password=password)

    if user is None:
        raise AuthenticationError("Invalid username or password")

    rt = create_refresh_token(user.pk)
    at = create_access_token(rt)

    return {
        "access_token": at,
        "refresh_token": rt,
    }


def LogoutUser(access_token: str):
    """
    Takes in an access token and logs out the user
    """
    if not access_token_valid(access_token):
        raise AuthenticationError("Invalid access token")

    remove_session(get_sid(access_token))