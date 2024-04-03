from django.urls import path, include

urlpatterns = [
    path('auth/', include("app.auth_urls")),
    path('exam/', include("app.exam_urls")),
    path('exams/', include("app.exams_urls")),
    path('user/', include("app.user_urls")),
    path('logo/', include("app.logo_urls")),
    path('admin/', include("app.admin_urls"))
]