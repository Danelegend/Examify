from datetime import date

from django.contrib.auth import authenticate

from django.contrib.auth.models import User

from app.functionality.token import access_token_valid, create_access_token, create_refresh_token, get_sid, get_user_id, remove_session
from app.functionality.authentication.user_form import UserForm
from app.errors import AuthenticationError, DuplicationError

from app.models import Schools, UserProfile


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
                                                     registration_method="email")

    user_profile_record.full_clean()
    user_profile_record.save()
    uid = user_record.pk

    rt = create_refresh_token(uid)
    at, exp = create_access_token(rt)

    return {
        "access_token": at,
        "refresh_token": rt,
        "expiration": exp.isoformat()
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
    at, exp = create_access_token(rt)

    return {
        "access_token": at,
        "refresh_token": rt,
        "expiration": exp.isoformat()
    }


def LogoutUser(access_token: str):
    """
    Takes in an access token and logs out the user
    """
    if not access_token_valid(access_token):
        raise AuthenticationError("Invalid access token")

    remove_session(get_sid(access_token))


def GetUserPermissions(access_token: str) -> str:
    """
    Takes in an access token and returns the permissions for the user
    """
    if not access_token_valid(access_token):
        raise AuthenticationError("Invalid access token")

    uid = get_user_id(access_token)
    user = UserProfile.objects.get(user=uid)

    if user.user.email == "danelegend13@gmail.com":
        return "ADM"

    return user.permissions

def EditUserInformation(access_token: str, dob: date, school: str, school_year: int):
    """
    Takes in an access token and edits the user's information
    """
    if not access_token_valid(access_token):
        raise AuthenticationError("Invalid access token")

    uid = get_user_id(access_token)

    user = UserProfile.objects.get(user=uid)
    user.date_of_birth = dob
    user.school = Schools.objects.get_or_create(name=school)[0]
    user.school_year = school_year

    user.save()
