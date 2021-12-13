from django.conf.urls import url, include
from rest_framework import routers
from .views import UserViewset

router = routers.DefaultRouter()

router.register(r'user', UserViewset)

urlpatterns = [
        url(r'', include(router.urls)),
    ]