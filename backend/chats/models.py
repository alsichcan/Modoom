from django.db import models
from feeds.models import Modoom, Enrollment
from users.models import Profile, User
from users.utils import get_valid_profile
from django.db.models.signals import *
from django.dispatch import receiver

# ------------- Chat Rooms ------------- #


class AbstractChatRoom(models.Model):
    latest_position = models.PositiveIntegerField(default=0)
    updated_at = models.DateTimeField(auto_now=True, null=True)
    last_message = models.TextField(blank=True)

    class Meta:
        abstract = True


class DirectChatRoom(AbstractChatRoom):
    """ 개인 톡방 """

    participants = models.ManyToManyField(Profile, related_name="direct_chat_rooms")

    def __str__(self):
        return f"{self.participants.first()}-{self.participants.last()}의 DM"


class ModoomChatRoom(AbstractChatRoom):
    """ 모둠의 채팅방. 하나의 모둠에 여러 개의 채팅방이 존재할 수 있다. (ex: 공지방, 채팅방, etc.) """

    modoom = models.ForeignKey(
        Modoom, related_name="chat_rooms", on_delete=models.CASCADE
    )  # 이 모둠에 속한 참가자는 ModoomChatRoom의 참가자와 동일하

    name = models.CharField(max_length=20)

    def __str__(self):
        return f"{self.modoom.title}의 채팅방"


# ------------- Status (for notification) ------------- #


class AbstractChatRoomStatus(models.Model):
    """
    DirectMessage와 ModoomMessage의 chat_room 필드를 다르게 지정해주어야 하므로
    Chat Room Status 모델에 대한 추상 클래스를 추가함. DM과 MM의 공통적인 정보는 여기에 작성한다.
    """

    recipient = models.ForeignKey(
        Profile, related_name="%(class)s", on_delete=models.CASCADE
    )
    last_position = models.PositiveIntegerField(default=0)

    class Meta:
        abstract = True


class DirectChatRoomStatus(AbstractChatRoomStatus):
    chat_room = models.ForeignKey(
        DirectChatRoom, related_name="statuses", on_delete=models.CASCADE, null=True
    )

    class Meta:
        unique_together = ("chat_room", "recipient")


class ModoomChatRoomStatus(AbstractChatRoomStatus):
    chat_room = models.ForeignKey(
        ModoomChatRoom, related_name="statuses", on_delete=models.CASCADE, null=True
    )

    class Meta:
        unique_together = ("chat_room", "recipient")


# ------------- Messages ------------- #


class AbstractMessage(models.Model):
    """
    DirectMessage와 ModoomMessage의 chat_room 필드를 다르게 지정해주어야 하므로
    Message 모델에 대한 추상 클래스를 추가함. DM과 MM의 공통적인 정보는 여기에 작성한다.
    """

    profile = models.ForeignKey(
        Profile, related_name="%(class)s", on_delete=models.SET_NULL, null=True
    )
    content = models.TextField(blank=True)
    position = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        abstract = True


class DirectMessage(AbstractMessage):
    chat_room = models.ForeignKey(
        DirectChatRoom, related_name="messages", on_delete=models.SET_NULL, null=True
    )

    def __str__(self):
        return self.content

    class Meta:
        unique_together = ("chat_room", "position")


class ModoomMessage(AbstractMessage):
    chat_room = models.ForeignKey(
        ModoomChatRoom, related_name="messages", on_delete=models.SET_NULL, null=True
    )

    def __str__(self):
        return self.content

    class Meta:
        unique_together = ("chat_room", "position")


def direct_message_from_admin(recipient, content):
    try:
        admin = Profile.objects.get(nickname="admin")
    except Profile.DoesNotExist:
        # ---------- admin 계정 없을 경우 생성 ----------
        admin = User.objects.create_superuser(
            username="admin", email="admin@modoom.us", password="Imagine@1215"
        )
        admin.profile.nickname = "admin"
        admin.profile.first_name = "둠이"
        admin.profile.last_name = "모"
        bio = """
            안녕하세요! 모둠에 오신 여러분을 진심으로 환영합니다 🙌🙌🙌
            저는 여러분이 모둠에 계신 동안 항상 함께할 모둠이라고 해요. 잘 부탁드려요! 👋
            모둠을 이용하시면서 불편한 점이나 궁금한 점이 있으시면 언제든지 말씀해주세요!
            최대한 빠르게 답변해드릴게요 😀    
        """
        admin.profile.bio = bio
        admin.save()

        admin = admin.profile

    # ---------- 채팅방 ----------
    rooms = list(admin.direct_chat_rooms.all() & recipient.direct_chat_rooms.all())
    if len(rooms) == 1:
        admin_chatroom = rooms[0]
    else:
        admin_chatroom = DirectChatRoom.objects.create()
        admin_chatroom.participants.add(*[recipient, admin])

    if DirectChatRoomStatus.objects.filter(chat_room=admin_chatroom).exists():
        admin_status = DirectChatRoomStatus.objects.get(
            recipient=admin, chat_room=admin_chatroom
        )
    else:
        admin_status = DirectChatRoomStatus.objects.create(
            recipient=admin, chat_room=admin_chatroom
        )
        recipient_status = DirectChatRoomStatus.objects.create(
            recipient=recipient, chat_room=admin_chatroom
        )

    # ---------- 메시지 보내기 ----------
    DirectMessage.objects.create(
        profile=admin,
        content=content,
        chat_room_id=admin_chatroom.id,
        position=admin_chatroom.latest_position + 1,
    )

    admin_chatroom.latest_position += 1
    admin_chatroom.save()

    admin_status.last_position += 1
    admin_status.save()


def modoom_message_from_admin(chat_room, content):
    try:
        admin = Profile.objects.get(nickname="admin")
    except Profile.DoesNotExist:
        # ---------- admin 계정 없을 경우 생성 ----------
        admin = User.objects.create_superuser(
            username="admin", email="admin@modoom.us", password="Imagine@1215"
        )
        admin.profile.nickname = "admin"
        admin.profile.first_name = "둠이"
        admin.profile.last_name = "모"
        bio = """
            안녕하세요! 모둠에 오신 여러분을 진심으로 환영합니다 🙌🙌🙌
            저는 여러분이 모둠에 계신 동안 항상 함께할 모둠이라고 해요. 잘 부탁드려요! 👋
            모둠을 이용하시면서 불편한 점이나 궁금한 점이 있으시면 언제든지 말씀해주세요!
            최대한 빠르게 답변해드릴게요 😀    
        """
        admin.profile.bio = bio
        admin.save()

        admin = admin.profile

    # ---------- 메시지 보내기 ----------
    ModoomMessage.objects.create(
        profile=admin,
        content=content,
        chat_room=chat_room,
        position=chat_room.latest_position + 1,
    )

    chat_room.latest_position += 1
    chat_room.save()


@receiver(pre_delete, sender=Enrollment)
def pre_delete_enrollment(sender, instance, *args, **kwargs):
    if instance.accepted:
        chat_rooms = ModoomChatRoom.objects.filter(modoom=instance.modoom)

        for chat_room in chat_rooms:
            status = ModoomChatRoomStatus.objects.filter(
                recipient=instance.profile,
                chat_room=chat_room,
            )
            status.delete()

            modoom_message_from_admin(
                chat_room=chat_room,
                content=f"""{instance.profile.full_name}님이 모둠을 나갔습니다.""",
            )
