from rest_framework.viewsets import ModelViewSet
from .serializers import PictureSerializer
from .models import Picture, VOCPicture, COCOPicture
from rest_framework.decorators import action
from django.contrib.auth import login
from rest_framework.response import Response

# Create your views here.

class PictureViewset(ModelViewSet):


    def upload_picture(req):

    def upload_video(req):

    def download_picture(req):

    def label_voc_picture(req):

    def label_coco_picture(req):