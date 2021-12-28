from rest_framework import serializers
from .models import Picture

class PictureSerializer(serializers.ModelSerializer):
    class Meta:
        model = Picture
        fields = ['id', 'filename', 'pic', 'owner']

# class VOCPictureSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = VOCPicture
#         fields = '__all__'
