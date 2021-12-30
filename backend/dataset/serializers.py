from rest_framework import serializers
from .models import Dataset, COCODataset

class DatasetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Dataset
        fields = '__all__'

class COCODatasetSerializer(serializers.ModelSerializer):
    class Meta:
        model = COCODataset
        fields = '__all__'