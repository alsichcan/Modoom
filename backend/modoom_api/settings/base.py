"""
Django settings for modoom_api project.

Generated by 'django-admin startproject' using Django 3.1.5.

For more information on this file, see
https://docs.djangoproject.com/en/3.1/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/3.1/ref/settings/
"""
import os
from pathlib import Path
from datetime import timedelta
import sentry_sdk
from sentry_sdk.integrations.django import DjangoIntegration

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent.parent


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/3.1/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = ""

# Sentry
sentry_sdk.init(
    dsn="https://a3241abaed404e8dbca8ce97c4a3c823@o537965.ingest.sentry.io/5655797",
    integrations=[DjangoIntegration()],
    traces_sample_rate=0.1,
    # If you wish to associate users to errors (assuming you are using
    # django.contrib.auth) you may enable sending PII data.
    send_default_pii=True,
)

# Application definition

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "rest_framework_serializer_extensions",
    "knox",
    "chats",
    "users",
    "feeds",
    "keywords",
    "relationships",
    "notifications",
    "channels",
    "corsheaders",
    # "debug_toolbar",
    "rest_framework",
    "polymorphic",
    "import_export",
]

MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    # "debug_toolbar.middleware.DebugToolbarMiddleware",
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "modoom_api.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [os.path.join(BASE_DIR, "templates")],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": ("knox.auth.TokenAuthentication",),  # added
    "DEFAULT_PERMISSION_CLASSES": [
        "rest_framework.permissions.IsAuthenticated",
    ],
    "EXCEPTION_HANDLER": "modoom_api.exception_handler.custom_exception_handler",
    "DEFAULT_PAGINATION_CLASS": "modoom_api.paginations.CustomCursorPagination",
    "PAGE_SIZE": 20,
}

REST_KNOX = {
    "TOKEN_TTL": timedelta(days=7),
}

WSGI_APPLICATION = "modoom_api.wsgi.application"

# Password validation
# https://docs.djangoproject.com/en/3.1/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
]


# Internationalization
# https://docs.djangoproject.com/en/3.1/topics/i18n/

LANGUAGE_CODE = "en-us"

TIME_ZONE = "Asia/Seoul"

USE_I18N = True

USE_L10N = True

USE_TZ = False


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/3.1/howto/static-files/

STATIC_URL = "/static/"
STATIC_ROOT = os.path.join(BASE_DIR, "static")

# Email Configurations
EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"
EMAIL_USE_SSL = True
EMAIL_HOST = "mail.privateemail.com"
EMAIL_HOST_USER = "admin@modoom.us"
EMAIL_HOST_PASSWORD = "Imagine@1215"
EMAIL_PORT = 465


# Channels
ASGI_APPLICATION = "modoom_api.asgi.application"

# S3 Settings
DEFAULT_FILE_STORAGE = "modoom_api.storages.CachedS3Boto3Storage"
MEDIAFILES_LOCATION = "media"

# S3 Access
AWS_ACCESS_KEY_ID = "AKIAJGSNYWCL3TJWUIUQ"
AWS_SECRET_ACCESS_KEY = "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"
AWS_STORAGE_BUCKET_NAME = "modoom-media-files"
AWS_S3_REGION_NAME = "ap-northeast-2"
AWS_S3_SIGNATURE_VERSION = "s3v4"
AWS_DEFAULT_ACL = "private"
