import json
import os

from django.http import JsonResponse

from rest_framework.decorators import api_view
from rest_framework.response import Response

from app.functionality.google.auth import login_facebook_token, login_google_token
from app.errors import AuthenticationError, DuplicationError, ValidationError
from app.functionality.authentication.authentication import EditUserInformation, GetUserPermissions, LoginUser, LogoutUser, RegisterUser
from app.functionality.authentication.user_form import UserForm
from app.functionality.token import create_access_token
from app.views.util import get_access_token

# Create your views here.
@api_view(['POST'])
def LoginEndpoint(request):
    body_unicode = request.body.decode('utf-8')
    body = json.loads(body_unicode)

    email = body["email"]
    password = body["password"]

    try:
        login_resp = LoginUser(email, password)

        response = JsonResponse({
            "access_token": login_resp["access_token"],
            "expiration": login_resp["expiration"]
        }, status=200)

        response.set_cookie(os.environ["REFRESH_TOKEN_COOKIE_KEY"], login_resp["refresh_token"], 
                            max_age=int(60 * 60 * 24 * float(os.environ["REFRESH_TOKEN_EXPIRY_DAYS"])),
                            secure=False, httponly=True, samesite="none")

        return response
    except AuthenticationError:
        return JsonResponse({
            "message": "User name or password is incorrect"
        }, status=403)

@api_view(['POST'])
def RegisterEndpoint(request):
    body_unicode = request.body.decode('utf-8')
    body = json.loads(body_unicode)

    up = UserForm()

    up.password = body["password"]
    up.first_name = body["first_name"]
    up.last_name = body["last_name"]
    up.email = body["email"]

    try:
        registration_result = RegisterUser(up)

        response = JsonResponse({
            "access_token": registration_result["access_token"]
        }, status=200)

        response.set_cookie(os.environ["REFRESH_TOKEN_COOKIE_KEY"], registration_result["refresh_token"])
    
        return response
    except ValidationError as v:
        return JsonResponse({
            "message": v.message
        }, status=400)
    except DuplicationError as d:
        return JsonResponse({
            "message": d.message
        }, status=400)

@api_view(['DELETE'])
def LogoutEndpoint(request):
    token = get_access_token(request)

    try:
        LogoutUser(token)

        return Response(status=200)
    except AuthenticationError as e:
        return JsonResponse({"message": e.message}, status=403)

@api_view(['GET'])
def RefreshEndpoint(request):
    try:
        # Get the refresh token from the request
        if os.environ["REFRESH_TOKEN_COOKIE_KEY"] not in request.COOKIES:
            return JsonResponse({"message": "No refresh token found"}, status=403)

        refresh_token = request.COOKIES[os.environ["REFRESH_TOKEN_COOKIE_KEY"]]

        access_token = create_access_token(refresh_token)

        return JsonResponse({"access_token": access_token}, status=200)
    except AuthenticationError as a:
        return JsonResponse({"message": a.message}, status=403)
    except:
        return JsonResponse({"message": "An error occurred"}, status=500)

@api_view(['POST'])
def LoginGoogleEndpoint(request):
    google_token = request.data["google_token"]

    try:
        login_resp = login_google_token(google_token)

        response = JsonResponse({
            "access_token": login_resp["access_token"]
        }, status=200)

        response.set_cookie(os.environ["REFRESH_TOKEN_COOKIE_KEY"], login_resp["refresh_token"], 
                            max_age=int(60 * 60 * 24 * float(os.environ["REFRESH_TOKEN_EXPIRY_DAYS"])),
                            secure=False, httponly=True, samesite="none")

        return response
    except ValidationError as v:
        return JsonResponse({"message": v.message}, status=400)
    except Exception as e:
        print(e)
        return JsonResponse({"message": "An error occurred"}, status=500)

@api_view(['POST'])
def LoginFacebookEndpoint(request):
    facebook_token = request.data["facebook_token"]

    try:
        login_resp = login_facebook_token(facebook_token)

        response = JsonResponse({
            "access_token": login_resp["access_token"]
        }, status=200)

        response.set_cookie(os.environ["REFRESH_TOKEN_COOKIE_KEY"], login_resp["refresh_token"], 
                            max_age=int(60 * 60 * 24 * float(os.environ["REFRESH_TOKEN_EXPIRY_DAYS"])),
                            secure=False, httponly=True, samesite="none")

        return response
    except ValidationError as v:
        return JsonResponse({"message": v.message}, status=400)
    except Exception as e:
        print(e)
        return JsonResponse({"message": "An error occurred"}, status=500)
    
@api_view(['GET'])
def UserPermissionsEndpoint(request):
    token = get_access_token(request)

    try:
        perm = GetUserPermissions(token)

        return JsonResponse({
            "permissions": perm
        }, status=200)
    except AuthenticationError as e:
        return JsonResponse({"message": e.message}, status=403)

@api_view(['PUT'])
def EditUserInformationEndpoint(request):
    token = get_access_token(request)

    body_unicode = request.body.decode('utf-8')
    body = json.loads(body_unicode)

    dob = body["dob"]
    school = body["school"]
    school_year = body["school_year"]

    try:
        EditUserInformation(token, dob, school, school_year)

        return Response(status=200)
    except Exception as e:
        return Response(status=500)
