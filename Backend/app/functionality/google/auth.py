from google.oauth2 import id_token
from google.auth.transport import requests

from django.contrib.auth.models import User

from app.functionality.token import create_access_token, create_refresh_token
from app.errors import AuthenticationError, ValidationError
from app.functionality.authentication.user_accessor import user_exists_with_email

from app.models import UserProfile

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
    
    user_record = User.objects.create_user(email, first_name=first_name, email=email, last_name=last_name)
    user_record.save()

    user_profile_record = UserProfile.objects.create(user=user_record,
                                                     registration_method=registration_method)
        
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

def login_third_party_profile(email: str, registration_method: str):
    if not user_exists_with_email(email):
        raise ValidationError("User with email does not exist")
    
    user_record = User.objects.get(email=email)
    user_profile_record = UserProfile.objects.get(user=user_record)

    if user_profile_record.registration_method != registration_method:
        raise ValidationError("User is not registered with this method")

    uid = user_record.pk

    rt = create_refresh_token(uid)
    at, exp = create_access_token(rt)

    return {
        "access_token": at,
        "refresh_token": rt,
        "expiration": exp.isoformat()
    }
