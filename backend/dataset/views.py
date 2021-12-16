from rest_framework.viewsets import ModelViewSet
from .serializers import DatasetSerializer
from .models import Dataset
from rest_framework.decorators import action
from django.contrib.auth import login
from rest_framework.response import Response

# Create your views here.

class DatasetViewset(ModelViewSet):


    def create_dataset(req):

    def export_dataset(req):
