import jwt
import os

from typing import Annotated
from fastapi import APIRouter, HTTPException, Request, Response, Security, status

from errors import AuthenticationError, DuplicationError, ValidationError

from functionality.authentication.user_form import UserForm
from functionality.token import create_access_token, get_sid_from_refresh_token, refresh_token_valid
from functionality.authentication.authentication import EditUserInformation, GetUserPermissions, LoginUser, LogoutUser, RegisterUser
from functionality.google.auth import login_facebook_token, login_google_token

from router import HTTPBearer401
from router.api_types.api_request import EditUserInformationRequest, FacebookLoginRequest, GoogleLoginRequest, LoginRequest, RegistrationRequest
from router.api_types.api_response import LoginResponse, RefreshResponse, RegistrationResponse, UserPermissionsResponse

router = APIRouter()

@router.post("/login", status_code=status.HTTP_200_OK, response_model=LoginResponse)
async def login_user(response: Response, login_request: LoginRequest) -> LoginResponse:
    login_resp = LoginUser(login_request.email, login_request.password)

    response.set_cookie(
        key=os.environ.get("REFRESH_TOKEN_COOKIE_KEY", "refresh_token"),
        value=login_resp["refresh_token"],
        httponly=True,
        max_age=int(60 * 60 * 24 * float(os.environ.get("REFRESH_TOKEN_EXPIRATION_DAYS", 7)))
    )

    return LoginResponse(
        access_token=login_resp["access_token"], 
        expiration=login_resp["expiration"]
    )

@router.post("/register", status_code=status.HTTP_200_OK, response_model=RegistrationResponse)
async def register_user(response: Response, register_request: RegistrationRequest) -> RegistrationResponse:
    user_form = UserForm()
    
    user_form.password = register_request.password
    user_form.first_name = register_request.first_name
    user_form.last_name = register_request.last_name
    user_form.email = register_request.email

    try:
        registration_result = RegisterUser(user_form)

        response.set_cookie(
            key=os.environ.get("REFRESH_TOKEN_COOKIE_KEY", "refresh_token"),
            value=registration_result["refresh_token"],
            httponly=True,
            max_age=int(60 * 60 * 24 * float(os.environ.get("REFRESH_TOKEN_EXPIRATION_DAYS", 7)))
        )

        return RegistrationResponse(
            access_token=registration_result["access_token"],
            expiration=registration_result["expiration"]
        )
    except ValidationError as v:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=v.message) from v
    except DuplicationError as d:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=d.message) from d

@router.delete("/logout", status_code=status.HTTP_200_OK)
async def logout(response: Response, token: Annotated[str, Security(HTTPBearer401())]) -> None:
    try:
        LogoutUser(token)

        response.delete_cookie(os.environ.get("REFRESH_TOKEN_COOKIE_KEY", "refresh_token"))
    except AuthenticationError as e:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=e.message) from e
    
@router.get("/refresh", status_code=status.HTTP_200_OK)
async def refresh(request: Request, response: Response) -> RefreshResponse:
    refresh_token = request.cookies.get(os.environ.get("REFRESH_TOKEN_COOKIE_KEY", "refresh_token"))

    try:
        if not refresh_token or not refresh_token_valid(refresh_token):
            raise AuthenticationError("Invalid refresh token")

        sid = get_sid_from_refresh_token(refresh_token)

        new_access_token, exp = create_access_token(sid)

        return RefreshResponse(
            access_token=new_access_token,
            expiration=exp
        )
    except (ValueError, AuthenticationError, jwt.exceptions.PyJWTError) as e:
        response.delete_cookie(os.environ.get("REFRESH_TOKEN_COOKIE_KEY", "refresh_token"))
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=str(e),
            headers={"set-cookie": response.headers["set-cookie"]}
        ) from e
    
@router.post("/login/google", status_code=status.HTTP_200_OK, response_model=LoginResponse)
async def login_google(response: Response, google_login: GoogleLoginRequest) -> LoginResponse:
    try:
        login_resp = login_google_token(google_login.google_token)

        response.set_cookie(
            key=os.environ.get("REFRESH_TOKEN_COOKIE_KEY", "refresh_token"),
            value=login_resp["refresh_token"],
            httponly=True,
            max_age=int(60 * 60 * 24 * float(os.environ.get("REFRESH_TOKEN_EXPIRATION_DAYS", 7)))
        )

        return LoginResponse(
            access_token=login_resp["access_token"], 
            expiration=login_resp["expiration"]
        )
    except ValidationError as v:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=v.message) from v
    except Exception as e:
        print(e)
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e)) from e

@router.post("/login/facebook", status_code=status.HTTP_200_OK, response_model=LoginResponse)
async def login_facebook(response: Response, facebook_login: FacebookLoginRequest) -> LoginResponse:
    try:
        login_resp = login_facebook_token(facebook_login.facebook_token)

        response.set_cookie(
            key=os.environ.get("REFRESH_TOKEN_COOKIE_KEY", "refresh_token"),
            value=login_resp["refresh_token"],
            httponly=True,
            max_age=int(60 * 60 * 24 * float(os.environ.get("REFRESH_TOKEN_EXPIRATION_DAYS", 7)))
        )

        return LoginResponse(
            access_token=login_resp["access_token"], 
            expiration=login_resp["expiration"]
        )
    except ValidationError as v:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=v.message) from v
    except Exception as e:
        print(e)
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e)) from e

@router.get("/permissions", status_code=status.HTTP_200_OK, response_model=UserPermissionsResponse)
async def get_permissions(token: Annotated[str, Security(HTTPBearer401())]) -> UserPermissionsResponse:
    try:
        permissions = GetUserPermissions(token)

        return UserPermissionsResponse(permissions=permissions)
    except AuthenticationError as e:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=e.message) from e

@router.put("/profile", status_code=status.HTTP_200_OK)
async def edit_profile(edit_profile: EditUserInformationRequest, token: Annotated[str, Security(HTTPBearer401())]) -> None:
    try:
        EditUserInformation(token, 
                            edit_profile.dob, 
                            edit_profile.school, 
                            edit_profile.school_year)
    except AuthenticationError as e:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=e.message) from e