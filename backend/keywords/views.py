from rest_framework import generics
from rest_framework_serializer_extensions.views import SerializerExtensionsAPIViewMixin
from django.db.models import Q, F, Sum, Prefetch
from users.serializers import *
from feeds.serializers import *
from utils import *
from users.utils import check_self_profile
from modoom_api.paginations import *
import datetime


class RetrieveKeywordDetail(SerializerExtensionsAPIViewMixin, generics.RetrieveAPIView):
    serializer_class = KeywordSerializer

    def get_object(self):
        return get_object_or_exception(Keyword, name=self.kwargs.get("keyword"))

    def get_extensions_mixin_context(self):
        context = super().get_extensions_mixin_context()
        context["only"] = [
            "id",
            "n_profiles",
            "n_modooms",
        ]
        return context


class ListKeywordGroups(SerializerExtensionsAPIViewMixin, generics.ListAPIView):
    """
    키워드 그룹의 목록을 가져오는 View
    """

    serializer_class = KeywordGroupSerializer
    pagination_class = CustomPageNumberPagination

    def get_queryset(self):
        return (
            KeywordGroup.objects.all()
            .prefetch_related(
                Prefetch(
                    "keywords",
                    queryset=Keyword.objects.order_by("-n_modooms"),
                )
            )
            .order_by("custom_order")
        )

    def get_extensions_mixin_context(self):
        context = super().get_extensions_mixin_context()
        context["expand"] = {"keywords"}
        return context


class ListKeywords(SerializerExtensionsAPIViewMixin, generics.ListAPIView):
    """
    키워드 자동완성, 인기 키워드 등 키워드 목록을 불러오는 로직은 전부 이곳에서 처리한다.
    상세 옵션은 query_params를 이용하여 지정한다.
    """

    serializer_class = KeywordSerializer
    pagination_class = CustomPageNumberPagination

    def get_queryset(self):
        base = Q(n_modooms__gt=0)
        # query_param : startswith / 키워드 자동완성
        startswith = self.request.query_params.get("startswith")
        if startswith:
            base &= Q(name__startswith=startswith)
            return Keyword.objects.filter(base).order_by("-n_modooms")

        # query_param : keyword_group / 주어진 키워드 그룹에 속하는 키워드들
        keyword_group = self.request.query_params.get("keyword_group")
        if keyword_group:
            return (
                KeywordGroup.objects.get(name=keyword_group)
                .keywords.filter(base)
                .order_by("-n_modooms")
            )

        # query_param x / 인기 키워드
        return Keyword.objects.filter(base).order_by("-n_modooms")


class UpdateProfileAddKeyword(SerializerExtensionsMixin, generics.UpdateAPIView):
    serializer_class = ProfileSerializer

    def get_object(self):
        return self.request.user.profile

    def patch(self, request, *args, **kwargs):
        profile = self.get_object()
        keyword_to_add = get_object_or_exception(
            Keyword, name=self.kwargs.get("keyword")
        )
        profile.keywords.add(keyword_to_add)
        profile.save()
        return make_response(success=True, message="키워드가 추가되었습니다!")


class ListKeywordProfile(SerializerExtensionsAPIViewMixin, generics.ListAPIView):
    """
    입력 Keyword에 대한 Profile 리스트를 최신순으로 출력
    """

    serializer_class = ProfileSerializer
    pagination_class = ReverseCursorPagination

    def get_queryset(self):
        keyword = Keyword.objects.get(name=self.kwargs["keyword"])
        profiles = keyword.profiles.filter(user__is_active=True).prefetch_related(
            "keywords"
        )
        return profiles

    def get_extensions_mixin_context(self):
        context = super().get_extensions_mixin_context()
        context["expand"] = {"keywords"}
        context["only"] = set(PROFILE_FIELDS_TO_SHOW)
        return context


class ListKeywordModoom(SerializerExtensionsAPIViewMixin, generics.ListAPIView):
    """
    입력 Keyword에 대한 Modoom 리스트를 최신순으로 출력
    """

    serializer_class = ModoomSerializer
    pagination_class = CustomPageNumberPagination

    def get_queryset(self):
        keyword = Keyword.objects.get(name=self.kwargs["keyword"])
        modooms = (
            keyword.modooms.filter(deleted=False)
            .prefetch_related("keywords")
            .select_related("profile")
            .order_by("-ongoing", "-custom_order", "-pk")
        )
        return modooms

    def get_extensions_mixin_context(self):
        context = super().get_extensions_mixin_context()
        context["expand"] = {"profile", "enrollments__profile", "keywords"}
        context["only"] = set(MODOOM_FIELDS_TO_SHOW)
        return context
