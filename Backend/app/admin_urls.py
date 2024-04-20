from django.urls import path

from app.views import admin_views

urlpatterns = [
    path('exams/current', admin_views.CurrentExamsEndpoint),
    path('exams/review', admin_views.ReviewExamsEndpoint),
    path('exam/review/submit', admin_views.SubmitReviewExamEndpoint),
    path('exam/review/delete', admin_views.DeleteReviewExamEndpoint),
    path('exam/current/<int:exam_id>', admin_views.DeleteCurrentExamEndpoint),
    path('exam/upload', admin_views.UploadExamEndpoint),
]