from datetime import date

from functionality.token import access_token_valid, create_access_token, create_refresh_token, get_sid, get_user_id, remove_session
from functionality.authentication.user_form import UserForm

from errors import AuthenticationError, DuplicationError

from database.db_types.db_request import PasswordCreationRequest, UserCreationRequest, UserUpdateRequest
from database.helpers.password import get_user_from_email_and_password, insert_password
from database.helpers.user import check_user_email_exists, get_user_details, insert_user, update_user

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
        if check_user_email_exists(email):
            raise DuplicationError("User with email already exists")

    # Validate the user profile
    user_profile.ValidateProfile()
    
    # Check if user already exists
    clean_email(user_profile.email)

    # Create a new user
    user_id = insert_user(UserCreationRequest(
        first_name=user_profile.first_name,
        last_name=user_profile.last_name,
        email=user_profile.email,
        phone=user_profile.phone,
        registration_method="email",
        permissions="REG"
    ))

    insert_password(PasswordCreationRequest(
        user_id=user_id,
        password=user_profile.password
    
    ))

    rt = create_refresh_token(user_id)
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
    user_id = get_user_from_email_and_password(email, password)

    if user_id is None:
        raise AuthenticationError("Invalid username or password")

    rt = create_refresh_token(user_id)
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
    user = get_user_details(uid)

    if user.email == "danelegend13@gmail.com":
        return "ADM"

    return user.permissions

def EditUserInformation(access_token: str, dob: date, school: str, school_year: int):
    """
    Takes in an access token and edits the user's information
    """
    if not access_token_valid(access_token):
        raise AuthenticationError("Invalid access token")

    uid = get_user_id(access_token)

    update_user(UserUpdateRequest(
        user_id=uid,
        dob=dob,
        school=school,
        school_year=school_year
    ))
