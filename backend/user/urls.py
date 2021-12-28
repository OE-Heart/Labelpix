from django.urls import include, path
from rest_framework import routers
from .views import UserViewset

router = routers.DefaultRouter()

router.register(r'user', UserViewset)

urlpatterns = [
       path('', include(router.urls)),
    ]