from django.urls import path

from . import views

urlpatterns = [
    path('exams', views.ExamsEndpoint),
    path('exam', views.ExamEndpoint),
]