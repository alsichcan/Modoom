from rest_framework.pagination import PageNumberPagination, CursorPagination
from rest_framework.response import Response


class PageNumberPaginationDataOnly(PageNumberPagination):
    def get_paginated_response(self, data):
        return Response(data)


class CustomPageNumberPagination(PageNumberPagination):
    page_size_query_param = "limit"


class CustomCursorPagination(CursorPagination):
    """
    Default Pagination Class
    """

    page_size_query_param = "limit"
    ordering = "pk"


class ReverseCursorPagination(CustomCursorPagination):
    """
    마지막으로 생성된 데이터부터 리턴하는 Cursor 기반 Pagination
    """

    ordering = "-pk"
