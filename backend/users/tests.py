from django.test import TestCase
from users.models import *
from feeds.models import *
from rest_framework.test import APIClient as Client
import json


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

        self.keyword1 = Keyword.objects.create(name="서울대")
        self.keyword2 = Keyword.objects.create(name="스타트업")
        self.keyword3 = Keyword.objects.create(name="운동")
        self.keyword4 = Keyword.objects.create(name="컴공")

        self.profile1.keywords.add(
            self.keyword1, self.keyword2, self.keyword3, self.keyword4
        )

        self.modoom1 = Modoom.objects.create(title="모둠을 만드는 사람들", profile=self.profile1)
        self.modoom1._open(self.profile1)

        self.modoom2 = Modoom.objects.create(title="굿모닝 3km", profile=self.profile2)
        self.modoom2._open(self.profile2)

        self.modoom3 = Modoom.objects.create(
            title="논리설계 같이 들으실분", profile=self.profile1
        )
        self.modoom3._open(self.profile1)

        self.modoom1._enroll(self.profile2)
        self.modoom1._accept(self.profile2)

        self.profile1.refresh_from_db()
        self.profile2.refresh_from_db()

        self.modoom1.refresh_from_db()
        self.modoom2.refresh_from_db()
        self.modoom3.refresh_from_db()

    def test_get_profile(self):
        c = Client()
        c.force_authenticate(self.profile2.user)
        url = f"/users/{self.profile1.nickname}/detail/"
        res = c.get(url)
        self.assertIs(res.json()["n_modooms"], 2)
        self.assertIs(len(res.json()["keywords"]), 4)

    def test_get_profile_error(self):
        c = Client()
        c.force_authenticate(self.profile2.user)
        url = "/users/somebody/detail/"
        res = c.get(url)
        self.assertEqual(res.status_code, 404)

    def test_put_profile(self):
        c = Client()
        c.force_authenticate(self.profile1.user)
        url = f"/users/{self.profile1.nickname}/detail/"
        bio = f"내 이름은 {self.profile1.nickname}이다."
        data = {"bio": bio}
        res = c.put(url, data)
        self.assertEqual(res.status_code, 405)

    def test_patch_profile(self):
        c = Client()
        c.force_authenticate(self.profile1.user)
        url = f"/users/{self.profile1.nickname}/detail/"
        bio = f"내 이름은 {self.profile1.nickname}이다."
        data = {
            "nickname": self.profile1.nickname,
            "bio": bio,
            "keywords": ["서울대", "스타트업", "운동", "컴공"],
        }
        res = c.patch(url, data=json.dumps(data), content_type="application/json")
        self.assertEqual(res.json()["bio"], bio)

    def test_patch_profile_error(self):
        c = Client()
        c.force_authenticate(self.profile1.user)
        url = f"/users/{self.profile2.nickname}/detail/"
        bio = f"내 이름은 {self.profile1.nickname}이다."
        data = {"bio": bio}
        res = c.patch(url, data)
        self.assertEqual(res.status_code, 403)
        res = c.get(url)
        self.assertEqual(res.json()["bio"], "")

    def test_withdrawal(self):
        c = Client()
        c.force_authenticate(self.profile1.user)
        c2 = Client()
        c2.force_authenticate(self.profile2.user)
        # 댓글 달기
        res = c.post(
            f"/comment/modoom/{self.modoom2.id}/",
            data=json.dumps({"text": "안녕하세용"}),
            content_type="application/json",
        )
        res = c.get(f"/comment/modoom/{self.modoom2.id}/")
        test_comment = res.json()["results"][0]
        self.modoom2.refresh_from_db()
        self.assertEqual(self.modoom2.n_comments, 1)

        res2 = c2.post(
            f"/comment/comment/{test_comment['id']}/",
            data=json.dumps({"text": "안녕하세요"}),
            content_type="application/json",
        )
        res2 = c2.get(f"/comment/modoom/{self.modoom2.id}/")
        test_comment2 = res2.json()["results"][0]["subcomments"][0]
        self.modoom2.refresh_from_db()
        self.assertEqual(self.modoom2.n_comments, 2)

        res = c.get(f"/{self.profile1.nickname}/modooms/?query=profile")
        self.assertEqual(len(res.json()["results"]), 2)
        res = c.delete(f"/users/{self.profile1.nickname}/detail/")

        res2 = c2.get(f"/comment/modoom/{self.modoom2.id}/")
        check_comment = res2.json()["results"][0]
        self.assertEqual(check_comment["text_show"], "삭제된 댓글입니다")
        self.assertEqual(check_comment["subcomments"][0]["text_show"], "안녕하세요")

        res = c2.get(f"/{self.profile2.nickname}/modooms/?query=profile")
        self.assertEqual(len(res.json()["results"]), 1)


def get_profile(profile):
    c = Client()
    c.force_authenticate(profile.user)
    url = "/users/%s/detail/" % profile.nickname
    return c.get(url)
