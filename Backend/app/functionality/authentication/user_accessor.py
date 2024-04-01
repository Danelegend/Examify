from django.contrib.auth.models import User

from app.errors import AuthenticationError, ValidationError
from app.models import UserProfile

def authenticate(email: str, password: str, method: str = "email") -> UserProfile:
    """
    We want to get a user given an email and password

    method is one of "email", "google", or "facebook"
    """
    if method != "email" and method != "google" and method != "facebook":
        raise ValueError("Invalid method")
    
    # Get the user with such email
    user = User.objects.get(email=email)

    # Get the corresponding user profile
    user_profile = UserProfile.objects.get(user=user)

    # Check that the method aligns with the user's authentication method
    if user_profile.registeration_method != method:
        raise ValidationError("Invalid method")
    
    # If registration method is password, check the password matches
    if method == "email":
        if not user.check_password(password):
            raise AuthenticationError("Invalid password")
        
    return user_profile

def userprofile_from_email(email: str) -> UserProfile:
    """
    Get a user profile from an email
    """
    user = User.objects.get(email=email)

    return UserProfile.objects.get(user=user)

def user_exists_with_email(email: str) -> bool:
    """
    Check if a user exists with a given email
    """
    return User.objects.filter(email=email).exists()

def user_registeration_method(email: str) -> str:
    """
    Get the registeration method for a user
    """
    user = User.objects.get(email=email)

    return UserProfile.objects.get(user=user).registeration_method