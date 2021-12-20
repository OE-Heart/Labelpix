from django.urls import include, path
from rest_framework import routers
from .views import TaskViewset

router = routers.DefaultRouter()

router.register(r'task', TaskViewset)

urlpatterns = [
   path('', include(router.urls)),
]