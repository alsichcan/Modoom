from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns
from keywords.views import *

urlpatterns = [
    path("groups/", ListKeywordGroups.as_view()),
    path("<str:keyword>/profiles/", ListKeywordProfile.as_view()),
    path("<str:keyword>/modooms/", ListKeywordModoom.as_view()),
    path("<str:keyword>/add/", UpdateProfileAddKeyword.as_view()),
    path("<str:keyword>/", RetrieveKeywordDetail.as_view()),
    path("", ListKeywords.as_view()),  # 리스트의 가장 아래에 위치해야 한다.
]

urlpatterns = format_suffix_patterns(urlpatterns)
