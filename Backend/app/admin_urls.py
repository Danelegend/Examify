from django.urls import path

from app.views import admin_views

urlpatterns = [
    path('exams/current', admin_views.CurrentExamsEndpoint),
    path('exams/review', admin_views.ReviewExamsEndpoint),
    path('exam/submit', admin_views.SubmitExamEndpoint),
    path('exam/delete', admin_views.DeleteExamEndpoint)
]