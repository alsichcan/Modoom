from rest_framework_serializer_extensions.views import SerializerExtensionsAPIViewMixin
from rest_framework import generics
from feeds.models import Enrollment
from relationships.serializers import *
from relationships.utils import *
from utils import *
from users.utils import get_valid_profile, check_self_profile
from django.db.models import Q
from modoom_api.paginations import *
from notifications.models import *


# Create your views here.
class ListModoomees(SerializerExtensionsAPIViewMixin, generics.ListAPIView):
    """
    함께한 모둠원들의 리스트를 출력
    """

    serializer_class = ProfileSerializer
    pagination_class = CustomPageNumberPagination

    def get_queryset(self):
        profile = get_valid_profile(self.kwargs.get("nickname"))
        modoomees_ids = Modoomship.objects.filter(subject=profile).values_list("object")
        modoomees = Profile.objects.filter(user__in=modoomees_ids).order_by(
            "last_name", "first_name"
        )
        return modoomees

    def get_extensions_mixin_context(self):
        context = super().get_extensions_mixin_context()
        context["only"] = set(FRIEND_FIELDS_TO_SHOW)
        return context


class ListReceivedReviews(SerializerExtensionsAPIViewMixin, generics.ListAPIView):
    """
    사용자가 받은 Review를 리턴한다
    """

    serializer_class = ReviewSerializer
    pagination_class = ReverseCursorPagination

    def get_queryset(self):
        profile = get_valid_profile(self.kwargs.get("nickname"))
        reviews = Review.objects.filter(reviewee=profile)
        return reviews

    def get_extensions_mixin_context(self):
        context = super().get_extensions_mixin_context()
        context["only"] = set(RECEIVED_REVIEW_FIELDS_TO_SHOW)
        return context


class ListCreateReview(SerializerExtensionsAPIViewMixin, generics.ListCreateAPIView):
    """
    get : 작성 가능한 / 작성했던 리뷰 확인
    post : 리뷰 작성
    """

    serializer_class = ModoomshipSerializer
    pagination_class = ReverseCursorPagination

    def get_queryset(self):
        """
        본인에 대해 요청할 경우, 본인과 함께했던 모둠십 목록 리턴
        타인에 대해 요청할 경우, 상대와 함께했던 모둠십 목록 리턴
        """
        reviewer = self.request.user.profile
        if reviewer.nickname == self.kwargs.get("nickname"):
            modoomships = Modoomship.objects.filter(subject=reviewer)
        else:
            reviewee = get_valid_profile(self.kwargs.get("nickname"))
            modoomships = Modoomship.objects.filter(subject=reviewer, object=reviewee)
        return modoomships

    def get_extensions_mixin_context(self):
        context = super().get_extensions_mixin_context()
        context["expand"] = {"object", "modoom", "review"}
        context["only"] = set(MODOOMSHIP_FIELDS_TO_SHOW)
        return context

    def post(self, request, *args, **kwargs):
        reviewer = self.request.user.profile
        reviewee = get_valid_profile(self.kwargs.get("nickname"))

        modoomship = get_object_or_exception(
            Modoomship,
            subject=reviewer,
            object=reviewee,
            modoom=request.data["modoom_id"],
            review=None,
        )

        review = Review.objects.create(
            modoom_title=request.data["modoom_title"],
            reviewer=reviewer,
            reviewee=reviewee,
            rating=request.data["rating"],
            message=request.data["message"],
        )

        modoomship.review = review
        modoomship.save()

        reviewer.n_reviews_written += 1
        reviewee.n_reviews_received += 1
        reviewer.save()
        reviewee.save()

        create_notification(
            recipient=reviewee,
            action=Notification.Action.REVIEW_RECEIVED,
            description=review.message[:100]
            if len(review.message) > 100
            else review.message,
        )

        create_notification(
            recipient=reviewee,
            action=Notification.Action.REVIEW_WRITE,
        )

        return make_response(success=True, message="리뷰 작성이 완료되었습니다.")


class ListFriends(SerializerExtensionsAPIViewMixin, generics.ListAPIView):
    """
    친구들의 리스트를 출력
    """

    serializer_class = ProfileSerializer
    pagination_class = CustomPageNumberPagination

    def get_queryset(self):
        profile = get_valid_profile(self.kwargs.get("nickname"))
        friend_ids = Friendship.objects.filter(subject=profile).values_list("object")
        friends = Profile.objects.filter(user__in=friend_ids).order_by(
            "last_name", "first_name"
        )
        return friends

    def get_extensions_mixin_context(self):
        context = super().get_extensions_mixin_context()
        context["only"] = set(FRIEND_FIELDS_TO_SHOW)
        return context


class CreateDestroyFriendRequest(
    generics.CreateAPIView,
    generics.DestroyAPIView,
):
    """
    post with command "send" : 친구 신청
    delete :
     with command "cancel" : 친구 신청 철회
     with command "accept" : 친구 신청 수락
     with command "decline" : 친구 신청 거절
    """

    serializer_class = FriendRequestSerializer

    def post(self, request, *args, **kwargs):
        sender = self.request.user.profile
        receiver = get_valid_profile(self.kwargs.get("nickname"))

        if self.kwargs.get("command") != "send":
            raise exceptions.NotAcceptable

        if sender == receiver:
            raise exceptions.PermissionDenied(detail="사용자는 자신과 친구가 될 수 없습니다.")

        if Friendship.objects.filter(subject=sender, object=receiver).exists():
            raise exceptions.PermissionDenied(
                detail="사용자는 이미 %s님과 친구입니다." % receiver.nickname
            )

        if FriendRequest.objects.filter(
            Q(subject=sender, object=receiver) | Q(subject=receiver, object=sender)
        ).exists():
            raise exceptions.PermissionDenied(
                detail="사용자와 %s님 사이에 친구 신청이 이미 있습니다." % receiver.nickname
            )

        FriendRequest.objects.create(subject=sender, object=receiver)

        create_notification(
            recipient=receiver,
            actor=sender,
            action=Notification.Action.FRIEND_REQUEST_RECEIVED,
        )

        return make_response(success=True, message="친구신청이 완료되었습니다.")

    def delete(self, request, *args, **kwargs):
        """
        request.data["command"]가
        cancel : 친구 요청 철회
        accept : 친구 요청 수락
        decline : 친구 요청 거절
        """

        command = self.kwargs.get("command")
        sender = None
        receiver = None

        if command == "cancel":
            sender = self.request.user.profile
            receiver = get_valid_profile(self.kwargs.get("nickname"))
        elif command == "accept":
            sender = get_valid_profile(self.kwargs.get("nickname"))
            receiver = self.request.user.profile
        elif command == "decline":
            sender = get_valid_profile(self.kwargs.get("nickname"))
            receiver = self.request.user.profile
        else:
            raise exceptions.NotAcceptable

        friend_request = get_object_or_exception(
            FriendRequest, subject=sender, object=receiver
        )
        friend_request.delete()

        if command == "accept":
            Friendship.objects.create(subject=sender, object=receiver)
            Friendship.objects.create(subject=receiver, object=sender)

            sender.n_friends += 1
            receiver.n_friends += 1
            sender.save()
            receiver.save()

            create_notification(
                recipient=sender,
                actor=receiver,
                action=Notification.Action.FRIEND_REQUEST_ACCEPTED,
            )
            return make_response(success=True, message="친구 등록이 완료되었습니다.")

        elif command == "decline":
            return make_response(success=True, message="친구 신청이 거절되었습니다.")

        else:
            return make_response(success=True, message="친구 신청이 취소되었습니다.")


class RetrieveDestroyFriendship(generics.RetrieveDestroyAPIView):
    """
    get : 친구 관계 / 친구 신청 여부 확인
    delete : 친구 삭제
    """

    serializer_class = FriendshipSerializer

    def get(self, request, *args, **kwargs):
        """
        type 0 : 이미 친구인 사이 -> 친구 버튼 (누르면 친구 삭제?)
        type 1 : 친구 신청 보낸 사이 -> 친구 신청 취소 버튼
        type 2 : 친구 신청 받은 사이 -> 친구 신청 응답 버튼 (수락/거절)
        type 3 : 아무것도 아닌 사이
        """
        me = self.request.user.profile
        you = get_valid_profile(self.kwargs.get("nickname"))

        if Friendship.objects.filter(subject=me, object=you).exists():
            return make_response(success=True, data={"type": 0})
        elif FriendRequest.objects.filter(subject=me, object=you).exists():
            return make_response(success=True, data={"type": 1})
        elif FriendRequest.objects.filter(subject=you, object=me).exists():
            return make_response(success=True, data={"type": 2})
        else:
            return make_response(success=True, data={"type": 3})

    def delete(self, request, *args, **kwargs):
        me = self.request.user.profile
        you = get_valid_profile(self.kwargs.get("nickname"))
        friendship1 = get_object_or_exception(Friendship, subject=me, object=you)
        friendship2 = get_object_or_exception(Friendship, subject=you, object=me)

        friendship1.delete()
        friendship2.delete()

        me.n_friends -= 1
        you.n_friends -= 1
        me.save()
        you.save()

        return make_response(success=True, message="친구삭제가 완료되었습니다.")
