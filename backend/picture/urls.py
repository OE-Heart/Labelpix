from django.urls import include, path
from rest_framework import routers
from .views import PictureViewset, VOCPictureViewset, COCOPictureViewset

router = routers.DefaultRouter()

router.register(r'picture', PictureViewset)
router.register(r'VOC', VOCPictureViewset)
router.register(r'COCO', COCOPictureViewset)

urlpatterns = [
   path('', include(router.urls)),
]