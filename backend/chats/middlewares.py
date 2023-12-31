from channels.auth import AuthMiddlewareStack
from channels.db import database_sync_to_async
from knox.auth import TokenAuthentication
from django.contrib.auth.models import AnonymousUser
from rest_framework.exceptions import AuthenticationFailed
from channels.middleware import BaseMiddleware

import re


@database_sync_to_async
def get_user(token_key):
    if token_key is None:
        return AnonymousUser

    try:
        user, token = TokenAuthentication().authenticate_credentials(
            token_key.encode("ascii")
        )
        return user
    except AuthenticationFailed:
        return AnonymousUser()


class TokenAuthMiddleware(BaseMiddleware):
    def __init__(self, inner):
        super().__init__(inner)

    async def __call__(self, scope, receive, send):
        subprotocols = scope.get(
            "subprotocols", []
        )  # Authorization header 부재로 인한 workaround
        if len(subprotocols):
            scope["user"] = await get_user(subprotocols[1])
        else:
            scope["user"] = AnonymousUser()
        return await super().__call__(scope, receive, send)


def TokenAuthMiddlewareStack(inner):
    return TokenAuthMiddleware(AuthMiddlewareStack(inner))
