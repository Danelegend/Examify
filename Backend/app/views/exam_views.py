import json

from django.http import FileResponse, JsonResponse

from rest_framework.decorators import api_view
from rest_framework.response import Response

from app.models import Exam
from app.errors import AuthenticationError, DuplicationError, ValidationError
from app.views.util import get_access_token
from app.functionality.exam.exam import AddFavouriteExam, AddRecentlyViewedExam, GetExam2, GetExamPdf, RemoveFavouriteExam

@api_view(['GET'])
def ExamEndpoint(request, school, year, type):
    data = GetExam2(school, year, type)

    if data is None:
        return JsonResponse({"message": "Exam not found"}, status=404)

    return JsonResponse(data, status=200)

@api_view(['GET'])
def ExamPdfEndpoint(request, exam_id):
    location = Exam.objects.get(id=exam_id).file_location

    try:
        return FileResponse(GetExamPdf(location), content_type='application/pdf', status=200)
    except IOError:
        return JsonResponse({"message": "File not found"}, status=404)
    except ValueError:
        return JsonResponse({"message": "Location invalid"}, status=403)

@api_view(['POST', 'DELETE'])
def ExamFavouriteEndpoint(request, exam_id: int):
    token = get_access_token(request)

    body_unicode = request.body.decode('utf-8')
    body = json.loads(body_unicode)

    exam_id = body["exam_id"]

    if request.method == 'POST':
        try:
            AddFavouriteExam(token, exam_id)

            return JsonResponse({
                "message": "Exam added to favourites"
            }, status=200)
        except AuthenticationError as a:
            return JsonResponse({
                "message": a.message
            }, status=403)
        except ValidationError as v:
            return JsonResponse({
                "message": v.message
            }, status=400)
        except DuplicationError as d:
            return JsonResponse({
                "message": d.message
            }, status=400)
    elif request.method == 'DELETE':
        try:
            RemoveFavouriteExam(token, exam_id)

            return Response(status=200)
        except AuthenticationError as a:
            return JsonResponse({
                "message": a.message
            }, status=403)
        except ValidationError as v:
            return JsonResponse({
                "message": v.message
            }, status=400)

@api_view(['POST'])
def ExamRecentEndpoint(request, exam_id: int):
    token = get_access_token(request)

    body_unicode = request.body.decode('utf-8')
    body = json.loads(body_unicode)

    exam_id = body["exam_id"]

    try:
        AddRecentlyViewedExam(token, exam_id)

        return Response(status=200)
    except AuthenticationError as a:
        return JsonResponse({
            "message": a.message
        }, status=403)
    except ValidationError as v:
        return JsonResponse({
            "message": v.message
        }, status=400)
