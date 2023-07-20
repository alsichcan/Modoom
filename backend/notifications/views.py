from rest_framework_serializer_extensions.views import SerializerExtensionsAPIViewMixin
from rest_framework import generics, exceptions
from users.utils import get_valid_profile, check_self_profile
from utils import *
from modoom_api.paginations import *
from notifications.models import *
from notifications.serializers import NotificationSerializer
from chats.models import *
from chats.serializers import *


# Create your views here.
class UpdateNotification(generics.UpdateAPIView):
    """
    사용자의 알림의 state (deleted, unread)를 변경한다.
    """

    serializer_class = NotificationSerializer

    def get_object(self):
        recipient = self.request.user.profile
        notification = get_object_or_exception(
            Notification,
            recipient=recipient,
            id=self.kwargs.get("id"),
            listed=True,
            deleted=False,
        )
        return notification

    def put(self, request, *args, **kwargs):
        raise exceptions.MethodNotAllowed(method="PUT", detail="Use PATCH, not PUT")

    def patch(self, request, *args, **kwargs):
        command = self.kwargs.get("command")
        if command not in ["delete", "read"]:
            raise exceptions.NotAcceptable(detail="잘못된 요청입니다.")

        notification = self.get_object()
        if command == "delete":
            notification.mark_as_deleted()
            command = "삭제"
        else:
            notification.mark_as_read()
            command = "읽음"

        return make_response(success=True, message=f"해당 알림이 {command} 처리 되었습니다.")


class UpdateListNotifications(
    SerializerExtensionsAPIViewMixin, generics.ListAPIView, generics.UpdateAPIView
):
    """
    get
     with command "count": 사용자가 열어보지 않은 알림 개수 반환
     with command "list": 삭제되지 않은 모든 알림 목록 반환
    patch
     with command "delete" : 모든 알림 삭제 처리
     with command "read" : 모든 알림 읽음 처리
    """

    serializer_class = NotificationSerializer
    pagination_class = ReverseCursorPagination

    def get(self, request, *args, **kwargs):
        command = self.kwargs.get("command")
        if command not in ["count", "list"]:
            raise exceptions.NotAcceptable(detail="잘못된 요청입니다.")

        if command == "count":
            profile = self.request.user.profile
            data = dict()

            # ----------- 확인하지 않은 새 알림 수 ----------
            data["n_notifications"] = Notification.objects.filter(
                recipient=self.request.user.profile,
                unread=True,
                deleted=False,
            ).count()

            # ----------- 확인하지 않은 새 메시지 수 ----------
            n_unread_messages = 0

            # ----------- 확인하지 않은 Direct Message 수 ----------
            direct_chat = []

            dcr_statuses = DirectChatRoomStatus.objects.filter(
                recipient=profile
            ).select_related("chat_room")

            for status in dcr_statuses:
                status_data = DirectChatRoomStatusSerializer(status).data
                n_unread_messages += status_data["unread_count"]
                direct_chat.append(status_data)

            data["direct_chat"] = direct_chat

            # ----------- 확인하지 않은 Modoom Message 수 ----------
            modoom_chat = []

            mcr_statuses = ModoomChatRoomStatus.objects.filter(
                recipient=profile, chat_room__modoom__deleted=False
            ).select_related("chat_room")

            for status in mcr_statuses:
                status_data = ModoomChatRoomStatusSerializer(status).data
                n_unread_messages += status_data["unread_count"]
                modoom_chat.append(status_data)

            data["modoom_chat"] = modoom_chat

            # ----------- 확인하지 않은 모든 Message 수 ----------
            data["n_unread_messages"] = n_unread_messages

            return make_response(success=True, data=data)
        else:
            return self.list(request, *args, **kwargs)

    def get_queryset(self):
        notifications = Notification.objects.filter(
            recipient=self.request.user.profile, deleted=False
        )
        notifications.update(listed=True)
        return notifications

    def get_extensions_mixin_context(self):
        context = super().get_extensions_mixin_context()
        context["expand"] = {"actor"}
        context["only"] = set(NOTIFICATION_FIELDS_TO_SHOW)
        return context

    def put(self, request, *args, **kwargs):
        raise exceptions.MethodNotAllowed(method="PUT", detail="Use PATCH, not PUT")

    def patch(self, request, *args, **kwargs):
        command = self.kwargs.get("command")

        if command not in ["delete", "read"]:
            raise exceptions.NotAcceptable(detail="잘못된 요청입니다.")

        recipient = self.request.user.profile
        notifications = Notification.objects.filter(
            recipient=recipient, listed=True, deleted=False
        )

        if command == "delete":
            notifications.update(deleted=True)
            command = "삭제"
        else:
            notifications.update(unread=False)
            command = "읽음"

        return make_response(success=True, message=f"모든 알림이 {command} 처리되었습니다.")


# ----- 다른 view에서 email을 보내는 함수 -----


def send_code_email(email: str, code: int):
    subject, from_email, to = (
        Email.SUBJECT.SEND_CODE if type(code) == int else Email.SUBJECT.USERNAME,
        Email.SENDER,
        email,
    )
    text_content = f"{str(code)}"
    html_content = render_to_string(
        Email.TEMPLATE.SEND_CODE,
        {
            "code": str(code),
        },
    )

    email_msg = EmailMultiAlternatives(
        subject,
        text_content,
        from_email,
        [
            to,
        ],
    )
    email_msg.attach_alternative(html_content, "text/html")

    if email_msg.send(fail_silently=True) == 1:
        return make_response(success=True, data=email)
    else:
        message = "이메일을 보내는 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요."
        return make_response(success=False, message=message)


def send_welcome_email(recipient):
    create_send_email(
        recipient=recipient,
        subject=Email.SUBJECT.USER_WELCOME,
        template=Email.TEMPLATE.USER_WELCOME,
    )


def send_goodbye_email(email: str, name: str):
    subject, from_email, to = Email.SUBJECT.USER_GOODBYE, Email.SENDER, email
    text_content = f"""
        안녕하세요. {name} 회원님 \n\n 
        모둠에서 안내 말씀 드립니다. \n\n
        회원님께서 요청하신대로 모둠 계정에 대한 탈퇴 처리가 완료되었습니다. \n\n
        그동안 모둠을 이용해주셔서 감사했습니다. \n\n
        보다 나은 서비스로 다시 찾아 뵙겠습니다. \n\n
        감사합니다. \n\n
        모둠 드림 \n\n
        """
    html_content = render_to_string(
        Email.TEMPLATE.USER_GOODBYE,
        {
            "name": name,
        },
    )
    email_msg = EmailMultiAlternatives(
        subject,
        text_content,
        from_email,
        [
            to,
        ],
    )
    email_msg.attach_alternative(html_content, "text/html")

    email_msg.send(fail_silently=True)


def send_modoom_request_received_email(recipient, description):
    subject = Email.SUBJECT.MODOOM_REQUEST_RECEIVED
    template = Email.TEMPLATE.MODOOM_REQUEST_RECEIVED

    if recipient.receive_enroll_mails:
        create_send_email(
            recipient=recipient,
            subject=subject,
            template=template,
            description=description,
        )


def send_modoom_request_accepted_email(recipient, description):
    subject = Email.SUBJECT.MODOOM_REQUEST_ACCEPTED
    template = Email.TEMPLATE.MODOOM_REQUEST_ACCEPTED

    if recipient.receive_enroll_mails:
        create_send_email(
            recipient=recipient,
            subject=subject,
            template=template,
            description=description,
        )
