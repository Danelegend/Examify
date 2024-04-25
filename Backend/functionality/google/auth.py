from google.auth.transport import requests

from database.db_types.db_request import UserCreationRequest
from database.helpers.user import get_user_by_email_and_registration, insert_user

from errors import AuthenticationError, ValidationError

from functionality.token import create_access_token, create_refresh_token
from functionality.authentication.user_accessor import user_exists_with_email

import requests

CLIENT_ID = "623177653931-inec93uqarv00qs0gvtdd1lrvbekic62.apps.googleusercontent.com"
CLIENT_SECRET = "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"

def login_google_token(google_token: str):
    data = {
        'code': google_token,
        'client_id': CLIENT_ID, # client ID
        'client_secret': CLIENT_SECRET, # client secret
        'redirect_uri': 'postmessage',
        'grant_type': 'authorization_code'
    }

    response = requests.post('https://oauth2.googleapis.com/token', data=data)

    access_token = response.json()['access_token']

    response2 = requests.get("https://www.googleapis.com/oauth2/v2/userinfo?access_token=" + access_token)

    email = response2.json()['email']
    given_name = response2.json()['given_name']
    family_name = response2.json()['family_name']

    try:
        if not user_exists_with_email(email):
            return register_third_party_profile(email, given_name, family_name, "google")
        return login_third_party_profile(email, "google")
    except ValueError as e:
        print(e)
        raise ValidationError("Invalid token") from e
    except Exception as e:
        print(e)
        raise AuthenticationError("Invalid token") from e

def login_facebook_token(facebook_token: str):
    response = requests.get("https://graph.facebook.com/v11.0/me?fields=email,first_name,last_name&access_token=" + facebook_token)
    
    email = response.json()['email']
    first_name = response.json()['first_name']
    last_name = response.json()['last_name']

    try:
        if not user_exists_with_email(email):
            return register_third_party_profile(email, first_name, last_name, "facebook")
        return login_third_party_profile(email, "facebook")
    except ValueError as e:
        print(e)
        raise ValidationError("Invalid token") from e
    except Exception as e:
        print(e)
        raise AuthenticationError("Invalid token") from e

def register_third_party_profile(email: str, first_name: str, last_name: str, registration_method: str):
    if user_exists_with_email(email):
            raise ValidationError("User with email already exists")
    
    user_id = insert_user(UserCreationRequest(
        first_name=first_name,
        last_name=last_name,
        email=email,
        registration_method=registration_method,
        permissions="REG"
    
    ))

    rt = create_refresh_token(user_id)
    at, exp = create_access_token(rt)

    return {
        "access_token": at,
        "refresh_token": rt,
        "expiration": exp.isoformat()
    }

def login_third_party_profile(email: str, registration_method: str):
    if not user_exists_with_email(email):
        raise ValidationError("User with email does not exist")
    
    user_id = get_user_by_email_and_registration(email, registration_method)

    if user_id is None:
        raise ValidationError("User is not registered with this method")

    rt = create_refresh_token(user_id)
    at, exp = create_access_token(rt)

    return {
        "access_token": at,
        "refresh_token": rt,
        "expiration": exp.isoformat()
    }
