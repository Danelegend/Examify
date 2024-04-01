import datetime
import os
import secrets
import string
import jwt

from app.errors import AuthenticationError
from app.models import Sessions

def generate_random_string(length: int) -> str:
    """
    Generates a random string given a length
    """
    return ''.join(secrets.choice(string.ascii_uppercase + string.ascii_lowercase) for _ in range(length))
    
def create_refresh_token(uid: int) -> str:
    """
    A function to create a refresh token for a user

    Args:
     - uid: The user id of an account

    Returns: The refresh token
    """
    rid = generate_random_string(10)

    session = Sessions.objects.create(refresh_id=rid, user_id=uid)

    sid = session.session_id
    
    session.save()

    payload = {
        'exp': datetime.datetime.now(tz=datetime.timezone.utc) + \
            datetime.timedelta(days=float(os.environ["REFRESH_TOKEN_EXPIRY_DAYS"])),
        'iat': datetime.datetime.now(tz=datetime.timezone.utc),
        'sid': sid,
        'rid': rid
    }

    encoded_token = jwt.encode(
        payload,
        os.environ["REFRESH_TOKEN_SECRET"],
        algorithm='HS256',
    )

    return encoded_token

def create_access_token(refresh_token: str) -> str:
    """
    A function to create an access token for a user

    Args:
     - refresh_token: The refresh token of the user

    Returns: The access token
    """
    payload = decrypt_refresh_token(refresh_token)

    # Check if the sid is valid
    sid = payload['sid']

    if not Sessions.objects.filter(session_id=sid).exists():
        raise AuthenticationError("Session does not exist")

    new_payload = {
        'exp': datetime.datetime.now(tz=datetime.timezone.utc) + \
            datetime.timedelta(days=0, minutes=float(os.environ["ACCESS_TOKEN_EXPIRY_MINUTES"])),
        'iat': datetime.datetime.now(tz=datetime.timezone.utc),
        'sid': sid,
        'aid': generate_random_string(10)
    }

    return jwt.encode(
        new_payload,
        os.environ["ACCESS_TOKEN_SECRET"],
        algorithm='HS256'
    )

def access_token_valid(access_token: str) -> bool:
    """
    A function to check if an access token is valid

    Args:
     - access_token: The access token to check

    Returns: True if the access token is valid, False otherwise
    """
    try:
        decoded = decrypt_access_token(access_token)

        sid = decoded['sid']

        return Sessions.objects.filter(session_id=sid).exists()
    except Exception:
        return False

def refresh_token_valid(refresh_token: str) -> bool:
    """
    A function to check if a refresh token is valid

    Args:
     - refresh_token: The refresh token to check

    Returns: True if the refresh token is valid, False otherwise
    """
    try:
        decoded = decrypt_refresh_token(refresh_token)
        
        sid = decoded['sid']

        return Sessions.objects.filter(session_id=sid).exists()
    except Exception:
        return False

def get_sid(access_token: str) -> int:
    """
    Given an access token, gets us the session id
    """

    # Unpack the session id from the refresh token
    payload = decrypt_access_token(access_token)
    return payload['sid']

def remove_session(sid: int):
    """
    A function to remove a session given a session id
    """
    Sessions.objects.filter(session_id=sid).delete()

def get_user_id(access_token: str) -> int:
    """
    Given a access token, gets us the user id
    """
    user = get_user(access_token)

    return user.pk

def get_user(access_token: str):
    """
    Given an access token, gets us the user
    """
    sid = get_sid(access_token)

    return Sessions.objects.filter(session_id=sid).first().user

def decrypt_access_token(access_token: str) -> dict:
    """
    A function to decrypt an access token

    Args:
     - access_token: The access token to decrypt

    Returns: The decrypted access token
    """
    try:
        return jwt.decode(access_token, os.environ["ACCESS_TOKEN_SECRET"], algorithms=['HS256'])
    except Exception as e:
        raise AuthenticationError("Invalid access token") from e

def decrypt_refresh_token(refresh_token: str) -> dict:
    """
    A function to decrypt a refresh token

    Args:
     - refresh_token: The refresh token to decrypt

    Returns: The decrypted refresh token
    """
    try:
        return jwt.decode(refresh_token, os.environ["REFRESH_TOKEN_SECRET"], algorithms=['HS256'])
    except Exception as e:
        raise AuthenticationError("Invalid refresh token") from e
