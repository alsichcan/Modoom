from feeds.tests import *
from users.tests import *
from relationships.models import *
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

    def refresh_all_from_db(self):
        self.profile1.refresh_from_db()
        self.profile2.refresh_from_db()
        self.profile3.refresh_from_db()
        self.profile4.refresh_from_db()

    def test_list_modoomees(self):
        self.setup_modoom_data()

        res1 = get_profile(self.profile1)
        res2 = get_profile(self.profile2)
        res3 = get_profile(self.profile3)

        self.assertIs(res1.json()["n_modoomees"], 2)
        self.assertIs(res2.json()["n_modoomees"], 2)
        self.assertIs(res3.json()["n_modoomees"], 2)

        self.assertIs(len(list_modoomees(self.profile1).json()["results"]), 2)
        self.assertIs(len(list_modoomees(self.profile2).json()["results"]), 2)
        self.assertIs(len(list_modoomees(self.profile3).json()["results"]), 2)

    def test_list_reviews_received(self):
        self.setup_modoom_data()

        self.assertEqual(write_review(self.profile1, self.profile2, 1).status_code, 200)
        self.assertEqual(write_review(self.profile1, self.profile2, 2).status_code, 200)
        self.assertEqual(write_review(self.profile2, self.profile1, 1).status_code, 200)
        self.assertEqual(write_review(self.profile2, self.profile1, 2).status_code, 200)
        self.assertEqual(write_review(self.profile3, self.profile1, 1).status_code, 200)

        res1 = get_profile(self.profile1)
        self.assertEqual(res1.status_code, 200)
        # self.assertIs(res1.json()["n_reviews_written"], 2)
        self.assertIs(res1.json()["n_reviews_received"], 3)

        self.assertIs(len(list_reviews_received(self.profile1).json()["results"]), 3)
        self.assertIs(len(list_reviews_received(self.profile2).json()["results"]), 2)
        self.assertIs(len(list_reviews_received(self.profile3).json()["results"]), 0)

    def test_list_reviews_writable(self):
        self.setup_modoom_data()

        self.assertEqual(write_review(self.profile1, self.profile2, 1).status_code, 200)
        self.assertEqual(write_review(self.profile1, self.profile2, 2).status_code, 200)
        self.assertEqual(write_review(self.profile2, self.profile1, 1).status_code, 200)
        self.assertEqual(write_review(self.profile2, self.profile1, 2).status_code, 200)
        self.assertEqual(write_review(self.profile3, self.profile1, 1).status_code, 200)

        self.assertIs(len(list_reviews_writable_me(self.profile1).json()["results"]), 3)
        self.assertIsNone(
            list_reviews_writable_me(self.profile1).json()["results"][1]["review"]
        )
        self.assertIsNotNone(
            list_reviews_writable_me(self.profile1).json()["results"][0]["review"]
        )
        self.assertIsNotNone(
            list_reviews_writable_me(self.profile1).json()["results"][2]["review"]
        )
        self.assertIs(len(list_reviews_writable_me(self.profile2).json()["results"]), 3)
        self.assertIs(len(list_reviews_writable_me(self.profile3).json()["results"]), 2)
        self.assertIs(len(list_reviews_writable_me(self.profile4).json()["results"]), 0)

        self.assertIs(
            len(
                list_reviews_writable_you(self.profile1, self.profile2).json()[
                    "results"
                ]
            ),
            2,
        )
        self.assertIsNotNone(
            list_reviews_writable_you(self.profile1, self.profile2).json()["results"][
                0
            ]["review"]
        )
        self.assertIsNotNone(
            list_reviews_writable_you(self.profile1, self.profile2).json()["results"][
                1
            ]["review"]
        )
        self.assertIs(
            len(
                list_reviews_writable_you(self.profile1, self.profile3).json()[
                    "results"
                ]
            ),
            1,
        )
        self.assertIsNone(
            list_reviews_writable_you(self.profile1, self.profile3).json()["results"][
                0
            ]["review"]
        )
        self.assertIs(
            len(
                list_reviews_writable_you(self.profile1, self.profile4).json()[
                    "results"
                ]
            ),
            0,
        )

    def test_create_review(self):
        self.setup_modoom_data()

        self.assertEqual(write_review(self.profile1, self.profile2, 1).status_code, 200)
        self.assertEqual(write_review(self.profile1, self.profile2, 2).status_code, 200)
        self.assertEqual(
            write_review(self.profile1, self.profile2, 1).status_code, 404
        )  # Must be Error
        self.assertEqual(
            write_review(self.profile1, self.profile4, 1).status_code, 404
        )  # Must be Error
        self.assertEqual(
            write_review(self.profile1, self.profile2, 3).status_code, 404
        )  # Must be Error

        self.assertIs(len(list_reviews_writable_me(self.profile1).json()["results"]), 3)
        self.assertIsNone(
            list_reviews_writable_me(self.profile1).json()["results"][1]["review"]
        )
        self.assertIsNotNone(
            list_reviews_writable_me(self.profile1).json()["results"][0]["review"]
        )
        self.assertIsNotNone(
            list_reviews_writable_me(self.profile1).json()["results"][2]["review"]
        )
        self.assertIs(len(list_reviews_received(self.profile2).json()["results"]), 2)
        self.assertIs(len(list_reviews_received(self.profile3).json()["results"]), 0)
        self.assertIs(len(list_reviews_received(self.profile4).json()["results"]), 0)

    def test_list_friends(self):
        self.assertEqual(
            send_friend_request(self.profile1, self.profile2).status_code, 200
        )
        self.assertEqual(
            accept_friend_request(self.profile2, self.profile1).status_code, 200
        )
        res1 = get_profile(self.profile1)
        res2 = get_profile(self.profile2)
        self.assertIs(res1.json()["n_friends"], 1)
        self.assertIs(res2.json()["n_friends"], 1)
        self.assertIs(len(list_friends(self.profile1).json()["results"]), 1)
        self.assertIs(len(list_friends(self.profile2).json()["results"]), 1)

        self.refresh_all_from_db()

        self.assertEqual(
            destroy_friendship(self.profile1, self.profile2).status_code, 200
        )
        res1 = get_profile(self.profile1)
        res2 = get_profile(self.profile2)
        self.assertIs(res1.json()["n_friends"], 0)
        self.assertIs(res2.json()["n_friends"], 0)
        self.assertIs(len(list_friends(self.profile1).json()["results"]), 0)
        self.assertIs(len(list_friends(self.profile2).json()["results"]), 0)

    def test_send_friend_request(self):
        self.assertEqual(
            send_friend_request(self.profile1, self.profile2).status_code, 200
        )
        self.assertIs(
            retrieve_friendship(self.profile1, self.profile2).json()["data"]["type"], 1
        )
        self.assertIs(
            retrieve_friendship(self.profile2, self.profile1).json()["data"]["type"], 2
        )

        self.assertEqual(
            send_friend_request(self.profile1, self.profile2).status_code, 403
        )  # Must be Error
        self.assertEqual(
            send_friend_request(self.profile2, self.profile1).status_code, 403
        )  # Must be Error
        self.assertEqual(
            accept_friend_request(self.profile2, self.profile1).status_code, 200
        )
        self.assertEqual(
            send_friend_request(self.profile1, self.profile2).status_code, 403
        )  # Must be Error
        self.assertEqual(
            send_friend_request(self.profile2, self.profile1).status_code, 403
        )  # Must be Error

    def test_cancel_friend_request(self):
        self.assertEqual(
            send_friend_request(self.profile1, self.profile2).status_code, 200
        )
        self.assertEqual(
            cancel_friend_request(self.profile2, self.profile1).status_code, 404
        )  # Must be Error
        self.assertEqual(
            cancel_friend_request(self.profile1, self.profile2).status_code, 200
        )

        self.assertIs(
            retrieve_friendship(self.profile1, self.profile2).json()["data"]["type"], 3
        )
        self.assertEqual(
            accept_friend_request(self.profile2, self.profile1).status_code, 404
        )  # Must be Error
        self.assertEqual(
            cancel_friend_request(self.profile1, self.profile2).status_code, 404
        )  # Must be Error
        self.assertEqual(
            decline_friend_request(self.profile2, self.profile1).status_code, 404
        )  # Must be Error
        self.assertEqual(
            send_friend_request(self.profile1, self.profile2).status_code, 200
        )

    def test_accept_friend_request(self):
        self.assertEqual(
            send_friend_request(self.profile1, self.profile2).status_code, 200
        )
        self.assertEqual(
            accept_friend_request(self.profile1, self.profile2).status_code, 404
        )  # Must be Error
        self.assertEqual(
            accept_friend_request(self.profile2, self.profile1).status_code, 200
        )

        self.assertIs(
            retrieve_friendship(self.profile1, self.profile2).json()["data"]["type"], 0
        )
        self.assertEqual(
            accept_friend_request(self.profile2, self.profile1).status_code, 404
        )  # Must be Error
        self.assertEqual(
            cancel_friend_request(self.profile1, self.profile2).status_code, 404
        )  # Must be Error
        self.assertEqual(
            decline_friend_request(self.profile1, self.profile2).status_code, 404
        )  # Must be Error

        self.assertEqual(
            send_friend_request(self.profile1, self.profile2).status_code, 403
        )  # Must be Error
        self.assertEqual(
            send_friend_request(self.profile2, self.profile1).status_code, 403
        )  # Must be Error

    def test_decline_friend_request(self):
        self.assertEqual(
            send_friend_request(self.profile1, self.profile2).status_code, 200
        )
        self.assertEqual(
            decline_friend_request(self.profile1, self.profile2).status_code, 404
        )  # Must be Error
        self.assertEqual(
            decline_friend_request(self.profile2, self.profile1).status_code, 200
        )

        self.assertIs(
            retrieve_friendship(self.profile1, self.profile2).json()["data"]["type"], 3
        )

        self.assertEqual(
            accept_friend_request(self.profile2, self.profile1).status_code, 404
        )  # Must be Error
        self.assertEqual(
            cancel_friend_request(self.profile1, self.profile2).status_code, 404
        )  # Must be Error
        self.assertEqual(
            decline_friend_request(self.profile1, self.profile2).status_code, 404
        )  # Must be Error

        self.assertEqual(
            send_friend_request(self.profile2, self.profile1).status_code, 200
        )

    def test_retrieve_friendship(self):
        self.assertEqual(
            send_friend_request(self.profile1, self.profile2).status_code, 200
        )
        self.assertEqual(
            accept_friend_request(self.profile2, self.profile1).status_code, 200
        )
        self.assertEqual(
            retrieve_friendship(self.profile1, self.profile2).json()["data"]["type"], 0
        )
        self.assertEqual(
            retrieve_friendship(self.profile2, self.profile1).json()["data"]["type"], 0
        )

    def test_destroy_friendship(self):
        self.assertEqual(
            send_friend_request(self.profile1, self.profile2).status_code, 200
        )
        self.assertEqual(
            accept_friend_request(self.profile2, self.profile1).status_code, 200
        )

        self.refresh_all_from_db()

        self.assertEqual(
            destroy_friendship(self.profile1, self.profile2).status_code, 200
        )
        self.assertEqual(
            destroy_friendship(self.profile2, self.profile1).status_code, 404
        )  # Must be Error
        self.assertIs(
            retrieve_friendship(self.profile1, self.profile2).json()["data"]["type"], 3
        )
        self.assertEqual(
            retrieve_friendship(self.profile2, self.profile1).json()["data"]["type"], 3
        )


"""
Test를 위한 helper method
"""


def list_friends(profile):
    c = Client()
    c.force_authenticate(profile.user)
    res = c.get(f"/relationships/{profile.nickname}/friends/")
    return res


def list_modoomees(profile):
    c = Client()
    c.force_authenticate(profile.user)
    res = c.get(f"/relationships/{profile.nickname}/modoomees/")
    return res


def list_reviews_received(profile):
    c = Client()
    c.force_authenticate(profile.user)
    res = c.get(f"/relationships/{profile.nickname}/reviews/")
    return res


def write_review(me, you, modoom_id):
    c = Client()
    c.force_authenticate(me.user)
    message = "모둠 [%d] 리뷰 작성: [%s] -> [%s]" % (modoom_id, me.nickname, you.nickname)
    data = {
        "message": message,
        "rating": 1,
        "modoom_id": modoom_id,
        "modoom_title": f"모둠 {modoom_id}",
    }
    res = c.post(f"/relationships/{you.nickname}/review/", data)
    return res


def list_reviews_writable_me(me):
    c = Client()
    c.force_authenticate(me.user)
    res = c.get(f"/relationships/{me.nickname}/review/")
    return res


def list_reviews_writable_you(me, you):
    c = Client()
    c.force_authenticate(me.user)
    res = c.get(f"/relationships/{you.nickname}/review/")
    return res


def send_friend_request(me, you):
    c = Client()
    c.force_authenticate(me.user)
    res = c.post(f"/relationships/friend/request/{you.nickname}/send/")
    return res


def cancel_friend_request(me, you):
    c = Client()
    c.force_authenticate(me.user)
    res = c.delete(f"/relationships/friend/request/{you.nickname}/cancel/")
    return res


def accept_friend_request(me, you):
    c = Client()
    c.force_authenticate(me.user)
    res = c.delete(f"/relationships/friend/request/{you.nickname}/accept/")
    return res


def decline_friend_request(me, you):
    c = Client()
    c.force_authenticate(me.user)
    res = c.delete(f"/relationships/friend/request/{you.nickname}/decline/")
    return res


def retrieve_friendship(me, you):
    c = Client()
    c.force_authenticate(me.user)
    res = c.get(f"/relationships/friend/{you.nickname}/")
    return res


def destroy_friendship(me, you):
    c = Client()
    c.force_authenticate(me.user)
    res = c.delete(f"/relationships/friend/{you.nickname}/")
    return res
