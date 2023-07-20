"""modoom_api URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
import debug_toolbar
from .views import index

urlpatterns = [
    path("G7aF_aYf6w0U_126fr._7gfZHSaw/admin/", admin.site.urls),
    path("users/", include("users.urls")),
    path("keywords/", include("keywords.urls")),
    path("chats/", include("chats.urls")),
    path("notifications/", include("notifications.urls")),
    path("relationships/", include("relationships.urls")),
    path("", include("feeds.urls")),
    path("", index),
]

urlpatterns = [
    path("__debug__/", include(debug_toolbar.urls)),
] + urlpatterns
