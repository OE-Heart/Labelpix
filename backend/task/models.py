from django.db import models
from django.contrib.auth.models import User
from dataset.models import Dataset

# Create your models here.

class Task(models.Model):
    name = models.CharField(max_length=200, unique=True)
    description = models.TextField()
    VOC = 'V'
    COCO = 'C'
    TYPE_CHOICES = [
        (VOC, 'VOC format dataset'),
        (COCO, 'COCO format dataset'),
    ]
    type = models.CharField(max_length=1, choices=TYPE_CHOICES, default=VOC)
    create_time = models.DateTimeField(auto_now_add=True)
    creat_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='creat_user')
    take_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='take_user', null=True)
    # complete_time = models.DateTimeField(null=True)
    dataset = models.ForeignKey(Dataset, on_delete=models.CASCADE, null=True)
    WAITING = 'W'
    PENDING = 'P'
    DONE = 'D'
    STATE_CHOICES = [
        (WAITING, 'Task is waitng to be taken'),
        (PENDING, 'Tasking is pending'),
        (DONE, 'Task is done'),
    ]
    state = models.CharField(max_length=1, choices=STATE_CHOICES, default=WAITING)