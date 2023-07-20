from django.db.models import Q
from rest_framework.views import APIView
from rest_framework_serializer_extensions.views import SerializerExtensionsAPIViewMixin

from chats.models import ModoomChatRoomStatus, ModoomChatRoom
from feeds.serializers import *
from keywords.serializers import *
from modoom_api.paginations import *
from notifications.models import *
from relationships.models import *
from chats.models import modoom_message_from_admin
from users.utils import get_valid_profile, check_self_profile
from utils import *
import json
from rest_framework.decorators import (
    api_view,
    authentication_classes,
    permission_classes,
)
import datetime
from notifications.views import (
    send_modoom_request_accepted_email,
    send_modoom_request_received_email,
)
from notifications.models import *
from chats.models import ModoomChatRoomStatus, ModoomChatRoom


class ListMyModooms(SerializerExtensionsAPIViewMixin, generics.ListAPIView):
    """
    User가 가입했던 모둠의 리스트를 출력
    """

    serializer_class = ModoomSerializer
    pagination_class = CustomPageNumberPagination

    def get_queryset(self):
        query = self.request.GET.get("query")
        if (not query) or (query not in ["home", "chat", "profile"]):
            raise exceptions.NotAcceptable(detail="잘못된 요청입니다.")
        nickname = self.kwargs.get("nickname")
        profile = get_valid_profile(nickname)
        if query == "home":  # 승인 대기중 + 진행중
            check_self_profile(self.request, nickname)
            modoom_ids = profile.enrollments.values_list("modoom")
            modoom_query = dict(pk__in=modoom_ids, ongoing=True, deleted=False)
        elif query == "chat":  # 승인 + 진행중
            check_self_profile(self.request, nickname)
            modoom_ids = profile.enrollments.filter(accepted=True).values_list("modoom")
            modoom_query = dict(pk__in=modoom_ids, ongoing=True, deleted=False)
        elif query == "profile":  # 승인 + 진행중 + 종료됨
            modoom_ids = profile.enrollments.filter(accepted=True).values_list("modoom")
            modoom_query = dict(pk__in=modoom_ids, deleted=False)
        modooms = (
            Modoom.objects.filter(**modoom_query)
            .prefetch_related("enrollments__profile", "keywords")
            .select_related("profile")
            .order_by("-ongoing", "-pk")
        )
        return modooms

    def get_extensions_mixin_context(self):
        context = super().get_extensions_mixin_context()
        context["expand"] = {"profile", "enrollments__profile", "keywords"}
        context["only"] = set(MODOOM_FIELDS_TO_SHOW)
        return context


class ListLikedModooms(SerializerExtensionsAPIViewMixin, generics.ListAPIView):
    """
    User가 저장한 모둠의 리스트를 출력
    """

    serializer_class = ModoomSerializer
    pagination_class = ReverseCursorPagination

    def get_queryset(self):
        check_self_profile(self.request, self.kwargs.get("nickname"))
        profile = self.request.user.profile
        modooms = (
            profile.liked_modooms.filter(deleted=False)
            .prefetch_related("enrollments__profile", "keywords")
            .select_related("profile")
        )
        return modooms

    def get_extensions_mixin_context(self):
        context = super().get_extensions_mixin_context()
        context["expand"] = {"profile", "enrollments__profile", "keywords"}
        context["only"] = set(MODOOM_FIELDS_TO_SHOW)
        return context


class ListModooms(SerializerExtensionsAPIViewMixin, generics.ListAPIView):
    """
    home 화면용
    모든 모둠을 최신순으로 정렬
    """

    serializer_class = ModoomSerializer
    pagination_class = CustomPageNumberPagination

    def get_queryset(self):
        # 최신순
        return (
            Modoom.objects.filter(deleted=False, ongoing=True)
            .prefetch_related("enrollments__profile", "keywords")
            .select_related("profile")
            .order_by("-ongoing", "-custom_order", "-pk")
        )

    def get_extensions_mixin_context(self):
        context = super().get_extensions_mixin_context()
        context["expand"] = {"profile", "enrollments__profile", "keywords"}
        context["only"] = set(MODOOM_FIELDS_TO_SHOW)
        return context


class CreateModoom(generics.CreateAPIView):
    serializer_class = ModoomSerializer

    # 모둠 생성
    def post(self, request, *args, **kwargs):
        if request.data["title"] == "":
            message = "모둠 이름을 정해주세요."
            return make_response(success=False, message=message)
        if request.data["content"] == "":
            message = "내용을 입력해주세요."
            return make_response(success=False, message=message)
        if not (2 <= int(request.data["accom"]) <= 12):
            message = "인원은 최소 2명, 최대 12명 입니다."
            return make_response(success=False, message=message)
        # 2021.03.09 모둠 생성 시 키워드 제거
        request.data.pop("keywords", None)
        # if not request.data["keywords"]:
        #     message = "하나 이상의 키워드를 입력해주세요."
        #     return make_response(success=False, message=message)
        request.data["profile"] = request.user.profile
        # request.data["keywords"] = get_or_create_keyword(request.data["keywords"])
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        instance = serializer.save()
        instance._open(request.user.profile)  # 개설한 사람을 모둠장으로 등록

        # ----------- 모둠 채팅방 개설 및 입장 ----------
        chat_room = ModoomChatRoom.objects.create(modoom=instance, name="일반")
        ModoomChatRoomStatus.objects.create(
            recipient=instance.profile,
            chat_room=chat_room,
            last_position=chat_room.latest_position,
        )

        modoom_message_from_admin(
            chat_room=chat_room,
            content="""모둠 개설을 축하드려요 🎉
            모둠이가 사방팔방 뛰어서 모둠원들 다 모으실 수 있도록 최대한 도울게요!
            
            모둠이가 드리는 부탁의 말씀 🙏
            ✔ 아직 모둠이 많이 부족하고 불편해요... 앞으로 계속 발전할테니 피드백 많이 부탁드려요!
            ✔ 모둠 참가 신청과 승인 완료는 스누메일로 알려드리고 있어요! 그런데 가끔 저희 메일이 스팸 메일 처리가 되어 반송되는 경우가 있더라구요 🤦‍♂️ (하..) 최대한 빠른 시일 내에 이 문제를 해결하도록 할테니 스누메일을 스팸메일함까지 체크해주세요. 모둠을 자주 방문해주면 제 사랑을 드리죠 ❤
            ✔ 모둠이 개설되고 모둠원들까지 합류한 다음에는 오픈카톡방을 파는 것을 권장드려요! 얼른💦 개발자를 갈아넣어서 나중에는 카카오톡으로 이어지지 않고도 소통을 편하게 하실 수 있게 할게요!
            """,
        )

        message = "모둠이 개설되었습니다!"
        return make_response(
            success=True,
            message=message,
            data=dict(title=instance.title),
        )


class RetrieveUpdateDestroyModoom(
    SerializerExtensionsAPIViewMixin, generics.RetrieveUpdateDestroyAPIView
):
    serializer_class = ModoomSerializer

    def get_object(self):
        modoom = get_object_or_exception(Modoom, pk=self.kwargs["id"], deleted=False)
        if self.request.method == "GET":
            modoom.n_views += 1
            modoom.save()
            return modoom
        elif self.request.method in ["PATCH", "DELETE"]:
            if not modoom.ongoing:
                raise exceptions.NotAcceptable(detail="종료된 모둠에는 해당 요청을 보낼 수 없습니다.")
            check = modoom.enrollments.get(profile=self.request.user.profile)
            if not check.is_leader:
                raise exceptions.NotAuthenticated(detail="권한이 없습니다.")
            return modoom

    def patch(self, request, *args, **kwargs):
        keys = request.data.keys()
        instance = self.get_object()
        if "ongoing" in keys and not request.data["ongoing"]:
            if instance.deletable:
                return make_response(success=False, message="모둠을 삭제해주세요.")
            if instance.enrollments.filter(accepted=False):
                return make_response(
                    success=False, message="가입 대기중인 사용자가 있어 종료할 수 없습니다."
                )
            modoomees_id = instance.enrollments.filter(accepted=True).values_list(
                "profile"
            )
            modoomees = Profile.objects.filter(user__in=modoomees_id)
            for modoomee in modoomees:
                create_notification(
                    recipient=modoomee,
                    actor=instance.profile,
                    action=Notification.Action.MODOOM_CLOSED,
                    target=instance,
                )
            message = "모둠이 종료되었습니다!"
        else:
            if "title" in keys and request.data["title"] == "":
                message = "제목을 입력해주세요."
                return make_response(success=False, message=message)
            if "content" in keys and request.data["content"] == "":
                message = "내용을 입력해주세요."
                return make_response(success=False, message=message)
            if "accom" in keys:
                requested_accom = int(request.data["accom"])
                if not (2 <= requested_accom <= 12):
                    message = "인원은 최소 2명, 최대 12명 입니다."
                    return make_response(success=False, message=message)
                if requested_accom < instance.n_members:
                    message = "정원을 현재 인원보다 적게 설정할 수 없습니다."
                    return make_response(success=False, message=message)
                if requested_accom > instance.n_members:
                    request.data["recruit"] = True
                if requested_accom == instance.n_members:
                    request.data["recruit"] = False
            if "keywords" in keys:
                if not request.data["keywords"]:
                    message = "하나 이상의 키워드를 입력해주세요."
                    return make_response(success=False, message=message)
                request.data["keywords"] = get_or_create_keyword(
                    request.data["keywords"]
                )
            message = "모둠이 수정되었습니다!"
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return make_response(success=True, message=message)

    def delete(self, request, *args, **kwargs):
        instance = self.get_object()
        if not instance.deletable:
            return make_response(success=False, message="모둠원 가입 기록이 있어 삭제할 수 없습니다.")
        if instance.enrollments.filter(accepted=False).count():
            return make_response(success=False, message="가입 대기중인 사용자가 있어 삭제할 수 없습니다.")
        request.data["deleted"] = True
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        # Enrollment 삭제
        instance.enrollments.all().delete()
        delete_enrollment(instance, request.user.profile)
        # ChatRoomStatus삭제
        chat_rooms = ModoomChatRoom.objects.filter(modoom=instance)
        statuses = ModoomChatRoomStatus.objects.filter(
            recipient=request.user.profile, chat_room__in=chat_rooms
        )
        for status in statuses:
            status.delete()
        message = "모둠이 삭제되었습니다!"
        return make_response(success=True, message=message)

    def get_extensions_mixin_context(self):
        context = super().get_extensions_mixin_context()
        if self.request.method == "GET":
            context["expand"] = {"profile", "enrollments__profile", "keywords"}
            context["only"] = set(MODOOM_FIELDS_TO_SHOW + ["liked"])
        return context


# ---------- 모둠 가입 관련 ---------- #
class CreateDestroyEnrollment(generics.CreateAPIView, generics.DestroyAPIView):
    """
    새로운 Enrollment에 대한 모둠원의 Action

    post : 가입 신청
    delete : 가입 신청 철회 or 탈퇴
    """

    serializer_class = EnrollmentSerializer

    def post(self, request, *args, **kwargs):
        modoom = get_object_or_exception(Modoom, pk=self.kwargs["id"], deleted=False)
        n_members = modoom.enrollments.filter(accepted=True).count()
        if modoom.recruit is False or n_members == modoom.accom:
            message = "이미 모집이 완료된 모둠입니다."
            return make_response(success=False, message=message)
        # 중복 신청 방지
        try:
            modoom.enrollments.get(profile=request.user.profile)
            return make_response(success=False, message="이미 가입 신청을 했거나, 가입된 모둠입니다.")
        except Enrollment.DoesNotExist:
            data = self.request.data.copy()
            data["modoom"] = self.kwargs["id"]
            data["profile"] = request.user.profile
            data["message"] = self.request.data.get("message", "")
            serializer = self.get_serializer(data=data)
            serializer.is_valid(raise_exception=True)
            serializer.save()

            create_notification(
                recipient=modoom.profile,
                actor=request.user.profile,
                action=Notification.Action.MODOOM_REQUEST_RECEIVED,
                target=modoom,
            )
            send_modoom_request_received_email(
                recipient=modoom.profile,
                description=modoom.title,
            )

        return make_response(success=True, message="가입 신청이 완료되었습니다!")

    def get_object(self):
        obj = get_object_or_exception(
            Enrollment, profile=self.request.user.profile, modoom=self.kwargs["id"]
        )
        if not obj.modoom.ongoing:
            raise exceptions.NotAcceptable(detail="종료된 모둠에는 해당 요청을 보낼 수 없습니다.")
        return obj

    def delete(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.accepted:  # 탈퇴
            if instance.is_leader:
                message = "모둠장은 모둠을 나갈 수 없습니다."
                return make_response(success=False, message=message)
            else:
                modoom = instance.modoom
                modoomees_id = modoom.enrollments.filter(accepted=True).values_list(
                    "profile"
                )
                modoomees = Profile.objects.filter(user__in=modoomees_id)

                # ---------- 모둠 채팅방 퇴장 ----------
                chat_rooms = ModoomChatRoom.objects.filter(modoom=instance.modoom)
                statuses = ModoomChatRoomStatus.objects.filter(
                    recipient=instance.profile, chat_room__in=chat_rooms
                )
                for status in statuses:
                    status.delete()

                # ---------- 알림 생성 ----------
                for modoomee in modoomees:
                    if modoomee == self.request.user.profile:
                        continue

                    create_notification(
                        recipient=modoomee,
                        actor=self.request.user.profile,
                        action=Notification.Action.MODOOM_OUT_MEMBER,
                        target=instance.modoom,
                    )
                delete_enrollment(modoom, instance.profile)
                message = "모둠에서 나왔습니다!"
        else:  # 신청 취소
            message = "가입 신청이 취소되었습니다!"
        instance.delete()
        return make_response(success=True, message=message)


class ListUpdateDestroyEnrollment(
    SerializerExtensionsAPIViewMixin,
    generics.ListAPIView,
    generics.UpdateAPIView,
    generics.DestroyAPIView,
):
    """
    이미 발생한 Enrollment에 대한 모둠장의 Action

    patch : 가입 승인
    delete : 가입 거절 / 강퇴
    list : 모둠원 목록
    """

    is_leader = False
    serializer_class = EnrollmentSerializer

    def get_queryset(self):
        check = get_object_or_exception(
            Enrollment, profile=self.request.user.profile, modoom=self.kwargs["id"]
        )
        self.is_leader = check.is_leader
        query = Q(modoom=self.kwargs["id"])
        if not self.is_leader:  # 가입 승인이 되지 않은 사람들은 모둠장에게만 보임
            query &= Q(accepted=True)
        return Enrollment.objects.filter(query).select_related("profile")

    def get_extensions_mixin_context(self):
        context = super().get_extensions_mixin_context()
        if self.request.method == "GET":
            context["expand"] = {"profile"}
            context["only"] = {
                "accepted",
                "is_leader",
                "profile__nickname",
                "profile__first_name",
                "profile__last_name",
                "profile__full_name",
                "profile__image",
            }
            if self.is_leader:
                context["only"].add("message")
        return context

    def get_object(self):
        check = get_object_or_exception(
            Enrollment, profile=self.request.user.profile, modoom=self.kwargs.get("id")
        )
        if not check.modoom.ongoing:
            raise exceptions.NotAcceptable(detail="종료된 모둠에는 해당 요청을 보낼 수 없습니다.")
        if check.is_leader:
            target = get_object_or_exception(
                Enrollment,
                profile__nickname=self.request.data.get("nickname"),
                modoom=self.kwargs.get("id"),
            )
            if self.request.method == "PATCH":
                if target.accepted:
                    raise exceptions.NotAcceptable(detail="이미 가입 승인 처리되었습니다.")
            elif self.request.method == "DELETE":
                if check == target:
                    raise exceptions.NotAcceptable(detail="모둠장은 자신을 강퇴할 수 없습니다.")
            return target
        else:
            raise exceptions.NotAuthenticated(detail="모둠장만 확인할 수 있습니다.")

    def patch(self, request, *args, **kwargs):
        instance = self.get_object()
        modoom = instance.modoom
        modoomees_id = modoom.enrollments.filter(accepted=True).values_list("profile")
        modoomees = Profile.objects.filter(user__in=modoomees_id)
        n_members = len(modoomees)

        if n_members == modoom.accom:
            message = "더 이상 모둠원을 추가할 수 없습니다."
            return make_response(success=False, message=message)
        instance.accepted = True
        instance.save()
        accept_enrollment(modoom, instance.profile)

        new_modoomee = get_valid_profile(self.request.data.get("nickname"))

        # ---------- 채팅방 가입 ----------
        chat_rooms = ModoomChatRoom.objects.filter(modoom=instance.modoom)
        for chat_room in chat_rooms:
            ModoomChatRoomStatus.objects.create(
                recipient=instance.profile,
                chat_room=chat_room,
                last_position=chat_room.latest_position,
            )

            modoom_message_from_admin(
                chat_room=chat_room,
                content=f"""{new_modoomee.full_name}님이 모둠에 가입했습니다. 환영해주세요 👋""",
            )

        # ---------- 알림 생성 + 메일 전송 ----------
        create_notification(
            recipient=new_modoomee,
            actor=modoom.profile,
            action=Notification.Action.MODOOM_REQUEST_ACCEPTED,
            target=modoom,
        )

        send_modoom_request_accepted_email(
            recipient=new_modoomee, description=modoom.title
        )

        # ---------- 함께한 모둠원 증가 ----------
        for modoomee in modoomees:
            modoomship1 = Modoomship.objects.create(
                subject=new_modoomee, object=modoomee, modoom=modoom
            )
            modoomship2 = Modoomship.objects.create(
                subject=modoomee, object=new_modoomee, modoom=modoom
            )

            create_notification(
                recipient=modoomee,
                actor=new_modoomee,
                action=Notification.Action.MODOOM_NEW_MEMBER,
                target=modoom,
            )

        message = "가입 신청 승인"
        return make_response(success=True, message=message)

    def delete(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        kick = request.data.get("kick", None)  # kick 이면 강퇴
        if kick:
            create_notification(
                recipient=instance.profile,
                actor=instance.modoom.profile,
                action=Notification.Action.MODOOM_KICKED,
                target=instance.modoom,
                description=instance.modoom.title,
            )
            message = "강퇴"
            delete_enrollment(instance.modoom, instance.profile)
        else:
            create_notification(
                recipient=instance.profile,
                actor=instance.modoom.profile,
                action=Notification.Action.MODOOM_REQUEST_DECLINED,
                target=instance.modoom,
                description=instance.modoom.title,
            )
            message = "가입 신청 거절"
        return make_response(success=True, message=message)


# ---------- 모둠, 게시글, 댓글, 대댓글 좋아요 ---------- #
class CreateDestroyLike(APIView):
    """
    post : 좋아요 or 좋아요 취소
    """

    def post(self, request, *args, **kwargs):
        obj_class = self.kwargs["obj_class"]
        if obj_class == "modoom":
            obj = get_object_or_exception(Modoom, pk=self.kwargs["id"], deleted=False)
        elif obj_class == "comment":
            obj = get_object_or_exception(Comment, pk=self.kwargs["id"])
        elif obj_class == "subcomment":
            obj = get_object_or_exception(SubComment, pk=self.kwargs["id"])
        else:
            raise exceptions.NotAcceptable(detail="잘못된 요청입니다.")

        profile = self.request.user.profile
        liked = False
        if profile in obj.likes.all():
            obj.likes.remove(profile)
            message = "좋아요 취소"

        else:
            obj.likes.add(profile)
            message = "좋아요"
            liked = True

        data = {"id": self.kwargs["id"], "n_likes": obj.n_likes, "liked": liked}

        return make_response(success=True, message=message, data=data)


# ---------- 모둠, 게시글 댓글 ---------- #
class ListCreateUpdateDestroyComment(
    SerializerExtensionsAPIViewMixin,
    generics.ListCreateAPIView,
    generics.UpdateAPIView,
    generics.DestroyAPIView,
):
    """
    get: 댓글 리스트
    post: 댓글 달기
    patch: 댓글 수정
    delete: 댓글 삭제
    """

    serializer_class = CommentSerializer

    def get_queryset(self):
        if self.kwargs["obj_class"] != "modoom":
            raise exceptions.NotAcceptable(detail="잘못된 요청입니다.")
        comments = (
            Comment.objects.filter(modoom=self.kwargs["id"])
            .prefetch_related("likes", "subcomments__profile")
            .select_related("profile")
        )
        return comments

    def get_extensions_mixin_context(self):
        context = super().get_extensions_mixin_context()
        if self.request.method == "GET":
            context["expand"] = {"subcomments__profile", "profile"}
            context["only"] = set(COMMENT_FIELDS_TO_SHOW)
        return context

    def post(self, request, *args, **kwargs):
        profile = request.user.profile
        obj_class = self.kwargs["obj_class"]
        if obj_class == "modoom":
            obj = get_object_or_exception(Modoom, pk=self.kwargs["id"], deleted=False)
            recipient = obj.profile
            target = obj
            action = Notification.Action.MODOOM_COMMENT
            request.data["modoom"] = self.kwargs["id"]
        elif obj_class == "comment":
            obj = get_object_or_exception(Comment, pk=self.kwargs["id"])
            recipient = obj.profile
            target = obj.modoom
            action = Notification.Action.COMMENT_SUBCOMMENT
            self.serializer_class = SubCommentSerializer
            request.data["comment"] = self.kwargs["id"]
        else:
            raise exceptions.NotAcceptable(detail="잘못된 요청입니다.")

        request.data["profile"] = profile

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        comment = serializer.save()

        if recipient != request.user.profile:
            create_notification(
                recipient=recipient,
                actor=request.user.profile,
                action=action,
                target=target,
                description=comment.text[:100]
                if len(comment.text) > 100
                else comment.text,
            )

        message = "댓글이 등록되었습니다!"
        return make_response(success=True, message=message)

    def get_object(self):
        obj_class = self.kwargs["obj_class"]
        if obj_class not in ["comment", "subcomment"]:
            raise exceptions.NotAcceptable(detail="잘못된 요청입니다.")
        if obj_class == "subcomment":
            self.serializer_class = SubCommentSerializer
        return get_object_or_exception(
            self.serializer_class.Meta.model,
            pk=self.kwargs["id"],
            profile=self.request.user.profile,
            deleted=False,
        )

    def patch(self, request, *args, **kwargs):
        self.partial_update(request, *args, **kwargs)
        message = "댓글이 수정되었습니다!"
        return make_response(success=True, message=message)

    def delete(self, request, *args, **kwargs):
        request.data["deleted"] = True
        self.partial_update(request, *args, **kwargs)
        message = "댓글이 삭제되었습니다!"
        return make_response(success=True, message=message)


# ---------- 검색 ----------
class ListSearch(SerializerExtensionsAPIViewMixin, generics.ListAPIView):
    serializer_class = None
    pagination_class = ReverseCursorPagination

    def get_queryset(self):
        search = self.request.GET.get("search", "").strip()
        obj = self.request.GET.get("query", "")
        if obj == "keywords":
            self.serializer_class = KeywordSerializer
            if " " not in search:  # 띄어쓰기가 없는 경우
                keywords = Keyword.objects.filter(name__contains=search)
            else:  # 띄어쓰기가 있는 경우
                search_split = search.split(" ")
                keywords = Keyword.objects.filter(name__in=search_split)
            return keywords

        elif obj == "modooms":
            self.serializer_class = ModoomSerializer
            if " " not in search:  # 띄어쓰기가 없는 경우
                keyword_list = Keyword.objects.filter(name=search)
                query = (
                    Q(title__icontains=search)
                    | Q(content__icontains=search)
                    | Q(keywords__in=keyword_list)
                )
                result = (
                    Modoom.objects.filter(query, deleted=False)
                    .prefetch_related("enrollments__profile", "keywords")
                    .select_related("profile")
                    .distinct()
                )
                return result

            elif " " in search:  # 띄어쓰기가 있는 경우
                search_split = search.split(" ")
                keyword_list = Keyword.objects.filter(name__in=search_split)
                query = Q(keywords__in=keyword_list)
                for word in search_split:
                    query |= Q(title__icontains=word) | Q(content__icontains=word)
                result = (
                    Modoom.objects.filter(query, deleted=False)
                    .distinct()
                    .prefetch_related("enrollments__profile", "keywords")
                    .select_related("profile")
                    .distinct()
                )
                return result

        elif obj == "profiles":
            self.serializer_class = ProfileSerializer
            if " " not in search:  # 띄어쓰기가 없는 경우
                query = Q(full_name__icontains=search) | Q(nickname__icontains=search)
                result = (
                    Profile.objects.filter(query, user__is_active=True)
                    .prefetch_related("keywords")
                    .distinct()
                )
                return result

            elif " " in search:  # 띄어쓰기가 있는 경우
                search_split = search.split(" ")
                query = Q()
                for word in search_split:
                    query |= Q(full_name__icontains=word) | Q(nickname__icontains=word)
                result = (
                    Profile.objects.filter(query, user__is_active=True)
                    .distinct()
                    .prefetch_related("keywords")
                )
                return result
        else:
            raise exceptions.NotAcceptable

    def get(self, request, *args, **kwargs):
        search = self.request.GET.get("search", None).strip()
        if not search:
            return make_response(success=False, message="검색어를 입력해주세요.")
        return self.list(request, *args, **kwargs)

    def get_extensions_mixin_context(self):
        context = super().get_extensions_mixin_context()
        obj = self.request.GET.get("query", None)
        if obj == "keywords":
            pass
        elif obj == "modooms":
            context["expand"] = {"profile", "keywords", "enrollments__profile"}
            context["only"] = set(MODOOM_FIELDS_TO_SHOW)
        elif obj == "profiles":
            context["expand"] = {"keywords"}
            context["only"] = set(PROFILE_FIELDS_TO_SHOW)
        return context


@api_view(["GET"])
@authentication_classes([])
@permission_classes([])
def count(request):
    return make_response(
        data=dict(modooms=Modoom.objects.count(), users=User.objects.count())
    )
