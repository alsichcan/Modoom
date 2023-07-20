from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns
from relationships.views import *

urlpatterns = [
    path("<str:nickname>/modoomees/", ListModoomees.as_view()),
    path("<str:nickname>/reviews/", ListReceivedReviews.as_view()),
    path("<str:nickname>/review/", ListCreateReview.as_view()),
    path("<str:nickname>/friends/", ListFriends.as_view()),
    path(
        "friend/request/<str:nickname>/<str:command>/",
        CreateDestroyFriendRequest.as_view(),
    ),
    path("friend/<str:nickname>/", RetrieveDestroyFriendship.as_view()),
]

urlpatterns = format_suffix_patterns(urlpatterns)
