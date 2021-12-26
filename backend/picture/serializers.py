from django.db.models import fields
from django.db.models.fields import files
from rest_framework import serializers
from .models import Picture, VOCPicture

class PictureSerializer(serializers.ModelSerializer):
    class Meta:
        model = Picture
        fields = ['id', 'filename', 'pic', 'owner']

class VOCPictureSerializer(serializers.ModelSerializer):
    class Meta:
        model = VOCPicture
        fields = '__all__'
