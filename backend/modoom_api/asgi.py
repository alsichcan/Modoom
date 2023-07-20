"""
ASGI config for modoom_api project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/3.1/howto/deployment/asgi/
"""

from .wsgi import *
import os
from django.core.asgi import get_asgi_application
import chats.routing
from chats.middlewares import TokenAuthMiddlewareStack

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "modoom_api.settings.development")
django_asgi_app = get_asgi_application()

from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter

application = ProtocolTypeRouter(
    {
        "http": django_asgi_app,
        # Just HTTP for now. (We can add other protocols later.)
        "websocket": TokenAuthMiddlewareStack(
            URLRouter(chats.routing.websocket_urlpatterns)
        ),
    }
)
