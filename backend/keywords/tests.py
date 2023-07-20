from django.test import TestCase
from users.models import *
from feeds.models import *
from keywords.models import *

from rest_framework.test import APIClient as Client
import json


class ModoomTestCase(TestCase):
    @classmethod
    def setUpTestData(cls):
        """
        ModoomTestCase를 실행하기 전에 딱 한번만 실행되는 메서드.
        모든 test_ 메서드에 대해 공유되므로 여기서 생성한 객체는 modify하지 말 것. (각 test_ 는 독립적이어야 함)
        """

    def setUp(self) -> None:
        """ 각 test_ 메서드를 실행할 때마다 실행되는 메서드 """
        self.profile1 = User.objects.create_user(
            "user1",
            "user1@s.com",
            "password1",
        ).profile
        self.profile1.nickname = "user1"
        self.profile1.save()

        self.profile2 = User.objects.create_user(
            "user2",
            "user2@s.com",
            "password2",
        ).profile
        self.profile2.nickname = "user2"
        self.profile2.save()

        self.profile3 = User.objects.create_user(
            "user3",
            "user3@s.com",
            "password3",
        ).profile
        self.profile3.nickname = "user3"
        self.profile3.save()

        self.modoom = Modoom.objects.create(title="테스트 모둠", profile=self.profile1)

    def test_explore(self):
        keyword1 = Keyword.objects.create(name="key1")
        keyword2 = Keyword.objects.create(name="key2")
        keyword3 = Keyword.objects.create(name="key3")
        keyword4 = Keyword.objects.create(name="key4")
        modoom1 = Modoom.objects.create(title="s3", content="s1 s2")
        modoom2 = Modoom.objects.create(title="s2", content="s1 s3 s4")
        modoom3 = Modoom.objects.create(title="s1 s2", content="s2 s3 s5")

        modoom1.keywords.add(keyword1)
        modoom2.keywords.add(keyword1, keyword3)
        modoom3.keywords.add(keyword1, keyword2, keyword3)

        # 탐색 키워드 인기순 정렬
        c = Client()
        c.force_authenticate(self.profile1.user)
        res = c.get("/keywords/")
        self.assertEqual(res.json()["results"][0]["name"], "key1")
        self.assertEqual(res.json()["results"][1]["name"], "key3")

    def test_keywords_group(self):
        key_group1 = KeywordGroup.objects.create(name="key_group1", custom_order=2)
        key_group2 = KeywordGroup.objects.create(name="key_group2", custom_order=1)
        keyword1 = Keyword.objects.create(name="key1")
        keyword1.keyword_group.add(key_group1)
        keyword2 = Keyword.objects.create(name="key2")
        keyword2.keyword_group.add(key_group2)
        keyword3 = Keyword.objects.create(name="key3")
        keyword3.keyword_group.add(key_group1, key_group2)
        keyword4 = Keyword.objects.create(name="key4")
        keyword4.keyword_group.add(key_group1)

        modoom1 = Modoom.objects.create(title="s3", content="s1 s2")
        modoom2 = Modoom.objects.create(title="s2", content="s1 s3 s4")
        modoom3 = Modoom.objects.create(title="s1 s2", content="s2 s3 s5")

        modoom1.keywords.add(keyword1)
        modoom2.keywords.add(keyword1, keyword3)
        modoom3.keywords.add(keyword1, keyword2, keyword3)

        c = Client()
        c.force_authenticate(self.profile1.user)
        res = c.get("/keywords/groups/")
        self.assertEqual(len(res.json()["results"][0]["keywords"]), 2)  # keyword_group2
        self.assertEqual(len(res.json()["results"][1]["keywords"]), 3)  # keyword_group1
