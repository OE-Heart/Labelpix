# Generated by Django 4.0 on 2021-12-20 12:05

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('task', '0004_alter_task_name'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='task',
            name='complete_time',
        ),
    ]
