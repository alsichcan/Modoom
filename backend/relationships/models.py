from django.db import models
from users.models import Profile
from feeds.models import Modoom
from django.db.models.signals import *
from django.dispatch import receiver


# Create your models here.
class Review(models.Model):
    """
    reviewer : 리뷰 작성자
    reviewee : 리뷰 대상자
    User가 삭제되더라도 review는 유지된다
    모둠을 함께한 사람들 사이에서만 리뷰를 작성할 수 있다
    총평 / 재모둠 희망률 / 추천률 / 한마디 작성
    """

    modoom_title = models.CharField(max_length=20, blank=True)

    reviewer = models.ForeignKey(
        Profile, on_delete=models.SET_NULL, null=True, related_name="written_review"
    )
    reviewee = models.ForeignKey(
        Profile, on_delete=models.SET_NULL, null=True, related_name="received_review"
    )
    created_at = models.DateTimeField(auto_now_add=True)

    Rating = [
        (1, "좋아요"),
        (0, "글쎄요"),
        (-1, "싫어요"),
    ]

    rating = models.SmallIntegerField(choices=Rating, null=False, blank=False)

    message = models.TextField(max_length=500, blank=False)


class Relationship(models.Model):
    class Meta:
        abstract = True

    """
    subject : 관계의 주체
    object : 관계의 객체
    """

    subject = models.ForeignKey(
        Profile, on_delete=models.CASCADE, related_name="sent_%(class)s"
    )
    object = models.ForeignKey(
        Profile, on_delete=models.CASCADE, related_name="received_%(class)s"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True, null=True)


class FriendRequest(Relationship):
    pass


class Friendship(Relationship):
    pass


class Modoomship(Relationship):
    modoom = models.ForeignKey(
        Modoom, on_delete=models.CASCADE, related_name="relationship"
    )

    review = models.ForeignKey(
        Review, on_delete=models.PROTECT, null=True, related_name="modoomship"
    )


@receiver(post_save, sender=Friendship)
def post_save_modoomship(sender, created, instance, **kwargs):
    if created:
        objects = instance.subject.sent_modoomship.values_list("object")
        instance.subject.n_modoomees = objects.distinct().count()
        instance.subject.save()


@receiver(post_save, sender=Modoomship)
def post_save_modoomship(sender, created, instance, **kwargs):
    if created:
        objects = instance.subject.sent_modoomship.values_list("object")
        instance.subject.n_modoomees = objects.distinct().count()
        instance.subject.save()
