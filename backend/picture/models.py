from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class Picture(models.Model):
    filename = models.CharField(max_length=60, default='filename')
    pic = models.ImageField(upload_to='pic')
    owner = models.ForeignKey(User, on_delete=models.CASCADE)

class VOCPicture(models.Model):
    pic = models.OneToOneField(Picture, on_delete=models.CASCADE)
    folder = models.CharField(max_length=20)
    filename = models.CharField(max_length=60)
    width = models.IntegerField()
    height = models.IntegerField()
    depth = models.IntegerField()
    SEGMENTED_CHOICE = [
        (1, 'Image Segmentation'),
        (0, 'Target Recognition')
    ]
    segmented = models.IntegerField(choices=SEGMENTED_CHOICE, default=0)
    name = models.CharField(max_length=20)
    xmin = models.IntegerField()
    xmax = models.IntegerField()
    ymin = models.IntegerField()
    ymax = models.IntegerField()
    TRUNCATED_CHOICE = [
        (1, 'Is Truncated'),
        (0, 'Is Not Truncated')
    ]
    truncated = models.IntegerField(max_length=1, choices=TRUNCATED_CHOICE, default=0)
    DIFFICULT_CHOICE = [
        (1, 'Is DIfficult'),
        (0, 'Is Not Difficult')
    ]
    difficult = models.IntegerField(max_length=1, choices=DIFFICULT_CHOICE, default=0)

class  COCOPicture(models.Model):
    pic = models.OneToOneField(Picture, on_delete=models.CASCADE)