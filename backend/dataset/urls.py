from django.urls import include, path
from rest_framework import routers
from .views import DatasetViewset, COCODatasetViewset

router = routers.DefaultRouter()

router.register(r'dataset', DatasetViewset)
router.register(r'COCO', COCODatasetViewset)

urlpatterns = [
   path('', include(router.urls)),
]