from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns
from users.views import *
from knox.views import LogoutView

urlpatterns = [
    path("verify/email/", send_verification_email),
    path("verify/code/", verify_code),
    path("verify/email/reset/", send_reset_email),
    path("verify/code/reset/", verify_reset_code),
    path("reset/password/", reset_password),
    path("change/password/", change_password),
    path("find/username/", send_username),
    path("validate/", validate_user_data),
    path("register/", RegisterAPIView.as_view()),
    path("logout/", LogoutView.as_view()),
    path("login/", LoginAPIView.as_view()),
    path("authenticate/", AuthenticateProfileAPIView.as_view()),
    path("<str:nickname>/detail/", RetrieveUpdateDestroyProfile.as_view()),
]

urlpatterns = format_suffix_patterns(urlpatterns)
