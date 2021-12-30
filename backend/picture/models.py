from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class Picture(models.Model):
    filename = models.CharField(max_length=60, default='filename')
    pic = models.ImageField(upload_to='pic')
    owner = models.ForeignKey(User, on_delete=models.CASCADE)

class VOCPicture(models.Model):
    pic = models.OneToOneField(Picture, on_delete=models.CASCADE)
    annotation = models.FileField(upload_to='VOC')