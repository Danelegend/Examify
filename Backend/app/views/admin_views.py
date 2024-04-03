import json

from django.http import JsonResponse

from rest_framework.response import Response
from rest_framework.decorators import api_view

from app.errors import AuthenticationError
from app.functionality.admin.admin import DeleteExam, GetCurrentExams, GetExamsToReview, SubmitExam, ValidateToken
from app.views.util import get_access_token

def TokenValidation(token: str):
    try:
        ValidateToken(token)
    except AuthenticationError as ae:
        return JsonResponse({"message": ae.message}, status=403)

@api_view(['GET'])
def CurrentExamsEndpoint(request):
    token = get_access_token(request)
    
    TokenValidation(token)

    try:
        exams = GetCurrentExams()

        return JsonResponse({
            "exams": exams
        }, status=200)
    except AuthenticationError as e:
        return JsonResponse({"message": e.message}, status=403)

@api_view(['GET'])
def ReviewExamsEndpoint(request):
    token = get_access_token(request)

    TokenValidation(token)

    try:
        exams = GetExamsToReview()

        return JsonResponse({
            "exams": exams
        }, status=200)
    except AuthenticationError as e:
        return JsonResponse({"message": e.message}, status=403)

@api_view(['POST'])
def SubmitExamEndpoint(request):
    token = get_access_token(request)

    TokenValidation(token)

    body_unicode = request.body.decode('utf-8')
    body = json.loads(body_unicode)

    school = body["school_name"]
    exam_type = body["exam_type"]
    year = body["year"]
    subject = body["subject"]
    file_location = body["file_location"]

    try:
        SubmitExam(school, exam_type, year, subject, file_location)

        return Response(status=200)
    except Exception as e:
        print(str(e))
        return Response(status=500)

@api_view(['DELETE'])
def DeleteExamEndpoint(request):
    token = get_access_token(request)

    TokenValidation(token)

    body_unicode = request.body.decode('utf-8')
    body = json.loads(body_unicode)

    file_location = body["file_location"]

    try:
        DeleteExam(file_location)

        return Response(status=200)
    except Exception as e:
        print(str(e))
        return Response(status=500)