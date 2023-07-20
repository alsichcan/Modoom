from django.test import TestCase
from django.db import IntegrityError, transaction
from feeds.models import *
from users.models import *
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

    def create_and_join_modoom(self):
        self.modoom._open(self.profile1)
        self.modoom._enroll(self.profile2)
        self.modoom._accept(self.profile2)

    def refresh_profiles_from_db(self):
        """ Profile 객체의 속성값을 DB로부터 다시 가져온다. """
        self.profile1.refresh_from_db()
        self.profile2.refresh_from_db()
        self.profile3.refresh_from_db()

    def test_field_values_when_create_and_accept_enrollment(self):
        self.create_and_join_modoom()

        with self.assertRaises(IntegrityError):
            with transaction.atomic():
                self.modoom._open(self.profile1)

        self.modoom.refresh_from_db()
        self.assertIs(self.modoom.n_members, 2)

        for e in Enrollment.objects.all():
            self.assertIs(e.accepted, True)

        self.refresh_profiles_from_db()
        self.assertIs(self.profile1.n_modooms, 1)
        self.assertIs(self.profile2.n_modooms, 1)

    def test_modoom_deleted(self):
        self.modoom._open(self.profile1)
        self.modoom._enroll(self.profile2)
        c = Client()
        c.force_authenticate(self.profile1.user)
        res = c.delete(f"/modoom/{self.modoom.id}/")
        self.assertEqual(res.json()["success"], False)  # 가입 대기중인 사람이 있어서 삭제 불가

        # 가입 신청 거절
        res = c.delete(
            f"/modoom/{self.modoom.id}/enrollments/",
            data=json.dumps({"nickname": self.profile2.nickname}),
            content_type="application/json",
        )
        res = c.delete(f"/modoom/{self.modoom.id}/")
        for e in Enrollment.objects.all():  # 모든 enrollment가 삭제처리되는지 테스트
            self.assertIs(e.deleted, True)

        self.modoom.refresh_from_db()
        self.assertIs(self.modoom.ongoing, False)
        self.assertIs(self.modoom.recruit, False)

        # n_modooms가 잘 감소하는지 확인
        self.refresh_profiles_from_db()
        self.assertIs(self.profile1.n_modooms, 0)
        self.assertIs(self.profile2.n_modooms, 0)

    def test_field_values_wrt_modoomcomment(self):
        self.create_and_join_modoom()
        self.refresh_profiles_from_db()

        # 모둠 댓글
        comment1 = Comment.objects.create(
            modoom=self.modoom, profile=self.profile2, text="hi1"
        )
        comment2 = SubComment.objects.create(
            profile=self.profile1,
            text="hi2",
            comment=comment1,
        )

        self.modoom.refresh_from_db()
        self.assertIs(self.modoom.n_comments, 2)

        # 모둠 댓글 삭제
        comment1.deleted = True
        comment1.save()
        self.modoom.refresh_from_db()
        self.assertIs(self.modoom.n_comments, 1)  # 댓글 개수 감소
        comment1.refresh_from_db()
        self.assertEqual(comment1.text_show, "삭제된 댓글입니다")

    def test_field_values_wrt_modoomlike(self):
        self.create_and_join_modoom()
        self.refresh_profiles_from_db()

        # 모둠 찜하기
        self.modoom.likes.add(self.profile1)
        self.modoom.likes.add(self.profile2)

        self.refresh_profiles_from_db()
        self.assertIs(self.profile1.n_modoom_likes, 1)
        self.modoom.refresh_from_db()
        self.assertIs(self.modoom.n_likes, 2)

        # 모둠 찜하기 취소
        self.modoom.likes.remove(self.profile1)
        self.refresh_profiles_from_db()
        self.assertIs(self.profile1.n_modoom_likes, 0)
        self.modoom.refresh_from_db()
        self.assertIs(self.modoom.n_likes, 1)

        # 모둠 삭제
        self.modoom._delete()
        self.refresh_profiles_from_db()
        self.assertIs(self.profile2.n_modoom_likes, 0)

    def test_modoom_keyword(self):
        modoom1 = Modoom.objects.create(title="modoom1", profile=self.profile1)
        modoom2 = Modoom.objects.create(title="modoom2", profile=self.profile2)
        keyword1 = Keyword.objects.create(name="key1")
        keyword2 = Keyword.objects.create(name="key2")
        keyword3 = Keyword.objects.create(name="key3")
        keyword4 = Keyword.objects.create(name="key4")
        keyword5 = Keyword.objects.create(name="key5")
        keyword6 = Keyword.objects.create(name="key6")
        keyword7 = Keyword.objects.create(name="key7")
        keyword8 = Keyword.objects.create(name="key8")
        modoom1.keywords.add(keyword1, keyword2, keyword3, keyword4, keyword5, keyword6)
        modoom2.keywords.add(keyword2, keyword3)

        modoom1.refresh_from_db()
        modoom2.refresh_from_db()
        keyword1.refresh_from_db()
        keyword2.refresh_from_db()
        keyword3.refresh_from_db()

        self.assertIn(tuple([keyword1.name]), modoom1.keywords.values_list("name"))
        self.assertIn(tuple([keyword2.name]), modoom2.keywords.values_list("name"))
        self.assertNotIn(tuple([keyword7.name]), modoom1.keywords.values_list("name"))
        self.assertIn(modoom1, keyword1.modooms.all())
        self.assertIn(modoom2, keyword3.modooms.all())
        self.assertIs(keyword2.modooms.count(), 2)
        self.assertIs(keyword2.n_modooms, 2)

        # keyword 변경
        modoom1.keywords.remove(keyword1)
        modoom1.keywords.add(keyword3)

        modoom1.refresh_from_db()
        modoom2.refresh_from_db()
        keyword1.refresh_from_db()
        keyword2.refresh_from_db()
        keyword3.refresh_from_db()

        self.assertNotIn(modoom1, keyword1.modooms.all())
        self.assertIn(modoom1, keyword3.modooms.all())
        self.assertIs(keyword1.n_modooms, 0)
        self.assertIs(keyword3.n_modooms, 2)

        # 모둠 삭제
        modoom1.deleted = True
        modoom1.save()
        keyword3.refresh_from_db()
        self.assertIs(keyword3.n_modooms, 1)  # keyword를 remove 하지는 않음. 숫자는 알아서 감소함

    def test_keyword_with_other_objects(self):
        profile = User.objects.create(username="user").profile
        keyword = Keyword.objects.create(name="key")
        profile.keywords.add(keyword)

        profile.refresh_from_db()
        keyword.refresh_from_db()
        self.assertIn(tuple([keyword.name]), profile.keywords.values_list("name"))
        self.assertIn(profile, keyword.profiles.all())
        self.assertIs(keyword.n_profiles, 1)

        profile.keywords.remove(keyword)

        profile.refresh_from_db()
        keyword.refresh_from_db()
        self.assertNotIn(tuple([keyword.name]), profile.keywords.values_list("name"))
        self.assertIs(keyword.n_profiles, 0)

        keyword2 = Keyword.objects.create(name="key2")
        profile.keywords.add(keyword, keyword2)

        keyword2.refresh_from_db()
        self.assertIs(keyword2.n_profiles, 1)

        c = Client()
        c.force_authenticate(profile.user)
        res = c.delete(f"/users/{profile.nickname}/detail/")

        keyword2.refresh_from_db()
        self.assertIs(keyword2.n_profiles, 0)

    def test_keyword_page(self):
        modoom1 = Modoom.objects.create(title="modoom1")
        modoom2 = Modoom.objects.create(title="modoom2")

        keyword1 = Keyword.objects.create(name="key1")
        keyword2 = Keyword.objects.create(name="key2")

        modoom1.keywords.add(keyword1, keyword2)
        modoom2.keywords.add(keyword2)
        self.profile1.keywords.add(keyword1, keyword2)
        self.profile2.keywords.add(keyword2)

        modoom1.refresh_from_db()
        modoom2.refresh_from_db()
        self.profile1.refresh_from_db()
        self.profile2.refresh_from_db()
        keyword1.refresh_from_db()
        keyword2.refresh_from_db()

        # keyword 마다 모둠, 사람, 소통하기 개수 확인
        c = Client()
        c.force_authenticate(self.profile1.user)
        for obj in ["modooms/", "profiles/"]:
            for key in [keyword1, keyword2]:
                res = c.get("/keywords/" + key.name + "/" + obj)
                self.assertEqual(
                    len(res.json()["results"]), getattr(key, f"n_{obj[:-1]}")
                )

    def test_elements_in_modoom_list(self):
        self.create_and_join_modoom()

        keyword1 = Keyword.objects.create(name="key1")
        self.modoom.keywords.add(keyword1)

        c = Client()
        c.force_authenticate(self.profile1.user)
        res = c.get("/keywords/key1/modooms/")
        enrolls = res.json()["results"][0]["enrollments"]  # self.modoom의 enrollment 정보
        self.assertIs(len(enrolls), 2)

    def test_home_page(self):
        # 나의 모둠, 추천 모둠
        self.create_and_join_modoom()  # self.profile1, self.profile2, self.modoom
        keyword1 = Keyword.objects.create(name="key1")
        keyword2 = Keyword.objects.create(name="key2")
        self.profile1.keywords.add(keyword1)
        modoom1 = Modoom.objects.create(title="modoom1")
        modoom2 = Modoom.objects.create(title="modoom2")
        modoom3 = Modoom.objects.create(title="modoom3")
        modoom4 = Modoom.objects.create(title="modoom4")
        modoom1.keywords.add(keyword1)
        modoom2.keywords.add(keyword1, keyword2)
        modoom3.keywords.add(keyword2)
        modoom4.keywords.add(keyword2)

        Enrollment.objects.create(modoom=modoom3, profile=self.profile1, accepted=True)

        c = Client()
        c.force_authenticate(self.profile1.user)
        res1 = c.get(
            f"/{self.profile1.nickname}/modooms/?query=profile",
        )
        self.assertEqual(len(res1.json()["results"]), 2)  # 가입한 모둠 2개

        res2 = c.get("/home/")
        self.assertEqual(len(res2.json()["results"]), 5)

        # 피드 상세페이지
        res5 = c.get(f"/modoom/{res2.json()['results'][1]['id']}/")
        self.assertEqual(res5.json()["title"], "modoom3")

        # 친구추가
        from relationships.models import Friendship

        Friendship.objects.create(subject=self.profile2, object=self.profile1)
        Friendship.objects.create(subject=self.profile1, object=self.profile2)

        # 친구가 모둠 만듦
        modoom4 = Modoom.objects.create(title="friend's modoom", profile=self.profile2)
        modoom4._open(self.profile2)
        res_friend = c.get("/home/")
        self.assertEqual(res_friend.json()["results"][0]["title"], "friend's modoom")

    def test_CRUDL_modoom_post(self):
        c = Client()
        c.force_authenticate(self.profile1.user)
        # 모둠 만들기 (Create)
        res = c.post(
            "/modoom/",
            data=json.dumps(
                {
                    "title": "test",
                    "content": "test",
                    "accom": 5,
                    "keywords": ["snu", "test"],
                }
            ),
            content_type="application/json",
        )
        test_modoom = Modoom.objects.get(title="test")

        # 모둠 리스트 (List)
        res = c.get(f"/{self.profile1.nickname}/modooms/?query=profile")
        self.assertEqual(len(res.json()["results"]), 1)  # 모둠 개수 확인

        test_modoom2 = Modoom.objects.create(title="test2", ongoing=False)
        test_modoom2._open(self.profile1)
        res = c.get(f"/{self.profile1.nickname}/modooms/?query=profile")
        self.assertEqual(len(res.json()["results"]), 2)  # 모둠 개수 확인
        self.assertEqual(res.json()["results"][1]["title"], "test2")  # ongoing 순서 체크

        # 모둠 상세정보 (Retrieve)
        res = c.get(f"/modoom/{test_modoom.id}/")

        # 모둠 수정하기 (Update)
        res = c.patch(
            f"/modoom/{test_modoom.id}/",
            data=json.dumps({"keywords": ["snu", "test2", "test3"]}),
            content_type="application/json",
        )
        test_modoom.refresh_from_db()
        self.assertEqual(test_modoom.keywords.count(), 3)  # 키워드 개수가 정상적으로 수정되었는지 확인

        # 모둠원 추가
        c2 = Client()
        c2.force_authenticate(self.profile2.user)
        res2 = c2.post(
            f"/modoom/{test_modoom.id}/enroll/",
            data=json.dumps({"message": "들어가고 싶어요"}),
            content_type="application/json",
        )
        res = c.patch(
            f"/modoom/{test_modoom.id}/enrollments/",
            data=json.dumps({"nickname": self.profile2.nickname}),
            content_type="application/json",
        )

        # 모둠원의 모둠 수정 시도
        res2 = c2.patch(
            f"/modoom/{test_modoom.id}/",
            data=json.dumps({"keywords": ["snu", "test2", "test3"]}),
            content_type="application/json",
        )
        self.assertIs(res2.json()["success"], False)  # 실패

        # 모둠장의 모둠 삭제 시도 (Destroy)
        res = c.delete(f"/modoom/{test_modoom.id}/")
        self.assertIs(res.json()["success"], False)  # 실패

        # 모둠 종료
        res = c.patch(
            f"/modoom/{test_modoom.id}/",
            data=json.dumps({"ongoing": False}),
            content_type="application/json",
        )
        res = c.get(f"/{self.profile1.nickname}/modooms/?query=profile")
        self.assertEqual(len(res.json()["results"]), 2)  # 종료된 모둠 포함 2개

    def test_search(self):
        import time

        modoom1 = Modoom.objects.create(title="s3", content="s1 s2")
        time.sleep(0.001)
        modoom2 = Modoom.objects.create(title="s2", content="s1 s3 s4")
        time.sleep(0.001)
        modoom3 = Modoom.objects.create(title="s1 s2", content="s2 s3 s5")
        time.sleep(0.001)
        keyword1 = Keyword.objects.create(name="s1")
        keyword2 = Keyword.objects.create(name="s6")
        keyword3 = Keyword.objects.create(name="s7")
        keyword4 = Keyword.objects.create(name="s4")

        c = Client()
        c.force_authenticate(self.profile1.user)
        res1 = c.get(f"/search/?query=keywords&search=s1 s2")
        search_result1 = res1.json()["results"]
        self.assertIs(keyword1.id, search_result1[0]["id"])

        res2 = c.get(f"/search/?query=modooms&search=s1 s2")
        # 예상 결과 -> modoom3 > modoom2 > modoom1
        search_result2 = res2.json()["results"]
        self.assertIs(modoom3.id, search_result2[0]["id"])
        self.assertIs(modoom2.id, search_result2[1]["id"])
        self.assertIs(modoom1.id, search_result2[2]["id"])

        res3 = c.get(f"/search/?query=keywords&search=s2 s3 s5")
        search_result3 = res3.json()["results"]
        self.assertEqual(0, len(search_result3))

        res4 = c.get(f"/search/?query=modooms&search=s2 s3 s5")
        # 예상 결과 -> modoom3 > modoom2 > modoom1
        search_result4 = res4.json()["results"]
        self.assertIs(modoom3.id, search_result4[0]["id"])
        self.assertIs(modoom2.id, search_result4[1]["id"])
        self.assertIs(modoom1.id, search_result4[2]["id"])

        res5 = c.get(f"/search/?query=keywords&search=s4")
        search_result5 = res5.json()["results"]
        self.assertIs(keyword4.id, search_result5[0]["id"])

        res6 = c.get(f"/search/?query=modooms&search=s4")
        # 예상 결과 -> modoom2
        search_result6 = res6.json()["results"]
        self.assertIs(modoom2.id, search_result6[0]["id"])

        # 사람 검색
        res7 = c.get(f"/search/?query=profiles&search= ")
        self.assertIs(res7.json()["success"], False)
        res8 = c.get(f"/search/?query=profiles&search=us")
        self.assertIs(len(res8.json()["results"]), 3)

    def test_CRUDL_enrollment(self):
        c = Client()
        c.force_authenticate(self.profile1.user)
        # 모둠 만들기 (Create)
        res = c.post(
            "/modoom/",
            data=json.dumps(
                {
                    "title": "test",
                    "content": "test",
                    "accom": 3,
                    "keywords": ["snu", "test"],
                }
            ),
            content_type="application/json",
        )
        test_modoom = Modoom.objects.get(title="test")

        c2 = Client()
        c2.force_authenticate(self.profile2.user)

        def enroll(client, modoom):
            # 모둠 가입 신청 (Create)
            response = client.post(
                f"/modoom/{modoom.id}/enroll/",
                data=json.dumps({"message": "들어가고 싶어요"}),
                content_type="application/json",
            )
            return response

        res2 = enroll(c2, test_modoom)
        # 가입 신청 확인
        res = c.get(f"/modoom/{test_modoom.id}/enrollments/")
        self.assertEqual(
            res.json()["results"][1]["profile"]["nickname"], self.profile2.nickname
        )
        self.assertIs(res.json()["results"][1]["accepted"], False)
        self.assertIs(self.profile2.n_modooms, 0)

        applicant_name = res.json()["results"][1]["profile"]["nickname"]
        # 가입 신청 거절
        res = c.delete(
            f"/modoom/{test_modoom.id}/enrollments/",
            data=json.dumps({"nickname": applicant_name}),
            content_type="application/json",
        )

        # 모둠 가입 신청 (Create)
        res2 = enroll(c2, test_modoom)
        # 가입 신청 승인
        res = c.patch(
            f"/modoom/{test_modoom.id}/enrollments/",
            data=json.dumps({"nickname": applicant_name}),
            content_type="application/json",
        )
        # 가입 신청 승인 한 번 더 보내기
        res = c.patch(
            f"/modoom/{test_modoom.id}/enrollments/",
            data=json.dumps({"nickname": applicant_name}),
            content_type="application/json",
        )
        self.assertEqual(res.json()["success"], False)

        res = c.get(f"/modoom/{test_modoom.id}/enrollments/")
        self.assertIs(res.json()["results"][1]["accepted"], True)
        self.refresh_profiles_from_db()
        self.assertEqual(self.profile2.n_modooms, 1)
        test_modoom.refresh_from_db()
        self.assertEqual(test_modoom.n_members, 2)
        self.assertIs(test_modoom.deletable, False)
        self.assertIs(test_modoom.recruit, True)

        # 탈퇴
        res2 = c2.delete(f"/modoom/{test_modoom.id}/enroll/")
        self.refresh_profiles_from_db()
        self.assertEqual(self.profile2.n_modooms, 0)
        test_modoom.refresh_from_db()
        self.assertEqual(test_modoom.n_members, 1)
        self.assertIs(test_modoom.recruit, True)

        # 모둠장 탈퇴 시도
        res = c.delete(f"/modoom/{test_modoom.id}/enroll/")
        self.assertIs(res.json()["success"], False)
        test_modoom.refresh_from_db()
        self.assertEqual(test_modoom.n_members, 1)

        # 가입 신청하고 취소하기
        res2 = enroll(c2, test_modoom)
        self.refresh_profiles_from_db()
        self.assertIs(self.profile2.n_modooms, 0)
        res2 = c2.delete(f"/modooms/modoom/{test_modoom.id}/enroll/")
        self.refresh_profiles_from_db()
        self.assertIs(self.profile2.n_modooms, 0)

        # 가입 하고 강퇴하기
        res2 = enroll(c2, test_modoom)
        res = c.patch(
            f"/modoom/{test_modoom.id}/enrollments/",
            data=json.dumps({"nickname": applicant_name}),
            content_type="application/json",
        )  # 승인
        test_modoom.refresh_from_db()
        self.assertEqual(test_modoom.n_members, 2)
        self.refresh_profiles_from_db()
        self.assertEqual(self.profile2.n_modooms, 1)
        res = c.delete(
            f"/modoom/{test_modoom.id}/enrollments/",
            data=json.dumps({"nickname": test_modoom.profile.nickname, "kick": True}),
            content_type="application/json",
        )  # 모둠장이 셀프 강퇴 시도
        self.assertIs(res.json()["success"], False)
        res2 = c2.delete(
            f"/modoom/{test_modoom.id}/enrollments/",
            data=json.dumps({"nickname": test_modoom.profile.nickname, "kick": True}),
            content_type="application/json",
        )  # 모둠원이 모둠장 강퇴 시도
        self.assertIs(res2.json()["success"], False)
        res = c.delete(
            f"/modoom/{test_modoom.id}/enrollments/",
            data=json.dumps({"nickname": applicant_name, "kick": True}),
            content_type="application/json",
        )  # 강퇴
        self.assertEqual(res.json()["message"], "강퇴")
        test_modoom.refresh_from_db()
        self.assertEqual(test_modoom.n_members, 1)
        self.refresh_profiles_from_db()
        self.assertEqual(self.profile2.n_modooms, 0)

        # ---------------------------------------- #
        # 모둠 만들기
        res = c2.post(
            "/modoom/",
            data=json.dumps(
                {
                    "title": "test2",
                    "content": "test2",
                    "accom": 3,
                    "keywords": ["snu", "test2"],
                }
            ),
            content_type="application/json",
        )
        test_modoom2 = Modoom.objects.get(title="test2")
        c3 = Client()
        c3.force_authenticate(self.profile3.user)
        # 모둠 가입 신청 (Create)
        res2 = enroll(c2, test_modoom2)
        self.assertEqual(res2.json()["success"], False)
        res = enroll(c, test_modoom2)
        res3 = enroll(c3, test_modoom2)
        test_modoom2.refresh_from_db()
        self.assertEqual(test_modoom2.n_members, 1)
        self.refresh_profiles_from_db()
        self.assertEqual(self.profile3.n_modooms, 0)

        # 가입 신청 승인
        res2 = c2.patch(
            f"/modoom/{test_modoom2.id}/enrollments/",
            data=json.dumps({"nickname": self.profile3.nickname}),
            content_type="application/json",
        )
        res2 = c2.patch(
            f"/modoom/{test_modoom2.id}/enrollments/",
            data=json.dumps({"nickname": self.profile1.nickname}),
            content_type="application/json",
        )
        test_modoom2.refresh_from_db()
        self.assertEqual(test_modoom2.n_members, 3)
        self.refresh_profiles_from_db()
        self.assertEqual(self.profile3.n_modooms, 1)
        self.assertIs(test_modoom2.recruit, False)  # Full이라 False

        # profile2의 회원 탈퇴
        res2 = c2.delete(f"/users/{self.profile2.nickname}/detail/")
        test_modoom2.refresh_from_db()
        self.assertEqual(test_modoom2.n_members, 0)
        self.assertIs(test_modoom2.deleted, True)  # 모둠장이 탈퇴하면 그 모둠은 삭제
        self.assertIs(test_modoom2.ongoing, False)

    def test_likes(self):
        c = Client()
        c.force_authenticate(self.profile1.user)
        # 모둠 만들기 (Create)
        res = c.post(
            "/modoom/",
            data=json.dumps(
                {
                    "title": "test",
                    "content": "test",
                    "accom": 5,
                    "keywords": ["snu", "test"],
                }
            ),
            content_type="application/json",
        )
        test_modoom = Modoom.objects.get(title="test")

        c2 = Client()
        c2.force_authenticate(self.profile2.user)
        # 모둠 좋아요 (
        res2 = c2.post(f"/like/modoom/{test_modoom.id}/")
        test_modoom.refresh_from_db()
        self.assertEqual(test_modoom.n_likes, 1)

        # 모둠 좋아요 취소
        res2 = c2.post(f"/like/modoom/{test_modoom.id}/")
        test_modoom.refresh_from_db()
        self.assertEqual(res2.json()["data"]["n_likes"], 0)
        self.assertEqual(test_modoom.n_likes, 0)

    def test_comments(self):
        c = Client()
        c.force_authenticate(self.profile1.user)
        # 모둠 만들기 (Create)
        res = c.post(
            "/modoom/",
            data=json.dumps(
                {
                    "title": "test",
                    "content": "test",
                    "accom": 5,
                    "keywords": ["snu", "test"],
                }
            ),
            content_type="application/json",
        )
        test_modoom = Modoom.objects.get(title="test")

        # 댓글 달기
        c2 = Client()
        c2.force_authenticate(self.profile2.user)
        res2 = c2.post(
            f"/comment/modoom/{test_modoom.id}/",
            data=json.dumps({"text": "안녕하세요"}),
            content_type="application/json",
        )
        res2 = c2.get(f"/comment/modoom/{test_modoom.id}/")
        test_comment2 = res2.json()["results"][0]
        test_modoom.refresh_from_db()
        self.assertEqual(test_modoom.n_comments, 1)

        # 대댓글 달기
        res = c.post(
            f"/comment/comment/{test_comment2['id']}/",
            data=json.dumps({"text": "안녕하세용"}),
            content_type="application/json",
        )
        res = c.get(f"/comment/modoom/{test_modoom.id}/")
        test_comment = res.json()["results"][0]["subcomments"][0]
        test_modoom.refresh_from_db()
        self.assertEqual(test_modoom.n_comments, 2)

        # 댓글 좋아요
        res2 = c2.post(f"/like/comment/{test_comment['id']}/")  # 좋아요
        self.assertEqual(res2.json()["data"]["n_likes"], 1)
        res2 = c2.get(f"/comment/modoom/{test_modoom.id}/")
        self.assertIs(res2.json()["results"][0]["liked"], True)  # 이미 좋아요 눌렀음

        res2 = c2.post(f"/like/comment/{test_comment['id']}/")  # 좋아요 취소
        self.assertEqual(res2.json()["data"]["n_likes"], 0)
        res2 = c2.get(f"/comment/modoom/{test_modoom.id}/")
        self.assertIs(res2.json()["results"][0]["liked"], False)  # 취소됨

        # 댓글 불러오기
        res_detail = c.get(f"/modoom/{test_modoom.id}/")
        res_comment = c.get(f"/comment/modoom/{test_modoom.id}/")
        self.assertEqual(
            res_comment.json()["results"][0]["subcomments"][0]["text_show"], "안녕하세용"
        )

        # 댓글 삭제
        res2 = c2.delete(f"/comment/comment/{test_comment2['id']}/")
        res2_deleted = c2.get(f"/comment/modoom/{test_modoom.id}/")
        self.assertEqual(res2_deleted.json()["results"][0]["text_show"], "삭제된 댓글입니다")

        # 대댓글 삭제
        res = c.delete(f"/comment/subcomment/{test_comment['id']}/")
        res_deleted = c.get(f"/comment/modoom/{test_modoom.id}/")
        test_modoom.refresh_from_db()
        self.assertEqual(test_modoom.n_comments, 0)

    def test_n_views(self):
        c = Client()
        c.force_authenticate(self.profile1.user)
        # 모둠 만들기 (Create)
        res = c.post(
            "/modoom/",
            data=json.dumps(
                {
                    "title": "test",
                    "content": "test",
                    "accom": 5,
                    "keywords": ["snu", "test"],
                }
            ),
            content_type="application/json",
        )
        test_modoom = Modoom.objects.get(title="test")

        # 조회수
        res_view = c.get(f"/modoom/{test_modoom.id}/")
        res_view = c.get(f"/modoom/{test_modoom.id}/")
        res_view = c.get(f"/modoom/{test_modoom.id}/")
        res_view = c.get(f"/modoom/{test_modoom.id}/")
        res_view = c.get(f"/modoom/{test_modoom.id}/")
        self.assertEqual(res_view.json()["n_views"], 5)


"""
Test를 위한 helper method
"""


def create_modoom(me):
    c = Client()
    c.force_authenticate(me.user)
    message = "[%s]의 모둠 개설" % me.nickname
    url = "/modoom/"

    res = c.post(
        url,
        data=json.dumps(
            {"title": message, "content": "content", "accom": 5, "keywords": ["snu"]}
        ),
        content_type="application/json",
    )


def enroll_modoom(me, modoom_id):
    c = Client()
    c.force_authenticate(me.user)
    url = f"/modoom/{modoom_id}/enroll/"
    res = c.post(url)
    return res


def accept_modoomee(me, modoom_id, modoomee):
    c = Client()
    c.force_authenticate(me.user)
    url = f"/modoom/{modoom_id}/enrollments/"
    data = {"nickname": modoomee.nickname}
    res = c.patch(url, data)
    return res


def decline_modoomee(me, modoom_id, modoomee):
    c = Client()
    c.force_authenticate(me.user)
    url = f"/modoom/{modoom_id}/enrollments/"
    data = {"nickname": modoomee.nickname}
    res = c.patch(url, data)
    return res


def close_modoom(me, modoom_id):
    c = Client()
    c.force_authenticate(me.user)
    url = f"/modoom/{modoom_id}/"
    data = json.dumps({"ongoing": False})
    res = c.patch(url, data=data, content_type="application/json")
    return res


def comment_modoom(me, modoom_id):
    c = Client()
    c.force_authenticate(me.user)
    message = f"{me.nickname}의 모둠 {modoom_id}에 대한 댓글 작성"
    url = f"/comment/modoom/{modoom_id}/"

    res = c.post(
        url,
        data=json.dumps({"text": message}),
        content_type="application/json",
    )
    return res


def subcomment_modoom(me, comment_id):
    c = Client()
    c.force_authenticate(me.user)
    message = f"{me.nickname}의 댓글 {comment_id}에 대한 답글 작성"
    url = f"/comment/comment/{comment_id}/"

    res = c.post(
        url,
        data=json.dumps({"text": message}),
        content_type="application/json",
    )
    return res
