from .base import *

DEBUG = False

ALLOWED_HOSTS = ["api.modoom.us", "*"]
CORS_ORIGIN_ALLOW_ALL = True
CORS_ORIGIN_WHITELIST = ("https://modoom.us",)


DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": "ebdb",
        "USER": "modoom",
        "PASSWORD": "Imagine1215",
        "HOST": "aam4fq31t9r8pr.cbsnsgdglqyo.ap-northeast-2.rds.amazonaws.com",
        "PORT": "5432",
    }
}
CHANNEL_LAYERS = {
    "default": {
        "BACKEND": "channels_redis.core.RedisChannelLayer",
        "CONFIG": {
            "hosts": [
                (
                    "django-channels-redis-001.ebngj7.0001.apn2.cache.amazonaws.com",
                    6379,
                )
            ],
        },
    },
}
