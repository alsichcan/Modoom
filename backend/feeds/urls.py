from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns
from feeds.views import *

urlpatterns = [
    path("explore/modooms/", ListModooms.as_view()),  # 위치 최상단 고정할 것
    path("search/", ListSearch.as_view()),  # 위치 최상단 고정할 것
    path("<str:nickname>/modooms/like/", ListLikedModooms.as_view()),
    path("<str:nickname>/modooms/", ListMyModooms.as_view()),
    path("home/", ListModooms.as_view()),
    path("modoom/", CreateModoom.as_view()),
    path("modoom/<int:id>/", RetrieveUpdateDestroyModoom.as_view()),
    path("modoom/<int:id>/enroll/", CreateDestroyEnrollment.as_view()),
    path("modoom/<int:id>/enrollments/", ListUpdateDestroyEnrollment.as_view()),
    path("like/<str:obj_class>/<int:id>/", CreateDestroyLike.as_view()),
    path("comment/<str:obj_class>/<int:id>/", ListCreateUpdateDestroyComment.as_view()),
    path("count/", count),
]

urlpatterns = format_suffix_patterns(urlpatterns)
