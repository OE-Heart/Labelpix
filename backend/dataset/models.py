from django.db import models
from picture.models import Picture

# Create your models here.

class Dataset(models.Model):
    name = models.CharField(max_length=15)
    description = models.TextField()

class  DatasetHasPic(models.Model):
    dataset = models.ForeignKey(Dataset, on_delete=models.CASCADE)
    pic = models.ForeignKey(Picture, on_delete=models.CASCADE)
