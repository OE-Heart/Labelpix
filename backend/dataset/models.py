from django.db import models
from picture.models import Picture

# Create your models here.

class Dataset(models.Model):
    name = models.CharField(max_length=15)
    description = models.TextField()
    pics = models.ManyToManyField(Picture)
