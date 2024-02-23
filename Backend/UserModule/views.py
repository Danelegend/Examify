import json

from django.http import HttpResponse

from UserModule.Functionality.UserProfile import UserProfile
from UserModule.Functionality.user import RegisterUser, LoginUser, LogoutUser
from django.views.decorators.csrf import csrf_exempt

@csrf_exempt 
def LoginEndpoint(request):
    body_unicode = request.body.decode('utf-8')
    body = json.loads(body_unicode)

    email = body["email"]
    password = body["password"]

    response = LoginUser(email, password, request)
    
    return HttpResponse(json.dumps(response), content_type='application/json')


def RegisterEndpoint(request):
    body_unicode = request.body.decode('utf-8')
    body = json.loads(body_unicode)

    up = UserProfile()

    up.password = body["password"]
    up.first_name = body["first_name"]
    up.last_name = body["last_name"]
    up.email = body["email"]
    up.school_year = body["school_year"]
    up.school_name = body["school"]

    response = RegisterUser(up)

    return HttpResponse(json.dumps(response), content_type="application/json")


def LogoutEndpoint(request):
    LogoutUser(request)

