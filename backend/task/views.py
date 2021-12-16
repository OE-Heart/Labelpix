from os import error
from rest_framework.viewsets import ModelViewSet
from .serializers import TaskSerializer
from .models import Task
from rest_framework.decorators import action
from django.contrib.auth import login
from rest_framework.response import Response

# Create your views here.

class TaskViewset(ModelViewSet):

    serializer_class = TaskSerializer
    queryset = Task.objects.all()
    
    @action(methods=['POST'], url_path='create', detail=False)
    def create_task(req):

    @action(methods=['POST'], url_path='take', detail=False)
    def take_task(req):

    @action(methods=['POST'], url_path='complete', detail=False)
    def complete_task(req):
