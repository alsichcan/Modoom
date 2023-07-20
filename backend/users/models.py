from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import (
    pre_save,
    post_save,
    pre_delete,
    post_delete,
    m2m_changed,
)
from django.db.models import F
from django.dispatch import receiver
import time
import os
import hashlib
from keywords.models import Keyword
from modoom_api.settings.base import SECRET_KEY
from django.contrib import admin
from django.contrib.admin.models import LogEntry
from feeds.utils import *
from django.core.validators import EmailValidator
import re


class TempUser(models.Model):
    """ 회원가입 전 이메일 인증 상태를 저장하기 위한 모델 """

    email = models.CharField(max_length=100, unique=True)
    verification_code = models.PositiveIntegerField()


class Profile(models.Model):
    """
    기본 User 모델을 확장하기 위한 Profile 모델.
    User를 생성/저장하면 Profile도 자동으로 생성/저장된다.
    """

    def get_screenshot_path(self, filepath):
        """
        이 함수의 위치를 바꾸지 말 것.

        파일 이름은 SECRET_KEY를 이용하여 해시한 뒤 마지막에 확장자를 붙여준다.
        hashed_filename의 고유성을 보장하기 위해 timestamp를 추가한다.

        :param filepath: "이미지파일.jpg" 형식의 String
        :return:
        """
        filename, ext = os.path.splitext(filepath)
        salted = filename + str(time.time()) + SECRET_KEY
        hashed_filename = hashlib.md5(salted.encode()).hexdigest()
        return "profiles/{}/{}".format(self.uid, hashed_filename + ext)

    # ----- Meta Data -----
    user = models.OneToOneField(
        User, on_delete=models.CASCADE, primary_key=True, related_name="profile"
    )
    uid = models.CharField(max_length=32)
    contact_info = models.CharField(
        max_length=50, null=True
    )  # Google Contacts로 크롤링한 필드 -- 사용자 노출 금지
    created_at = models.DateTimeField(auto_now_add=True, null=True)
    updated_at = models.DateTimeField(auto_now=True, null=True)
    zoom_url = models.CharField(max_length=200, blank=True)

    # ----- My Identity -----
    first_name = models.CharField(max_length=20, blank=True)
    last_name = models.CharField(max_length=20, blank=True)
    full_name = models.CharField(max_length=41, blank=True)
    nickname = models.CharField(max_length=50, blank=True, unique=True)
    image = models.ImageField(upload_to=get_screenshot_path, blank=True)
    bio = models.TextField(max_length=1000, blank=True)

    # ----- Email preference -----
    pref_email = models.EmailField(
        blank=True, validators=[EmailValidator("잘못된 이메일 형식입니다.")]
    )
    receive_enroll_mails = models.BooleanField(default=True)  # 가입 신청 / 수락 / 거절에 대한 메일
    receive_news_mails = models.BooleanField(default=True)  # 모둠 소식 메일

    # ----- My Keyword  -----
    keywords = models.ManyToManyField(Keyword, related_name="profiles", blank=True)

    # ----- My Reputation -----
    n_modoomees = models.PositiveSmallIntegerField(default=0)  # 함께한 모둠원 수
    n_friends = models.PositiveSmallIntegerField(default=0)  # 친구 수
    n_reviews_received = models.PositiveSmallIntegerField(default=0)  # 롤링페이퍼 수
    n_reviews_written = models.PositiveSmallIntegerField(default=0)  # 롤링페이퍼 수

    # ----- My Activity -----
    n_modooms = models.PositiveSmallIntegerField(default=0)  # 가입한 모둠 수

    # ----- My Bookmark -----
    n_modoom_likes = models.PositiveSmallIntegerField(default=0)  # 찜한 모둠 수

    reset_code = models.PositiveIntegerField(null=True)

    def __str__(self):
        return self.nickname


@admin.register(LogEntry)
class LogEntryAdmin(admin.ModelAdmin):
    readonly_fields = (
        "content_type",
        "user",
        "action_time",
        "object_id",
        "object_repr",
        "action_flag",
        "change_message",
    )

    def has_delete_permission(self, request, obj=None):
        return False

    def get_actions(self, request):
        actions = super(LogEntryAdmin, self).get_actions(request)
        # del actions["delete_selected"]
        return actions


@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    """ User가 생성되면 Profile도 자동 생성. 이때 UID를 추가한다. """
    if created:
        salted_pk = str(instance.pk) + SECRET_KEY
        md5 = hashlib.md5(salted_pk.encode()).hexdigest()
        Profile.objects.create(
            user=instance, nickname=f"default_{instance.pk}", uid=md5
        )


@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    """ User가 저장되면 Profile도 자동 저장 """
    instance.profile.save()


@receiver(post_delete, sender=Profile)
def post_delete_user(sender, instance, *args, **kwargs):
    """ Profile이 지워지면 User도 자동 삭제 """
    if instance.user:  # just in case user is not specified
        instance.user.delete()


@receiver(m2m_changed, sender=Profile.keywords.through)
def keyword_changed_profile(sender, instance, model, pk_set, action, **kwargs):
    if action in ["post_add", "post_remove"]:
        keywords = [model.objects.get(id=pk) for pk in pk_set]
        for k in keywords:
            k.n_profiles = k.profiles.count()
        model.objects.bulk_update(keywords, ["n_profiles"])


@receiver(pre_save, sender=Profile)
def pre_save_profile(sender, instance, **kwargs):
    """ Profile이 저장되면 pref_email, full_name update """
    if not instance.pref_email:
        instance.pref_email = instance.user.email
    instance.full_name = instance.last_name + instance.first_name
    is_eng_name = re.compile(r"^[a-zA-Z ]*$")
    if is_eng_name.match(instance.full_name):
        instance.full_name = instance.first_name + " " + instance.last_name
