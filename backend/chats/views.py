from rest_framework import generics, exceptions
from rest_framework.views import APIView
from rest_framework.mixins import CreateModelMixin
from rest_framework_serializer_extensions.views import SerializerExtensionsAPIViewMixin
from django.db.models import Q
from chats.serializers import *
from rest_framework.pagination import CursorPagination
from utils import make_response
from users.utils import get_valid_profile
from utils import get_object_or_exception
from .models import *
from modoom_api.paginations import CustomPageNumberPagination


class MessageCursorPagination(CursorPagination):
    ordering = "-pk"
    page_size = 20

    def get_paginated_response(self, data):
        # TODO : chatroom.statuses.filter(recipient=self.request.user.profile).last_position부터 반환
        # TODO : chatroomstatus.last_position = chat_room.latest_position
        return super(MessageCursorPagination, self).get_paginated_response(
            list(reversed(data))
        )


class ListCreateModoomChatRoomStatus(
    SerializerExtensionsAPIViewMixin, CreateModelMixin, generics.ListAPIView
):
    """
    User가 가입했던 모둠의 리스트를 출력
    """

    serializer_class = ModoomChatRoomStatusSerializer
    pagination_class = CustomPageNumberPagination

    def get_queryset(self):
        return (
            ModoomChatRoomStatus.objects.filter(
                recipient=self.request.user.profile, chat_room__modoom__ongoing=True
            )
            .prefetch_related(
                "chat_room",
                "chat_room__modoom",
                "chat_room__modoom__keywords",
                "chat_room__modoom__enrollments__profile",
            )
            .order_by("-chat_room__updated_at")
        )

    def get_extensions_mixin_context(self):
        context = super().get_extensions_mixin_context()
        if self.request.method == "GET":
            context["expand"] = {
                "chat_room__modoom__keywords",
                "chat_room__modoom__enrollments__profile",
            }
            context["only"] = [
                "last_position",
                "unread_count",
                "chat_room__id",
                "chat_room__latest_position",
                "chat_room__updated_at",
                "chat_room__last_message",
                "chat_room__modoom__id",
                "chat_room__modoom__title",
                "chat_room__modoom__n_members",
                "chat_room__modoom__accom",
                "chat_room__modoom__location",
                "chat_room__modoom__keywords",
                "chat_room__modoom__enrollments__profile__image",
                "chat_room__modoom__enrollments__profile__first_name",
                "chat_room__modoom__enrollments__accepted",
                "chat_room__modoom__enrollments__profile__full_name",
            ]
        return context

    def post(self, request, *args, **kwargs):
        request.data["name"] = request.data["name"].strip()
        if ModoomChatRoom.objects.filter(
            name=request.data["name"], modoom_id=request.data["modoom"]
        ).exists():
            return make_response(success=False, message="같은 이름의 채널이 이미 존재합니다.")
        return self.create(request, *args, **kwargs)


class ListModoomMessages(SerializerExtensionsAPIViewMixin, generics.ListAPIView):
    pagination_class = MessageCursorPagination
    serializer_class = ModoomMessageSerializer
    message_model = ModoomMessage
    chatroom_model = ModoomChatRoom
    status_model = ModoomChatRoomStatus

    def get_queryset(self):
        """
        메시지를 불러올 때마다 last_position을 latest_position으로 업데이트한다.

        TODO: 내가 속한 모둠이 아니면 403에러 발생
        :return:
        """

        chatroom = self.chatroom_model.objects.get(pk=self.kwargs.get("room_id"))

        chatroom_status = get_object_or_exception(
            self.status_model, recipient=self.request.user.profile, chat_room=chatroom
        )

        chatroom_status.last_position = chatroom.latest_position
        chatroom_status.save()

        return self.message_model.objects.filter(
            chat_room_id=self.kwargs.get("room_id")
        ).all()

    def get_extensions_mixin_context(self):
        context = super().get_extensions_mixin_context()
        context["expand"] = {"profile"}
        context["exclude"] = {"profile__keywords"}
        return context


class ListDirectMessages(ListModoomMessages):
    serializer_class = DirectMessageSerializer
    message_model = DirectMessage
    chatroom_model = DirectChatRoom
    status_model = DirectChatRoomStatus


class ListCreateDirectChatRoomStatus(
    SerializerExtensionsAPIViewMixin, generics.ListCreateAPIView
):
    serializer_class = DirectChatRoomStatusSerializer
    pagination_class = CustomPageNumberPagination

    def get_queryset(self):
        return (
            DirectChatRoomStatus.objects.filter(
                recipient=self.request.user.profile, chat_room__messages__isnull=False
            )
            .distinct()
            .prefetch_related(
                "chat_room",
                "chat_room__participants",
            )
            .order_by("-chat_room__updated_at")
        )

    def get_extensions_mixin_context(self):
        context = super().get_extensions_mixin_context()
        if self.request.method == "GET":
            context["expand"] = {"chat_room__participants"}
            context["only"] = [
                "recipient",
                "last_position",
                "chat_room__id",
                "chat_room__latest_position",
                "chat_room__updated_at",
                "chat_room__last_message",
                "chat_room__participants__image",
                "chat_room__participants__nickname",
                "chat_room__participants__full_name",
                "chat_room__participants__first_name",
                "chat_room__participants__uid",
            ]
        return context

    def post(self, request, *args, **kwargs):
        """ 자신과 상대 사이에 다이렉트 채팅방을 반환하거나 없으면 새로 생성한다. """
        myself = self.request.user.profile
        him = get_valid_profile(nickname=self.request.data.get("nickname", None))
        if myself == him:
            raise exceptions.NotAcceptable

        rooms = list(myself.direct_chat_rooms.all() & him.direct_chat_rooms.all())
        if len(rooms) == 0:
            direct_chat_room = DirectChatRoom.objects.create()
            direct_chat_room.participants.add(*[myself, him])

            DirectChatRoomStatus.objects.create(
                recipient=myself, chat_room=direct_chat_room
            )
            DirectChatRoomStatus.objects.create(
                recipient=him, chat_room=direct_chat_room
            )

        elif len(rooms) == 1:
            direct_chat_room = rooms[0]
        else:
            # 이 상황이 발생해서는 안된다.
            raise exceptions.ValidationError

        return make_response(
            success=True,
            data=dict(
                room=DirectChatRoomSerializer(direct_chat_room).data,
                profile=ProfileSerializer(him).data,
            ),
        )


def send_welcome_message(recipient):
    message = f"""{recipient.full_name}님 안녕하세요! 모둠에 오신 {recipient.full_name}님을 진심으로 환영합니다 🙌🙌🙌 \n
        저는 {recipient.full_name}님이 모둠에 계신 동안 항상 함께할 모둠이라고 해요. 잘 부탁드려요! 👋 \n
        모둠을 이용하시면서 불편한 점이나 궁금한 점이 있으시면 언제든지 말씀해주세요! \n
        최대한 빠르게 답변해드릴게요 😀 \n
    """

    direct_message_from_admin(recipient=recipient, content=message)
