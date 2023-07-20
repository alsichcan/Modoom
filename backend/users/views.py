import random

from django.core.mail import EmailMessage, EmailMultiAlternatives
from django.template.loader import render_to_string
from django.contrib.auth.hashers import check_password
from knox.models import AuthToken
from rest_framework import generics
from rest_framework.decorators import (
    api_view,
    authentication_classes,
    permission_classes,
)
from rest_framework.views import APIView
from rest_framework_serializer_extensions.views import SerializerExtensionsAPIViewMixin
from feeds.serializers import *
from feeds.utils import *
from notifications.views import send_code_email, send_welcome_email, send_goodbye_email
from users.utils import *
from chats.views import send_welcome_message
from chats.models import direct_message_from_admin
from utils import *


class LoginAPIView(generics.GenericAPIView):
    serializer_class = LoginSerializer
    authentication_classes = []
    permission_classes = []

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data
        return Response(
            {
                "user": ProfileSerializer(user.profile).data,
                "token": AuthToken.objects.create(user)[1],
            }
        )


class RegisterAPIView(generics.GenericAPIView):
    serializer_class = RegisterSerializer
    authentication_classes = []
    permission_classes = []

    def post(self, request, *args, **kwargs):
        # TODO: DRY Code
        username = request.data.get("username")
        password = request.data.get("password")
        nickname = request.data.get("nickname")
        username_validated = is_valid_username(username)
        password_validated = is_valid_password(password)
        nickname_validated = is_valid_nickname(nickname)
        if not nickname_validated.get("success"):
            return make_response(**nickname_validated)
        if not username_validated.get("success"):
            return make_response(**username_validated)
        if not password_validated.get("success"):
            return make_response(**password_validated)
        if (
            int(request.data["code"])
            != TempUser.objects.get(email=request.data["email"]).verification_code
        ):
            return make_response(success=False)

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        profile, _ = Profile.objects.update_or_create(
            user=user,
            defaults=dict(
                nickname=nickname,
                first_name=request.data.get("first_name").strip(),
                last_name=request.data.get("last_name").strip(),
            ),
        )

        # 회원가입에 따른 모둠이로부터의 환영 DM
        send_welcome_message(recipient=profile)
        send_welcome_email(recipient=profile)

        return Response(
            {
                "user": ProfileSerializer(
                    profile, context=self.get_serializer_context()
                ).data,
                "token": AuthToken.objects.create(user)[
                    1
                ],  # create()가 tuple(instance, token)을 리턴하므로 [1]을 붙인다.
            }
        )


class AuthenticateProfileAPIView(generics.RetrieveAPIView):
    serializer_class = ProfileSerializer

    def get_object(self):
        if self.request.user.is_active:
            return self.request.user.profile
        else:
            return exceptions.NotFound


class RetrieveUpdateDestroyProfile(
    SerializerExtensionsAPIViewMixin, generics.RetrieveUpdateDestroyAPIView
):
    """
    Nickname에 해당하는 User의 프로필을 받고 수정 / 탈퇴
    """

    serializer_class = ProfileSerializer

    def get_object(self):
        profile = get_valid_profile(self.kwargs.get("nickname"))
        return profile

    def put(self, request, *args, **kwargs):
        raise exceptions.MethodNotAllowed(method="PUT", detail="Use PATCH, not PUT")

    def patch(self, request, *args, **kwargs):
        nickname_before = self.kwargs.get("nickname")
        check_self_profile(request, nickname_before)
        nickname_after = request.data.get("nickname", nickname_before)
        if nickname_before == "admin":
            request.data["nickname"] = "admin"  # 모둠이는 닉네임을 바꿀 수 없다
        if nickname_before != nickname_after:
            check_dict = is_valid_nickname(nickname_after)
            if not check_dict["success"]:
                return make_response(**check_dict)
        if "keywords" in request.data:
            request.data["keywords"] = get_or_create_keyword(request.data["keywords"])
        return self.partial_update(request, *args, **kwargs)

    def delete(self, request, *args, **kwargs):
        check_self_profile(request, self.kwargs.get("nickname"))
        instance = self.get_object()

        # enrollments 삭제
        enrollments = instance.enrollments.all()
        if enrollments.count():
            for enrollment in enrollments:
                e_modoom = enrollment.modoom
                if enrollment.is_leader:
                    # leader인 경우 모든 사람을 강퇴/거절시키고 modoom을 delete
                    for e in e_modoom.enrollments.all():
                        e_profile, e_accepted = e.profile, e.accepted
                        e.delete()
                        if e_accepted:
                            delete_enrollment(e_modoom, e_profile)
                    e_modoom.deleted = True
                    e_modoom.save()
                else:  # 모둠원이거나 승인 대기중인 경우는 삭제
                    enrollment.delete()
                    delete_enrollment(e_modoom, instance)
                    # TODO : 모둠원이 탈퇴했을 때 채팅방에 'OOO님이 나갔습니다.' 메시지 뜨도록.

        # comments, subcomments 삭제
        comments = instance.comments.filter(deleted=False)
        for c in comments:
            c.deleted = True
            c.save()

        subcomments = instance.subcomments.filter(deleted=False)
        for s in subcomments:
            s.deleted = True
            s.save()

        # 삭제에 따른 keywords, likes 수정
        instance.keywords.update(n_profiles=F("n_profiles") - 1)
        instance.liked_modooms.update(n_likes=F("n_likes") - 1)

        email = instance.pref_email
        name = instance.full_name

        try:
            self.perform_destroy(instance)
            send_goodbye_email(email=email, name=name)
            return make_response(
                success=True, message="회원 탈퇴가 완료되었습니다. 지금까지 이용해주셔서 감사합니다."
            )
        except Exception:
            return make_response(
                success=False, message="회원 탈퇴 중 오류가 발생했습니다. 관리자에게 문의해주세요."
            )

    def get_extensions_mixin_context(self):
        context = super().get_extensions_mixin_context()
        if self.request.method == "GET":
            context["expand"] = {"keywords"}
            context["only"] = set(PROFILE_FIELDS_TO_SHOW)
        return context


@api_view(["POST"])
@authentication_classes([])
@permission_classes([])
def send_verification_email(request):
    email = request.data["email"]
    if not email.endswith("@snu.ac.kr"):
        return make_response(success=False, message="SNU 메일이 아닙니다.")

    if User.objects.filter(email=email).exists():
        return make_response(success=False, message="사용할 수 없는 이메일입니다.")

    code = random.SystemRandom().randint(100000, 999999)
    TempUser.objects.update_or_create(
        email=email, defaults=dict(verification_code=code)
    )
    return send_code_email(email, code)


@api_view(["POST"])
@authentication_classes([])
@permission_classes([])
def verify_code(request):
    try:
        email = request.data["email"]
        code = request.data["code"]
    except KeyError:
        return make_response(success=False, message="인증에 실패했습니다.")
    temp_user = TempUser.objects.get(email=email)
    if temp_user.verification_code == int(code):
        return make_response()
    return make_response(success=False, message="인증에 실패했습니다.")


@api_view(["POST"])
@authentication_classes([])
@permission_classes([])
def send_reset_email(request):
    email = request.data.get("email", "")
    user = get_object_or_exception(User, email=email)
    code = random.SystemRandom().randint(100000, 999999)
    user.profile.reset_code = code
    user.save()
    return send_code_email(user.email, code)


@api_view(["POST"])
@authentication_classes([])
@permission_classes([])
def verify_reset_code(request):
    email = request.data.get("email", "")
    reset_code = int(request.data.get("code", 0))
    user = get_object_or_exception(User, email=email)
    if user.profile.reset_code != reset_code:
        return make_response(success=False, message="인증 코드가 일치하지 않습니다.")
    return make_response(success=True)


@api_view(["POST"])
@authentication_classes([])
@permission_classes([])
def reset_password(request):
    email = request.data.get("email", "")
    reset_code = int(request.data.get("code", 0))
    password = request.data.get("password")
    validation = is_valid_password(password)
    if not validation["success"]:
        return make_response(**validation)
    user = get_object_or_exception(User, email=email)
    if user.profile.reset_code != reset_code:
        return make_response(success=False, message="인증 코드가 일치하지 않습니다.")
    user.set_password(password)
    user.profile.reset_code = None
    user.save()
    return make_response(
        success=True, message="비밀번호가 성공적으로 변경되었습니다! 새로운 비밀번호로 로그인해주세요."
    )


@api_view(["POST"])
@authentication_classes([])
@permission_classes([])
def send_username(request):
    email = request.data.get("email", "")
    user = get_object_or_exception(User, email=email)
    return send_code_email(user.email, user.username)


@api_view(["POST"])
@authentication_classes([])
@permission_classes([])
def validate_user_data(request):
    """
    유저 아이디와 비밀번호의 유효성을 검증한다.
    TODO: DRY Code
    """
    step = request.data.get("step")
    if step == 1:
        username = request.data.get("username")
        password = request.data.get("password")
        username_validated = is_valid_username(username)
        password_validated = is_valid_password(password)
        if not username_validated.get("success"):
            return make_response(**username_validated)
        if not password_validated.get("success"):
            return make_response(**password_validated)
    return make_response()


@api_view(["POST"])
def change_password(request):
    user = request.user
    current_password = request.data.get("current_password")
    if check_password(current_password, user.password):
        new_password = request.data.get("password1")
        password_confirm = request.data.get("password2")
        if new_password == password_confirm:
            password_validated = is_valid_password(new_password)
            if not password_validated.get("success"):
                return make_response(**password_validated)
            user.set_password(new_password)
            user.save()
            return make_response(success=True, message="비밀번호가 성공적으로 변경되었습니다.")
    return make_response(success=False, message="비밀번호가 일치하지 않습니다.")


# TODO : 회원탈퇴 구현 시 keywrod, enrollment 같이 지워지도록 #
# 현재는 users/models.py에 receiver로 구현해 놓음
