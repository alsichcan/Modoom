import re
from django.contrib.auth.password_validation import (
    validate_password as is_usable_password,
)
from django.core.exceptions import ValidationError
from users.models import *
from rest_framework import exceptions


def is_valid_nickname(nickname) -> dict:
    if re.match(r"^[a-z0-9._]{0,50}$", nickname) is None:
        return dict(
            success=False, message="영문 소문자, 숫자, 특수문자(_/.)만으로 이루어진 50자 이내의 별명을 입력해주세요."
        )
    if Profile.objects.filter(nickname=nickname).exists():
        return dict(success=False, message="이미 사용중인 별명입니다.")

    return dict(success=True)


def is_valid_username(username) -> dict:
    if re.match(r"^[a-zA-Z0-9.@+-]{0,50}$", username) is None:
        return dict(success=False, message="유효하지 않은 아이디입니다.")
    if User.objects.filter(username=username).exists():
        return dict(success=False, message="사용할 수 없는 아이디입니다.")
    return dict(success=True)


def is_valid_password(password) -> dict:
    if password is None:
        return dict(success=False, message="비밀번호를 입력해주세요.")
    if re.search(r"[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]", password) is not None:
        return dict(success=False, message="비밀번호는 한글을 포함할 수 없습니다.")
    try:
        is_usable_password(password)
    except ValidationError as e:
        first_error = e.messages[0]
        if "similar" in first_error:
            message = "비밀번호가 회원 정보와 지나치게 유사합니다."
        elif "at least" in first_error:
            message = "비밀번호는 최소 8자 이상이어야 합니다."
        elif "common" in first_error:
            message = "비밀번호는 자주 사용되는 단어를 포함할 수 없습니다."
        elif "numeric" in first_error:
            message = "비밀번호는 숫자로만 이루어질 수 없습니다."
        else:
            message = first_error
        return dict(success=False, message=message)
    else:
        return dict(success=True)


def get_valid_profile(nickname):
    try:
        return Profile.objects.get(nickname=nickname)
    except Profile.DoesNotExist:
        raise exceptions.NotFound(detail="별명 %s에 해당하는 사용자가 존재하지 않습니다." % nickname)


def check_self_profile(request, nickname):
    if request.user.profile.nickname != nickname:
        raise exceptions.PermissionDenied(detail="자기 자신에 대해서만 호출할 수 있는 요청입니다.")
