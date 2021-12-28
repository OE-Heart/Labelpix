from django.urls import include, path
from rest_framework import routers
from .views import DatasetViewset

router = routers.DefaultRouter()

router.register(r'dataset', DatasetViewset)

urlpatterns = [
   path('', include(router.urls)),
]