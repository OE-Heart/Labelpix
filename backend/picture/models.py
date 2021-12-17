from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class Picture(models.Model):
    pic = models.ImageField(upload_to='pic')
    owner = models.ForeignKey(User, on_delete=models.CASCADE)

class VOCPicture(models.Model):
    pic = models.OneToOneField(Picture, on_delete=models.CASCADE)
    folder = models.CharField(max_length=20)
    filename = models.CharField(max_length=20)
    source_database = models.CharField(max_length=20)
    source_annotation = models

class  COCOPicture(models.Model):
    pic = models.OneToOneField(Picture, on_delete=models.CASCADE)