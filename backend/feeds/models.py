from django.db import models
from django.db.models.signals import (
    pre_save,
    post_save,
    pre_delete,
    post_delete,
    m2m_changed,
)
from django.db.models import F
from django.dispatch import receiver
from users.models import Profile
from keywords.models import Keyword
from feeds.utils import *


# -------------------- 모둠 -------------------- #
class Modoom(models.Model):
    """ 모둠 """

    profile = models.ForeignKey(
        Profile, related_name="modooms", on_delete=models.SET_NULL, null=True
    )
    title = models.CharField(max_length=40, blank=True)
    content = models.TextField(blank=True)
    image = models.ImageField(upload_to="modoom_img", blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True, null=True)
    keywords = models.ManyToManyField(Keyword, related_name="modooms")
    likes = models.ManyToManyField(Profile, related_name="liked_modooms", blank=True)

    start_at = models.DateField(null=True)
    end_at = models.DateField(null=True)
    accom = models.PositiveSmallIntegerField(default=6)  # 희망 정원
    location = models.CharField(max_length=20, blank=True)

    recruit = models.BooleanField(default=True)  # 모집중/모집완료
    ongoing = models.BooleanField(default=True)  # 진행중/종료됨
    deletable = models.BooleanField(default=True)  # deletable 모둠 여부
    deleted = models.BooleanField(default=False)  # 삭제 여부

    # ----- Derived attributes -----
    n_comments = models.PositiveSmallIntegerField(default=0)
    n_likes = models.PositiveSmallIntegerField(default=0)
    n_views = models.PositiveSmallIntegerField(default=0)
    n_members = models.PositiveSmallIntegerField(default=0)

    # default는 pk 값이랑 똑같음(receiver)
    custom_order = models.PositiveSmallIntegerField(default=0)  # 끌올, 공지

    def __str__(self):
        return self.title

    def _open(self, profile):
        """ 유저가 모둠을 개설한 경우 사용하는 convenience method """
        Enrollment.objects.create(
            modoom=self, profile=profile, is_leader=True, accepted=True
        )
        accept_enrollment(self, profile)

    def _enroll(self, profile):
        """ 유저가 모둠에 가입 신청한 경우 사용하는 convenience method """
        Enrollment.objects.create(
            modoom=self, profile=profile, is_leader=False, accepted=False
        )

    def _accept(self, profile):
        """ 유저를 승인할 때 사용하는 convenience method """
        pending_enrollment = Enrollment.objects.get(
            modoom=self, profile=profile, accepted=False
        )
        pending_enrollment.accepted = True
        pending_enrollment.save()
        accept_enrollment(self, profile)

    def _delete(self):
        """ 모둠을 삭제할 때 사용하는 convenience method """
        self.deleted = True
        self.save()


class Enrollment(models.Model):
    """
    모둠에 대한 신청/등록 정보를 저장하는 모델.
    거절/탈퇴 시엔 enrollment 객체를 삭제함.
    """

    modoom = models.ForeignKey(
        Modoom, related_name="enrollments", on_delete=models.CASCADE
    )
    profile = models.ForeignKey(
        Profile, related_name="enrollments", on_delete=models.CASCADE
    )
    is_leader = models.BooleanField(default=False)
    message = models.TextField(max_length=200, blank=True)
    accepted = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True, null=True)

    deleted = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.modoom}, profile: {self.profile}, accepted: {self.accepted}"

    class Meta:
        # 어떤 profile과 어떤 modoom에 대해, 2개 이상의 Enrollment가 생성되는 것을 방지한다.
        unique_together = ("modoom", "profile")


class AbstractComment(models.Model):
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    deleted = models.BooleanField(default=False)  # 삭제 여부

    # ----- Derived attributes -----
    n_likes = models.PositiveSmallIntegerField(default=0)

    @property
    def text_show(self):
        if self.deleted:
            return "삭제된 댓글입니다"
        else:
            return self.text

    class Meta:
        abstract = True


class Comment(AbstractComment):
    """ 댓글 model -> 모둠, 게시글 """

    profile = models.ForeignKey(
        Profile,
        related_name="comments",
        on_delete=models.SET_NULL,
        null=True,
    )
    modoom = models.ForeignKey(
        Modoom, related_name="comments", on_delete=models.CASCADE
    )
    likes = models.ManyToManyField(Profile, related_name="liked_comments", blank=True)

    def __str__(self):
        return f"{self.profile}-댓글-'{self.modoom}'"


class SubComment(AbstractComment):
    """ 대댓글 model, Comment를 참조 """

    profile = models.ForeignKey(
        Profile,
        related_name="subcomments",
        on_delete=models.SET_NULL,
        null=True,
    )
    comment = models.ForeignKey(
        Comment,
        related_name="subcomments",
        on_delete=models.CASCADE,
        null=True,
    )
    likes = models.ManyToManyField(
        Profile, related_name="liked_subcomments", blank=True
    )

    def __str__(self):
        return f"{self.profile}-대댓글-'{self.comment}'"


@receiver(pre_save, sender=Modoom)
def pre_save_modoom(sender, instance, **kwargs):
    """
    Modoom의 n_members에 따라 deletable 필드 변경

    ongoing False => recruit False
    deleted True => ongoing False
    """

    if instance.n_members > 1:
        instance.deletable = False
    elif instance.n_members == 1:
        instance.deletable = True

    if instance.deleted:
        instance.ongoing = False

        # 댓글들에 대한 삭제 처리
        comments = instance.comments.filter(deleted=False)
        comments.update(deleted=True)
        for comment in comments:
            subcomments = comment.subcomments.filter(deleted=False)
            subcomments.update(deleted=True)

        instance.n_comments = 0

    if not instance.ongoing:
        instance.recruit = False


@receiver(post_save, sender=Modoom)
def post_save_modoom(sender, created, instance, **kwargs):
    """
    Modoom이 삭제되면 Profile 업데이트
    """

    if created:
        instance.custom_order = instance.id
        instance.save()

    if instance.deleted and instance.profile:
        # Modoom 하위 모델들에 대한 처리
        instance.likes.all().update(n_modoom_likes=F("n_modoom_likes") - 1)

        # 삭제된 modoom에 연결된 모든 Keyword에 대해, n_modooms 필드를 1씩 감소시킨다.
        instance.keywords.all().update(n_modooms=F("n_modooms") - 1)


@receiver(m2m_changed, sender=Modoom.keywords.through)
def keyword_changed(sender, instance, model, pk_set, action, **kwargs):
    if action in ["post_add", "post_remove"]:
        keywords = [model.objects.get(id=pk) for pk in pk_set]
        for k in keywords:
            k.n_modooms = k.modooms.filter(deleted=False).count()
        model.objects.bulk_update(keywords, ["n_modooms"])


@receiver(m2m_changed, sender=Modoom.likes.through)
@receiver(m2m_changed, sender=Comment.likes.through)
@receiver(m2m_changed, sender=SubComment.likes.through)
def likes_changed(sender, instance, model, pk_set, action, **kwargs):
    if action in ["post_add", "post_remove"]:
        name = instance._meta.model.__name__.lower()
        profile = model.objects.get(pk=pk_set.pop())
        if action == "post_add":
            instance.n_likes += 1
            if name == "modoom":
                profile.n_modoom_likes += 1
        elif action == "post_remove":
            instance.n_likes -= 1
            if name == "modoom":
                profile.n_modoom_likes -= 1
        instance.save()
        profile.save()


@receiver(post_save, sender=Comment)
@receiver(post_save, sender=SubComment)
def post_save_comment(sender, created, instance, **kwargs):
    """ Comment를 남기면 Modoom 업데이트 """
    if sender == Comment:
        modoom = instance.modoom
    elif sender == SubComment:
        modoom = instance.comment.modoom
    if created:
        modoom.n_comments += 1
        modoom.save()
    if instance.deleted and instance.profile:
        modoom.n_comments -= 1
        modoom.save()
