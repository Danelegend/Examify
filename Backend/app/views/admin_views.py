import json

from django.http import JsonResponse

from rest_framework.response import Response
from rest_framework.decorators import api_view

from app.functionality.authentication.authentication import GetUserPermissions
from app.errors import AuthenticationError
from app.functionality.admin.admin import DeleteCurrentExam, DeleteReviewExam, GetCurrentExams, GetExamsToReview, SubmitReviewExam, UploadExam, ValidateToken
from app.views.util import get_access_token

def TokenValidation(token: str):
    ValidateToken(token)
    if GetUserPermissions(token) != "ADM":
        raise AuthenticationError("User is not an admin")

@api_view(['GET'])
def CurrentExamsEndpoint(request):
    token = get_access_token(request)

    try:
        TokenValidation(token)

        exams = GetCurrentExams()

        return JsonResponse({
            "exams": exams
        }, status=200)
    except AuthenticationError as e:
        return JsonResponse({"message": e.message}, status=403)

@api_view(['GET'])
def ReviewExamsEndpoint(request):
    token = get_access_token(request)

    try:
        TokenValidation(token)

        exams = GetExamsToReview()

        return JsonResponse({
            "exams": exams
        }, status=200)
    except AuthenticationError as e:
        return JsonResponse({"message": e.message}, status=403)

@api_view(['POST'])
def SubmitReviewExamEndpoint(request):
    token = get_access_token(request)

    body_unicode = request.body.decode('utf-8')
    body = json.loads(body_unicode)

    school = body["school_name"]
    exam_type = body["exam_type"]
    year = body["year"]
    subject = body["subject"]
    file_location = body["file_location"]

    try:
        TokenValidation(token)

        SubmitReviewExam(school, exam_type, year, subject, file_location)

        return Response(status=200)
    except Exception as e:
        print(e)
        return Response(status=500)

@api_view(['DELETE'])
def DeleteReviewExamEndpoint(request):
    token = get_access_token(request)

    body_unicode = request.body.decode('utf-8')
    body = json.loads(body_unicode)

    file_location = body["file_location"]

    try:
        TokenValidation(token)

        DeleteReviewExam(file_location)

        return Response(status=200)
    except Exception as e:
        print(str(e))
        return Response(status=500)
    
@api_view(['DELETE'])
def DeleteCurrentExamEndpoint(request, exam_id: int):
    token = get_access_token(request)

    try:
        TokenValidation(token)

        DeleteCurrentExam(exam_id)

        return Response(status=200)
    except Exception as e:
        print(str(e))
        return Response(status=500)
    
@api_view(['POST'])
def UploadExamEndpoint(request):
    school = request.POST["school"]
    year = request.POST["year"]
    exam_type = request.POST["type"]
    subject = request.POST["subject"]
    file = request.FILES["file"]

    try:
        UploadExam(school, year, exam_type, subject, file)

        return Response(status=200)
    except Exception as e:
        print(str(e))
        return Response(status=500)
