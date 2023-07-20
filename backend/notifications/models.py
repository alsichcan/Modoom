from django.db import models
from django.template.loader import render_to_string
from django.core.mail import EmailMessage, EmailMultiAlternatives
from django.conf import settings
from users.models import Profile
from feeds.models import Modoom
from django.utils import timezone
from django.contrib.contenttypes.models import ContentType
from django.contrib.contenttypes.fields import GenericForeignKey
from rest_framework import generics, exceptions
from feeds.models import *


# Create your models here.
class Notification(models.Model):
    """
    개요::
        <Actor>의 <action>이 <timestamp>과 함께 <recipient>한테 알림이 가는 방식
        Notification의 <Actor> 파트를 누르면 <Actor>의 프로필로 이동, 그 외는 <Target>의 url로 이동
        Notification을 누르면 unread = True가 되고, 삭제하면 deleted = True가 됨

    Generalized Format::
        <actor(optional)> <action> : <description> <timestamp>

    Examples::
        <박지상님이> <회원님의 친구 요청을 수락했습니다.> <8분 전>

    Unicode Representation::
        박지상님이 회원님의 친구 요청을 수락했습니다. 8분 전
    """

    # ----- Meta Data -----
    recipient = models.ForeignKey(
        Profile, related_name="notifications", on_delete=models.CASCADE
    )

    timestamp = models.DateTimeField(default=timezone.now, db_index=True)

    # ----- Status -----
    listed = models.BooleanField(default=False, blank=False, db_index=True)
    unread = models.BooleanField(default=True, blank=False, db_index=True)
    deleted = models.BooleanField(default=False, blank=False, db_index=True)

    # ----- Contents -----
    actor = models.ForeignKey(
        Profile, blank=True, null=True, related_name="actions", on_delete=models.CASCADE
    )

    """
    Enum을 활용한 Action Chocies
    참고: https://docs.djangoproject.com/en/3.1/ref/models/fields/#choices
    >>> Action.MODOOM_LIKE
    '님이 회원님의 모둠을 좋아합니다.'
    >>> Action.MODOOM_LIKE.label
    'Modoom Like'
    """

    class Action(models.TextChoices):
        # ----- modoom 관련 (Target : MODOOM) -----
        MODOOM_COMMENT = "님이 회원님의 모둠에 댓글을 남겼습니다."
        COMMENT_SUBCOMMENT = "님이 회원님의 댓글에 답글을 남겼습니다."
        MODOOM_REQUEST_DECLINED = "님이 회원님의 모둠 가입을 거절했습니다."
        MODOOM_KICKED = "님이 회원님을 모둠에서 강퇴했습니다."

        # ----- Modoom 활동 관련 (Target : CHAT) ------
        MODOOM_REQUEST_ACCEPTED = "님이 회원님의 모둠 가입을 수락했습니다."
        MODOOM_REQUEST_RECEIVED = "님이 회원님의 모둠 가입을 신청했습니다."
        MODOOM_NEW_MEMBER = "님이 회원님의 모둠에 가입했습니다."
        MODOOM_OUT_MEMBER = "님이 회원님의 모둠에서 나갔습니다."
        MODOOM_CLOSED = "님이 회원님의 모둠을 종료했습니다."

        # ----- Review 관련 (Target : REVIEW_WRITE) -----
        REVIEW_WRITE = "함께한 모둠원의 롤링페이퍼에 한마디를 작성해주세요!"

        # ----- Review 관련 (Target : REVIEW_RECEIVED) -----
        REVIEW_RECEIVED = "모둠원이 회원님의 롤링페이퍼에 한마디를 작성했습니다!"

        # ----- Profile 관련 (Target : PROFILE) -----
        FRIEND_REQUEST_ACCEPTED = "님이 회원님의 친구 신청을 수락했습니다."
        FRIEND_REQUEST_RECEIVED = "님이 회원님에게 친구 신청을 보냈습니다."

    action = models.CharField(
        max_length=255, choices=Action.choices, blank=False, null=False
    )

    def __str__(self):
        return str(self.recipient) + "에게 / " + str(self.actor) + self.action

    class Target(models.TextChoices):
        MODOOM = "modoom"
        CHAT = "chat"
        REVIEW_WRITE = "review_write"
        REVIEW_RECEIVED = "review_received"
        PROFILE = "profile"

    target = models.CharField(
        max_length=255, choices=Target.choices, blank=True, null=True
    )
    target_id = models.PositiveIntegerField(blank=True, null=True)

    description = models.CharField(max_length=100, null=True, blank=True)

    class Meta:
        ordering = ("-timestamp",)
        # speed up notifications count query
        index_together = ("recipient", "listed")

    def mark_as_read(self):
        if self.unread:
            self.unread = False
            self.save()

    def mark_as_deleted(self):
        if not self.deleted:
            self.deleted = True
            self.save()


class Email(models.Model):
    SENDER = "모둠 <admin@modoom.us>"

    # ----- Meta Data -----
    recipient = models.ForeignKey(
        Profile, related_name="emails", on_delete=models.CASCADE
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    # ----- Status -----
    emailed = models.BooleanField(default=False, blank=False, db_index=True)

    # ----- Contents -----
    class SUBJECT(models.TextChoices):
        SEND_CODE = "[모둠] SNU 메일 인증 번호입니다."
        USERNAME = "[모둠] 아이디 안내입니다."
        USER_WELCOME = "[모둠] 마음 맞는 사람들과 함께하는 곳, 모둠에 오신 것을 환영합니다."
        USER_GOODBYE = "[모둠] 회원탈퇴 안내메일입니다."
        MODOOM_REQUEST_RECEIVED = "[모둠] 회원님의 모둠에 새로운 가입 신청이 도착했습니다."
        MODOOM_REQUEST_ACCEPTED = "[모둠] 회원님의 모둠 가입 신청이 수락되었습니다."

    subject = models.CharField(
        max_length=255, choices=SUBJECT.choices, blank=False, null=False
    )

    class TEMPLATE(models.TextChoices):
        SEND_CODE = "notifications/user_email_verification.html"
        USER_WELCOME = "notifications/user_welcome.html"
        USER_GOODBYE = "notifications/user_goodbye.html"
        MODOOM_REQUEST_RECEIVED = "notifications/modoom_request_received.html"
        MODOOM_REQUEST_ACCEPTED = "notifications/modoom_request_accepted.html"

    template = models.CharField(
        max_length=255, choices=TEMPLATE.choices, blank=False, null=False
    )

    description = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        ordering = ("-created_at",)
        # speed up notifications count query
        index_together = ("recipient", "emailed")

    def mark_as_emailed(self):
        if not self.emailed:
            self.emailed = True
            self.save()

    def send_email(self):
        if self.emailed:
            return
        if settings.DEBUG:
            return

        email = self.recipient.pref_email or self.recipient.user.email
        subject, from_email, to = self.subject, self.SENDER, email

        if self.subject == Email.SUBJECT.USER_WELCOME:
            text_content = f"""
                안녕하세요. {self.recipient.full_name} 회원님! \n
                모둠을 찾아주셔서 감사해요 🙌 \n
                모둠에서는 마음 맞고 믿을 만한 새로운 사람들과 함께할 수 있어요. \n
                지금 바로 마음에 드는 모둠에 참여하거나 직접 모둠을 만들어 마음 맞는 사람들을 모아보세요! \n
                \n
                모둠 바로가기 (https://modoom.us/) \n

                \n
                모둠을 이용하시는데 궁금한 점이나 불편한 점이 있으시면 \n
                모둠이한테 DM🗨을 보내주시거나, 이 주소로 메일📧을 보내주세요! \n
                최대한 빠르게 해결해드릴게요 😀
                """
        elif self.subject == Email.SUBJECT.MODOOM_REQUEST_ACCEPTED:
            text_content = f"""
                안녕하세요. {self.recipient.full_name} 회원님! \n
                {self.recipient.full_name}님의 다음 모둠에 대한 가입 신청이 수락 ✔ 되었어요! \n
                {self.description} \n
                앞으로 함께할 모둠원들과 인사하러 지금 바로 가볼까요? 😆  \n
                \n
                모둠 바로가기 (https://modoom.us/) \n

                \n
                모둠을 이용하시는데 궁금한 점이나 불편한 점이 있으시면 \n
                모둠이한테 DM🗨을 보내주시거나, 이 주소로 메일📧을 보내주세요! \n
                최대한 빠르게 해결해드릴게요 😀
                """
        elif self.subject == Email.SUBJECT.MODOOM_REQUEST_RECEIVED:
            text_content = f"""
                안녕하세요. {self.recipient.full_name} 회원님! \n
                {self.recipient.full_name}님의 다음 모둠에 대한 가입 신청이 도착 📩 했어요! \n
                {self.description} \n
                가입 신청을 확인하러 지금 바로 가볼까요? 😆 \n
                \n
                모둠 바로가기 (https://modoom.us/) \n

                \n
                모둠을 이용하시는데 궁금한 점이나 불편한 점이 있으시면 \n
                모둠이한테 DM🗨을 보내주시거나, 이 주소로 메일📧을 보내주세요! \n
                최대한 빠르게 해결해드릴게요 😀
                """
        else:
            # 발생해서는 안된다.
            text_content = None

        html_content = render_to_string(
            self.template,
            {
                "name": self.recipient.full_name,
                "description": self.description,
            },
        )

        emailmsg = EmailMultiAlternatives(
            subject,
            text_content,
            from_email,
            [
                to,
            ],
        )
        emailmsg.attach_alternative(html_content, "text/html")

        if emailmsg.send(fail_silently=True) == 1:
            self.mark_as_emailed()
        else:
            pass


def create_notification(recipient, action, actor=None, target=None, description=None):
    """
    Handler function to create Notification instance upon action
    Required Field : recipient (Profile), action (Notification.Action)
    Optional Field : actor (Profile), target (Modoom)
    """

    target_id = None

    if action in [
        Notification.Action.MODOOM_COMMENT,
        Notification.Action.COMMENT_SUBCOMMENT,
        Notification.Action.MODOOM_REQUEST_DECLINED,
        Notification.Action.MODOOM_KICKED,
    ]:
        target_id = target.id
        description = description
        target = Notification.Target.MODOOM
    elif action in [
        Notification.Action.MODOOM_REQUEST_ACCEPTED,
        Notification.Action.MODOOM_REQUEST_RECEIVED,
        Notification.Action.MODOOM_NEW_MEMBER,
        Notification.Action.MODOOM_OUT_MEMBER,
        Notification.Action.MODOOM_CLOSED,
    ]:
        target_id = target.id
        description = target.title
        target = Notification.Target.CHAT
    elif action in [
        Notification.Action.FRIEND_REQUEST_ACCEPTED,
        Notification.Action.FRIEND_REQUEST_RECEIVED,
    ]:
        target = Notification.Target.PROFILE
    elif action is Notification.Action.REVIEW_WRITE:
        target = Notification.Target.REVIEW_WRITE
    elif action is Notification.Action.REVIEW_RECEIVED:
        target = Notification.Target.REVIEW_RECEIVED
        description = description
    else:
        raise exceptions.NotAcceptable

    notification = Notification(
        recipient=recipient,
        actor=actor,
        action=action,
        target=target,
        target_id=target_id,
        description=description,
    )

    notification.save()


def create_send_email(recipient, subject, template, description=None):
    """
    Handler function to create Email instance upon action.
    Required Field : recipient (Profile), action (Notification.Action)
    Optional Field : actor (Profile), target (Modoom)
    """
    email = Email(
        recipient=recipient,
        subject=subject,
        template=template,
        description=description,
    )
    email.save()
    email.send_email()
