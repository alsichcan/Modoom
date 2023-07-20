from django.shortcuts import _get_queryset
from rest_framework import exceptions
from rest_framework.response import Response


def make_response(success=True, message=None, data=None):
    ret_dict = dict(success=success, message=message, data=data)
    return Response(ret_dict)


def get_or_create_keyword(keywords):
    keyword_list = []
    for key in keywords:
        obj, created = Keyword.objects.get_or_create(name=key)
        keyword_list.append(obj.id)
    return keyword_list


def get_object_or_exception(klass, *args, **kwargs):
    queryset = _get_queryset(klass)
    if not hasattr(queryset, "get"):
        klass__name = (
            klass.__name__ if isinstance(klass, type) else klass.__class__.__name__
        )
        raise ValueError(
            "First argument to get_object_or_404() must be a Model, Manager, "
            "or QuerySet, not '%s'." % klass__name
        )
    try:
        return queryset.get(*args, **kwargs)
    except queryset.model.DoesNotExist:
        raise exceptions.NotFound


MODOOM_FIELDS_TO_SHOW = [
    "id",
    "title",
    "content",
    "accom",
    "location",
    "created_at",
    "n_members",
    "n_likes",
    "liked",
    "n_comments",
    "n_views",
    "keywords",
    "profile__nickname",
    "profile__first_name",
    "profile__last_name",
    "profile__full_name",
    "profile__image",
    "profile__uid",
    "enrollments__accepted",
    "enrollments__is_leader",
    "enrollments__profile__nickname",
    "enrollments__profile__first_name",
    "enrollments__profile__last_name",
    "enrollments__profile__full_name",
    "enrollments__profile__image",
    "enrollments__profile__uid",
    "recruit",
    "ongoing",
    "deletable",
    "deleted",
]
COMMENT_FIELDS_TO_SHOW = [
    "id",
    "text_show",
    "created_at",
    "updated_at",
    "n_likes",
    "deleted",
    "liked",
    "profile__nickname",
    "profile__first_name",
    "profile__last_name",
    "profile__full_name",
    "profile__image",
    "profile__uid",
    "subcomments__id",
    "subcomments__text_show",
    "subcomments__created_at",
    "subcomments__updated_at",
    "subcomments__n_likes",
    "subcomments__deleted",
    "subcomments__liked",
    "subcomments__profile__nickname",
    "subcomments__profile__first_name",
    "subcomments__profile__last_name",
    "subcomments__profile__full_name",
    "subcomments__profile__image",
    "subcomments__profile__uid",
]

PROFILE_FIELDS_TO_SHOW = [
    "nickname",
    "first_name",
    "last_name",
    "full_name",
    "image",
    "bio",
    "n_modoomees",
    "n_friends",
    "n_reviews_received",
    "n_modooms",
    "keywords__name",
    "receive_enroll_mails",
    "receive_news_mails",
    "pref_email",
]


FRIEND_FIELDS_TO_SHOW = [
    "nickname",
    "first_name",
    "last_name",
    "full_name",
    "image",
]

MODOOMSHIP_FIELDS_TO_SHOW = [
    "modoom__id",
    "modoom__title",
    "object__nickname",
    "object__first_name",
    "object__last_name",
    "object__full_name",
    "object__image",
    "review__rating",
    "review__message",
    "review__created_at",
]

RECEIVED_REVIEW_FIELDS_TO_SHOW = [
    "modoom_title",
    "message",
    "created_at",
]

WRITTEN_REVIEW_FIELDS_TO_SHOW = [
    "reviewee__nickname",
    "reviewee__first_name",
    "reviewee__last_name",
    "reviewee__full_name",
    "reviewee__image",
    "modoom_title",
    "rating",
    "message",
    "created_at",
]

NOTIFICATION_FIELDS_TO_SHOW = [
    "id",
    "actor__nickname",
    "actor__first_name",
    "actor__last_name",
    "actor__full_name",
    "actor__image",
    "action",
    "target",
    "target_id",
    "description",
    "timestamp",
    "unread",
]

# dummy data 만들기
import os
import sys

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "modoom_api.settings.development")
import django

django.setup()
from users.models import *
from feeds.models import *
import random
import time


def dummy_data(n_keywords=500, n_users=500, n_modooms=100):
    """
    500, 500, 100, 500으로
    약 3분 소요됨
    """
    start_at = time.time()

    root = User.objects.create_superuser(
        username="test1", email="test1@test.com", password="test1"
    )
    root.profile.nickname = "admin11s222"
    root.profile.first_name = "신홍2"
    root.profile.last_name = "박2"
    root.save()
    return

    # dummy keywords
    n_keywords_db = Keyword.objects.count()
    bulk_keywords = [
        Keyword(id=n_keywords_db + 1 + n, name=f"dummy_keyword{n_keywords_db + 1 + n}")
        for n in range(n_keywords)
    ]
    keywords = Keyword.objects.bulk_create(bulk_keywords)

    # dummy users, profiles
    n_users_db = User.objects.count()
    bulk_users = [
        User(
            id=n_users_db + 1 + n,
            username=f"dummy_user{n_users_db + 1 + n}",
            email=f"dummy_user{n_users_db + 1 + n}@example.com",
            password=f"password{n_users_db + 1 + n}",
        )
        for n in range(n_users)
    ]
    users = User.objects.bulk_create(bulk_users)
    bulk_profiles = []
    for u in users:
        salted_pk = str(u.pk) + SECRET_KEY
        md5 = hashlib.md5(salted_pk.encode()).hexdigest()
        bulk_profiles.append(
            Profile(
                user=u,
                nickname=u.username,
                uid=md5,
                first_name=random.choice(
                    ["신홍", "지상", "상혁", "지원", "원지", "혁상", "상지", "홍신"]
                ),
                last_name=random.choice("가나다라마바사아자차카타파하"),
            )
        )
    profiles = Profile.objects.bulk_create(bulk_profiles)
    for p in profiles:
        p.keywords.add(
            *random.sample(
                range(n_keywords_db + 1, n_keywords_db + 1 + n_keywords),
                k=random.randint(1, 10),
            )
        )

    # dummy modooms and enrollments
    n_modooms_db = Modoom.objects.count()
    modooms = []
    enrollments = []
    for n in range(n_modooms):
        accom = random.randint(2, 12)
        n_enrolls = random.randint(1, accom)
        enroll_profiles = random.sample(profiles, k=n_enrolls)
        leader_profile = enroll_profiles[0]
        modoom = Modoom.objects.create(
            title=f"dummy_modoom{n_modooms_db + 1 + n}",
            profile=leader_profile,
            content=f"dummy modoom {n_modooms_db + 1 + n}",
            accom=accom,
        )
        modoom._open(leader_profile)
        modoom.keywords.add(
            *random.sample(
                range(n_keywords_db + 1, n_keywords_db + 1 + n_keywords),
                k=random.randint(1, 10),
            )
        )
        modooms.append(modoom)

        # dummy enrollment
        for profile in enroll_profiles[1:]:
            enrollments.append(
                Enrollment.objects.create(
                    modoom=modoom,
                    profile=profile,
                    accepted=(random.randint(1, 100) < 90),
                )
            )

        # dummy modoom like
        modoom.likes.add(*random.sample(profiles, k=random.randint(0, 10)))

    # dummy comments
    n_comments_db = Comment.objects.count()
    bulk_comments = []
    i = 1
    random.shuffle(modooms)
    for m in modooms:
        n_comments = random.randint(0, 10)
        for c in range(n_comments):
            bulk_comments.append(
                Comment(
                    id=n_comments_db + i,
                    modoom=m,
                    profile=profiles[random.randint(0, n_users - 1)],
                    text=f"dummy comment {n_comments_db + i}",
                )
            )
            i += 1
        m.n_comments += n_comments
        m.save()
    comments = Comment.objects.bulk_create(bulk_comments)
    for comment in comments:
        # dummy comment like
        comment.likes.add(*random.sample(profiles, k=random.randint(0, 10)))

    # dummy subcomments
    n_subcomments_db = SubComment.objects.count()
    bulk_subcomments = []
    i = 1
    for c in comments:
        n_subcomments = random.randint(0, 2)
        for s in range(n_subcomments):
            bulk_subcomments.append(
                SubComment(
                    id=n_subcomments_db + i,
                    comment=c,
                    profile=profiles[random.randint(0, n_users - 1)],
                    text=f"dummy subcomment {n_subcomments_db + i}",
                )
            )
            i += 1
        c.modoom.n_comments += n_subcomments
        c.modoom.save()
    subcomments = SubComment.objects.bulk_create(bulk_subcomments)
    for subcomment in subcomments:
        # dummy subcomment like
        subcomment.likes.add(*random.sample(profiles, k=random.randint(0, 10)))
    end_at = time.time()
    print(end_at - start_at)


if __name__ == "__main__":
    dummy_data()
