from django.test import TestCase
from .models import *
from .serializers import *
from feeds.models import *
from users.models import *
from notifications.tests import count_notifications
from feeds.tests import *
from rest_framework.test import APIClient as Client


class ChatTestCase(TestCase):
    def setUp(self) -> None:
        """ 각 test_ 메서드를 실행할 때마다 실행되는 메서드 """
        self.profile1 = User.objects.create_user(
            "jisang-park", "user1@s.com", "password1"
        ).profile
        self.profile1.nickname = "jsp1998"
        self.profile1.save()

        self.profile2 = User.objects.create_user(
            "shinhong-park", "user2@s.com", "password2"
        ).profile
        self.profile2.nickname = "shp1998"
        self.profile2.save()

        self.profile3 = User.objects.create_user(
            "sanghyeok-choi", "user3@s.com", "password3"
        ).profile
        self.profile3.nickname = "shc1998"
        self.profile3.save()

    def setup_modoom_data(self):
        create_modoom(self.profile1)
        self.refresh_all_from_db()

        enroll_modoom(self.profile2, 1)
        self.refresh_all_from_db()

        accept_modoomee(self.profile1, 1, self.profile2)
        self.refresh_all_from_db()

        create_modoom(self.profile2)
        self.refresh_all_from_db()

        enroll_modoom(self.profile1, 2)
        self.refresh_all_from_db()

        accept_modoomee(self.profile2, 2, self.profile1)
        self.refresh_all_from_db()

        create_modoom(self.profile3)
        self.refresh_all_from_db()

        enroll_modoom(self.profile1, 3)
        self.refresh_all_from_db()

        accept_modoomee(self.profile3, 3, self.profile1)
        self.refresh_all_from_db()

    def refresh_all_from_db(self):
        self.profile1.refresh_from_db()
        self.profile2.refresh_from_db()
        self.profile3.refresh_from_db()

    def test_count_unread_modoom_message(self):
        self.setup_modoom_data()

        mcr1 = ModoomChatRoom.objects.get(pk=1)
        mcr2 = ModoomChatRoom.objects.get(pk=2)

        mcrs1 = ModoomChatRoomStatus.objects.get(
            recipient=self.profile2, chat_room=mcr1
        )
        mcrs2 = ModoomChatRoomStatus.objects.get(
            recipient=self.profile2, chat_room=mcr2
        )

        ModoomMessage.objects.create(
            profile=self.profile2,
            chat_room=mcr1,
            content="mcr1-m1",
            position=mcr1.latest_position + 1,
        )
        mcr1.latest_position += 1
        mcr1.save()
        mcrs1.last_position = mcr1.latest_position
        mcrs1.save()

        enroll_modoom(self.profile3, 1)
        self.refresh_all_from_db()

        accept_modoomee(self.profile1, 1, self.profile3)
        self.refresh_all_from_db()

        mcr1.refresh_from_db()
        ModoomMessage.objects.create(
            profile=self.profile2,
            chat_room=mcr1,
            content="mcr1-m2",
            position=mcr1.latest_position + 1,
        )
        mcr1.latest_position += 1
        mcr1.save()
        mcrs1.last_position = mcr1.latest_position
        mcrs1.save()

        mcr2.refresh_from_db()
        ModoomMessage.objects.create(
            profile=self.profile2,
            chat_room=mcr2,
            content="mcr2-m1",
            position=mcr2.latest_position + 1,
        )
        mcr2.latest_position += 1
        mcr2.save()
        mcrs2.last_position = mcr2.latest_position
        mcrs2.save()

        notification1 = count_notifications(self.profile1).json()["data"]
        self.assertIs(notification1["modoom_chat"][0]["unread_count"], 5)
        self.assertIs(notification1["modoom_chat"][1]["unread_count"], 2)
        self.assertIs(notification1["n_unread_messages"], 8)

        notification2 = count_notifications(self.profile2).json()["data"]
        self.assertIs(notification2["modoom_chat"][0]["unread_count"], 0)
        self.assertIs(notification2["modoom_chat"][1]["unread_count"], 0)
        self.assertIs(notification2["n_unread_messages"], 0)

        notification3 = count_notifications(self.profile3).json()["data"]
        self.assertIs(notification3["modoom_chat"][0]["unread_count"], 2)
        self.assertIs(notification3["n_unread_messages"], 4)

    def test_count_unread_direct_message(self):
        create_direct_chatroom(self.profile1, self.profile3)
        create_direct_chatroom(self.profile2, self.profile3)

        dmr1 = DirectChatRoom.objects.get(pk=1)
        dmr2 = DirectChatRoom.objects.get(pk=2)

        dcrs1 = DirectChatRoomStatus.objects.get(
            recipient=self.profile1, chat_room=dmr1
        )
        dcrs2 = DirectChatRoomStatus.objects.get(
            recipient=self.profile2, chat_room=dmr2
        )

        DirectMessage.objects.create(
            profile=self.profile1,
            chat_room=dmr1,
            content="dmr1-m1",
            position=dmr1.latest_position + 1,
        )
        dmr1.latest_position += 1
        dmr1.save()
        dcrs1.last_position = dmr1.latest_position
        dcrs1.save()

        DirectMessage.objects.create(
            profile=self.profile2,
            chat_room=dmr2,
            content="dmr2-m1",
            position=dmr2.latest_position + 1,
        )
        dmr2.latest_position += 1
        dmr2.save()
        dcrs2.last_position = dmr2.latest_position
        dcrs2.save()

        c = Client()
        c.force_authenticate(self.profile3.user)
        results = c.get("/chats/direct/rooms/").json()["results"]
        participants = results[0]["chat_room"]["participants"][0]["nickname"]
        self.assertEqual(participants, "shp1998")  # 2 - 3 의 대화
        participants = results[1]["chat_room"]["participants"][0]["nickname"]
        self.assertEqual(participants, "jsp1998")  # 1 - 3 의 대화

        DirectMessage.objects.create(
            profile=self.profile1,
            chat_room=dmr1,
            content="dmr1-m2",
            position=dmr1.latest_position + 1,
        )
        dmr1.latest_position += 1
        dmr1.save()
        dcrs1.last_position = dmr1.latest_position
        dcrs1.save()

        c = Client()
        c.force_authenticate(self.profile3.user)
        results = c.get("/chats/direct/rooms/").json()["results"]
        participants = results[0]["chat_room"]["participants"][0]["nickname"]
        self.assertEqual(participants, "jsp1998")  # 1 - 3 의 대화
        participants = results[1]["chat_room"]["participants"][0]["nickname"]
        self.assertEqual(participants, "shp1998")  # 2 - 3 의 대화

        notification1 = count_notifications(self.profile1).json()["data"]
        self.assertIs(notification1["direct_chat"][0]["unread_count"], 0)
        self.assertIs(notification1["n_unread_messages"], 0)

        notification2 = count_notifications(self.profile2).json()["data"]
        self.assertIs(notification2["direct_chat"][0]["unread_count"], 0)
        self.assertIs(notification2["n_unread_messages"], 0)

        notification3 = count_notifications(self.profile3).json()["data"]
        self.assertIs(notification3["direct_chat"][0]["unread_count"], 2)
        self.assertIs(notification3["direct_chat"][1]["unread_count"], 1)
        self.assertIs(notification3["n_unread_messages"], 3)

    def test_ListModoomChatRooms(self):
        self.setup_modoom_data()
        c = Client()
        c.force_authenticate(self.profile1.user)
        res = c.get("/chats/modoom/rooms/")
        chat_room_title = res.json()["results"][0]["chat_room"]["modoom"]["title"]
        self.assertEqual(chat_room_title[1:8], self.profile3.nickname)  # 3
        chat_room_title = res.json()["results"][1]["chat_room"]["modoom"]["title"]
        self.assertEqual(chat_room_title[1:8], self.profile2.nickname)  # 2
        chat_room_title = res.json()["results"][2]["chat_room"]["modoom"]["title"]
        self.assertEqual(chat_room_title[1:8], self.profile1.nickname)  # 1

        mcr1 = ModoomChatRoom.objects.get(pk=1)
        mcr2 = ModoomChatRoom.objects.get(pk=2)
        mcr3 = ModoomChatRoom.objects.get(pk=3)

        mcrs1 = ModoomChatRoomStatus.objects.get(
            recipient=self.profile2, chat_room=mcr1
        )
        mcrs2 = ModoomChatRoomStatus.objects.get(
            recipient=self.profile2, chat_room=mcr2
        )

        ModoomMessage.objects.create(
            profile=self.profile2,
            chat_room=mcr1,
            content="mcr1-m1",
            position=mcr1.latest_position + 1,
        )
        mcr1.latest_position += 1
        mcr1.save()
        mcrs1.last_position = mcr1.latest_position
        mcrs1.save()

        ModoomMessage.objects.create(
            profile=self.profile2,
            chat_room=mcr2,
            content="mcr2-m1",
            position=mcr2.latest_position + 1,
        )
        mcr2.latest_position += 1
        mcr2.save()
        mcrs2.last_position = mcr2.latest_position
        mcrs2.save()

        res = c.get("/chats/modoom/rooms/")
        chat_room_title = res.json()["results"][0]["chat_room"]["modoom"]["title"]
        self.assertEqual(chat_room_title[1:8], self.profile2.nickname)  # 2
        chat_room_title = res.json()["results"][1]["chat_room"]["modoom"]["title"]
        self.assertEqual(chat_room_title[1:8], self.profile1.nickname)  # 1
        chat_room_title = res.json()["results"][2]["chat_room"]["modoom"]["title"]
        self.assertEqual(chat_room_title[1:8], self.profile3.nickname)  # 3

        # 1 모둠 종료
        first_modoom = self.profile1.modooms.first()
        res = c.patch(
            f"/modoom/{first_modoom.id}/",
            data=json.dumps({"ongoing": False}),
            content_type="application/json",
        )
        res = c.get("/chats/modoom/rooms/")
        chat_room_title = res.json()["results"][0]["chat_room"]["modoom"]["title"]
        self.assertEqual(chat_room_title[1:8], self.profile2.nickname)  # 2
        chat_room_title = res.json()["results"][1]["chat_room"]["modoom"]["title"]
        self.assertEqual(chat_room_title[1:8], self.profile3.nickname)  # 3


def create_direct_chatroom(me, you):
    c = Client()
    c.force_authenticate(me.user)
    return c.post(f"/chats/{you.nickname}/rooms/")


def chat_modoom(sender, chat_room):
    ModoomMessage.objects.create(
        profile=sender,
        chat_room=chat_room,
        content="mcr1-m2",
        position=chat_room.latest_position + 1,
    )
    chat_room.latest_position += 1
    chat_room.save()
