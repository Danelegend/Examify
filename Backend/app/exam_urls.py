from django.urls import path

from app.views import exam_views

urlpatterns = [
    path('<str:school>/<int:year>/<str:type>', exam_views.ExamEndpoint),
    path('pdf/<int:exam_id>', exam_views.ExamPdfEndpoint),
    path('<int:exam_id>/favourite', exam_views.ExamFavouriteEndpoint),
    path('<int:exam_id>/recent', exam_views.ExamRecentEndpoint)
]