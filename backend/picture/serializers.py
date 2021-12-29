from rest_framework import serializers
from .models import Picture, VOCPicture, COCOPicture

class PictureSerializer(serializers.ModelSerializer):
    class Meta:
        model = Picture
        fields = ['id', 'filename', 'pic', 'owner']

class VOCPictureSerializer(serializers.ModelSerializer):
    class Meta:
        model = VOCPicture
        fields = '__all__'

class COCOPictureSerializer(serializers.ModelSerializer):
    class Meta:
        model = COCOPicture
        fields = '__all__'
