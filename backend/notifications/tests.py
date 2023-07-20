from django.test import TestCase
from feeds.tests import *
from feeds.models import *
from notifications.models import *
from relationships.tests import *
from rest_framework.test import APIClient as Client

# Create your tests here.
class UserTestCase(TestCase):
    @classmethod
    def setUpTestData(cls):
        """
        ModoomTestCase를 실행하기 전에 딱 한번만 실행되는 메서드.
        모든 test_ 메서드에 대해 공유되므로 여기서 생성한 객체는 modify하지 말 것. (각 test_ 는 독립적이어야 함)
        """

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

        self.profile4 = User.objects.create_user(
            "jiwon-song", "user4@s.com", "password4"
        ).profile
        self.profile4.nickname = "jws1998"
        self.profile4.save()

    def setup_modoom_data(self):
        create_modoom(self.profile1)
        self.refresh_all_from_db()

        enroll_modoom(self.profile2, 1)
        self.refresh_all_from_db()

        accept_modoomee(self.profile1, 1, self.profile2)
        self.refresh_all_from_db()

        enroll_modoom(self.profile3, 1)
        self.refresh_all_from_db()

        accept_modoomee(self.profile1, 1, self.profile3)
        self.refresh_all_from_db()

        create_modoom(self.profile2)
        self.refresh_all_from_db()

        enroll_modoom(self.profile1, 2)
        self.refresh_all_from_db()

        accept_modoomee(self.profile2, 2, self.profile1)
        self.refresh_all_from_db()

        create_modoom(self.profile3)
        self.refresh_all_from_db()

        enroll_modoom(self.profile4, 3)
        self.refresh_all_from_db()

        accept_modoomee(self.profile3, 3, self.profile4)
        self.refresh_all_from_db()

    def refresh_all_from_db(self):
        self.profile1.refresh_from_db()
        self.profile2.refresh_from_db()
        self.profile3.refresh_from_db()
        self.profile4.refresh_from_db()

    def delete_all_notifications(self):
        list_notifications(self.profile1)
        delete_list_notifications(self.profile1)

        list_notifications(self.profile2)
        delete_list_notifications(self.profile2)

        list_notifications(self.profile3)
        delete_list_notifications(self.profile3)

        list_notifications(self.profile4)
        delete_list_notifications(self.profile4)

        self.refresh_all_from_db()

    def test_list_notifications(self):
        self.setup_modoom_data()

        self.refresh_all_from_db()
        self.assertIs(
            count_notifications(self.profile1).json()["data"]["n_notifications"], 5
        )
        res = list_notifications(self.profile1)
        self.assertIs(len(res.json()["results"]), 5)

        self.assertEqual(read_notification(self.profile1, 1).status_code, 200)
        self.refresh_all_from_db()
        self.assertIs(
            count_notifications(self.profile1).json()["data"]["n_notifications"], 4
        )
        res = list_notifications(self.profile1)
        self.assertIs(len(res.json()["results"]), 5)

        self.assertEqual(delete_notification(self.profile1, 3).status_code, 200)
        self.refresh_all_from_db()
        self.assertIs(
            count_notifications(self.profile1).json()["data"]["n_notifications"], 3
        )
        res = list_notifications(self.profile1)
        self.assertIs(len(res.json()["results"]), 4)

        self.assertEqual(read_list_notifications(self.profile1).status_code, 200)
        self.refresh_all_from_db()
        self.assertIs(
            count_notifications(self.profile1).json()["data"]["n_notifications"], 0
        )
        res = list_notifications(self.profile1)
        self.assertIs(len(res.json()["results"]), 4)

        self.assertEqual(delete_list_notifications(self.profile1).status_code, 200)
        self.refresh_all_from_db()
        self.assertIs(
            count_notifications(self.profile1).json()["data"]["n_notifications"], 0
        )
        res = list_notifications(self.profile1)
        self.assertIs(len(res.json()["results"]), 0)

    def test_modoom_comment_notification(self):
        self.setup_modoom_data()
        self.delete_all_notifications()

        self.assertEqual(comment_modoom(self.profile2, 1).status_code, 200)
        res = list_notifications(self.profile1)
        self.assertEqual(res.status_code, 200)
        self.assertEqual(
            res.json()["results"][0]["action"], Notification.Action.MODOOM_COMMENT
        )
        self.assertEqual(
            res.json()["results"][0]["description"],
            f"{self.profile2.nickname}의 모둠 1에 대한 댓글 작성",
        )
        self.assertIs(res.json()["results"][0]["target_id"], 1)

        self.assertEqual(comment_modoom(self.profile1, 1).status_code, 200)
        res = list_notifications(self.profile1)
        self.assertEqual(res.status_code, 200)
        self.assertIs(len(res.json()["results"]), 1)

    def test_comment_subcomment_notification(self):
        self.setup_modoom_data()
        self.delete_all_notifications()

        self.assertEqual(comment_modoom(self.profile2, 3).status_code, 200)

        self.assertEqual(subcomment_modoom(self.profile1, 1).status_code, 200)
        res = list_notifications(self.profile2)
        self.assertEqual(res.status_code, 200)
        self.assertEqual(
            res.json()["results"][0]["action"], Notification.Action.COMMENT_SUBCOMMENT
        )
        self.assertEqual(
            res.json()["results"][0]["description"],
            f"{self.profile1.nickname}의 댓글 1에 대한 답글 작성",
        )
        self.assertEqual(
            res.json()["results"][0]["target"],
            Notification.Target.MODOOM,
        )
        self.assertIs(res.json()["results"][0]["target_id"], 3)
        self.assertEqual(subcomment_modoom(self.profile2, 1).status_code, 200)
        res = list_notifications(self.profile2)
        self.assertEqual(res.status_code, 200)
        self.assertIs(len(res.json()["results"]), 1)

    def test_modoom_closed(self):
        self.setup_modoom_data()
        self.delete_all_notifications()

        self.assertEqual(close_modoom(self.profile1, 1).status_code, 200)

        res = list_notifications(self.profile1)
        self.assertEqual(
            res.json()["results"][0]["action"], Notification.Action.MODOOM_CLOSED
        )
        self.assertEqual(
            res.json()["results"][0]["description"],
            f"[{self.profile1.nickname}]의 모둠 개설",
        )
        self.assertEqual(
            res.json()["results"][0]["target"],
            Notification.Target.CHAT,
        )

        res = list_notifications(self.profile2)
        self.assertEqual(
            res.json()["results"][0]["action"], Notification.Action.MODOOM_CLOSED
        )
        self.assertEqual(
            res.json()["results"][0]["description"],
            f"[{self.profile1.nickname}]의 모둠 개설",
        )
        self.assertEqual(
            res.json()["results"][0]["target"],
            Notification.Target.CHAT,
        )

    def test_review_notification(self):
        self.setup_modoom_data()
        self.delete_all_notifications()

        self.assertEqual(write_review(self.profile1, self.profile2, 1).status_code, 200)

        res = list_notifications(self.profile2)
        self.assertEqual(
            res.json()["results"][1]["action"], Notification.Action.REVIEW_RECEIVED
        )
        self.assertEqual(
            res.json()["results"][1]["description"],
            f"모둠 [1] 리뷰 작성: [{self.profile1.nickname}] -> [{self.profile2.nickname}]",
        )
        self.assertEqual(
            res.json()["results"][1]["target"],
            Notification.Target.REVIEW_RECEIVED,
        )
        self.assertEqual(
            res.json()["results"][0]["action"], Notification.Action.REVIEW_WRITE
        )
        self.assertEqual(
            res.json()["results"][0]["target"],
            Notification.Target.REVIEW_WRITE,
        )

    def test_friend_request_notification(self):
        self.delete_all_notifications()

        self.assertEqual(
            send_friend_request(self.profile1, self.profile3).status_code, 200
        )
        self.assertEqual(
            send_friend_request(self.profile2, self.profile3).status_code, 200
        )

        res = list_notifications(self.profile3)
        self.assertEqual(
            res.json()["results"][0]["action"],
            Notification.Action.FRIEND_REQUEST_RECEIVED,
        )
        self.assertEqual(
            res.json()["results"][0]["target"],
            Notification.Target.PROFILE,
        )
        self.assertEqual(
            res.json()["results"][1]["action"],
            Notification.Action.FRIEND_REQUEST_RECEIVED,
        )
        self.assertEqual(
            res.json()["results"][0]["target"],
            Notification.Target.PROFILE,
        )

        self.assertEqual(
            accept_friend_request(self.profile3, self.profile1).status_code, 200
        )
        self.assertEqual(
            decline_friend_request(self.profile3, self.profile2).status_code, 200
        )
        self.assertEqual(
            list_notifications(self.profile1).json()["results"][0]["action"],
            Notification.Action.FRIEND_REQUEST_ACCEPTED,
        )
        self.assertEqual(
            list_notifications(self.profile1).json()["results"][0]["target"],
            Notification.Target.PROFILE,
        )


"""
Test를 위한 helper method
"""


def count_notifications(me):
    c = Client()
    c.force_authenticate(me.user)
    url = f"/notifications/count/"
    res = c.get(url)
    return res


def list_notifications(me):
    c = Client()
    c.force_authenticate(me.user)
    url = f"/notifications/list/"
    res = c.get(url)
    return res


def read_list_notifications(me):
    c = Client()
    c.force_authenticate(me.user)
    url = f"/notifications/read/"
    res = c.patch(url)
    return res


def delete_list_notifications(me):
    c = Client()
    c.force_authenticate(me.user)
    url = f"/notifications/delete/"
    res = c.patch(url)
    return res


def read_notification(me, notification_id):
    c = Client()
    c.force_authenticate(me.user)
    url = f"/notifications/read/{notification_id}/"
    res = c.patch(url)
    return res


def delete_notification(me, notification_id):
    c = Client()
    c.force_authenticate(me.user)
    url = f"/notifications/delete/{notification_id}/"
    res = c.patch(url)
    return res
