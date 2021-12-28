from django.urls import include, path
from rest_framework import routers
from .views import PictureViewset

router = routers.DefaultRouter()

router.register(r'picture', PictureViewset)

urlpatterns = [
   path('', include(router.urls)),
]