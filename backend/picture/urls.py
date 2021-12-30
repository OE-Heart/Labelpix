from django.urls import include, path
from rest_framework import routers
from .views import PictureViewset, VOCPictureViewset

router = routers.DefaultRouter()

router.register(r'picture', PictureViewset)
router.register(r'VOC', VOCPictureViewset)

urlpatterns = [
   path('', include(router.urls)),
]