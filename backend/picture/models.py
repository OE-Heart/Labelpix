from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class Picture(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    URI = models.CharField()

class VOCPicture(models.Model):
    pic = models.OneToOneField(Picture, on_delete=models.CASCADE)
    folder = models.CharField(max_length=20)
    filename = models.CharField(max_length=20)
    source_database = models.CharField(max_length=20)
    source_annotation = models

class  COCOPicture(models.Model):
    pic = models.OneToOneField(Picture, on_delete=models.CASCADE)