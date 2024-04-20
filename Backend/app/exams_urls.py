from django.urls import path

from app.views import exams_views

urlpatterns = [
    path('', exams_views.ExamsEndpoint),
    path('favourites', exams_views.ExamsFavouritesEndpoint),
    path('recents', exams_views.ExamsRecentEndpoint),
    path('schools', exams_views.ExamsSchoolsEndpoint),
    path('subjects', exams_views.ExamsSubjectsEndpoint),
]