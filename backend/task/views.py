from os import error
from rest_framework.viewsets import ModelViewSet
from .serializers import TaskSerializer
from .models import Task
from dataset.models import Dataset
from django.contrib.auth.models import User
from rest_framework.decorators import action
from django.contrib.auth import login
from rest_framework.response import Response

# Create your views here.

class TaskViewset(ModelViewSet):

    serializer_class = TaskSerializer
    queryset = Task.objects.all()
    
    @action(methods=['POST'], url_path='create', detail=False)
    def create_task(self, request):

        print(request.data)

        name = request.data.get('name')
        description = request.data.get('description')
        task_type = request.data.get('type')
        state = 'W'
        creat_user = User.objects.get(id=request.data.get('creat_user'))
        dataset = Dataset.objects.get(id=request.data.get('dataset'))

        print(dataset)

        res = {
            'code': 0,
            'msg': '',
            'data': {}
        }
        if not all([name, description, task_type, state, creat_user, dataset]):
            res['msg'] = '参数异常'
            return Response(res)
        
        new_task = Task.objects.create(
            name = name,
            description = description,
            type = task_type,
            state = state,
            creat_user = creat_user,
            dataset = dataset,
        )

        res['msg'] = '创建成功'
        res['code'] = 1
        res['data'] = {}
        return Response(res)
        

    @action(methods=['POST'], url_path='take', detail=False)
    def take_task(self, request):

        print(request.data)

        task = Task.objects.get(id=request.data.get('id'))
        take_user = User.objects.get(id=request.data.get('take_user'))

        res = {
            'code': 0,
            'msg': '',
            'data': {}
        }
        if not all([task, take_user]):
            res['msg'] = '参数异常'
            return Response(res)

        task.take_user = take_user
        task.state = 'P'
        task.save()

        res['msg'] = '领取成功'
        res['code'] = 1
        res['data'] = {}
        return Response(res)

    @action(methods=['POST'], url_path='complete', detail=False)
    def complete_task(self, request):

        print(request.data)

        task = Task.objects.get(id=request.data.get('id'))

        res = {
            'code': 0,
            'msg': '',
            'data': {}
        }
        if not all([task]):
            res['msg'] = '参数异常'
            return Response(res)

        task.state = 'D'
        task.save()

        res['msg'] = '提交成功'
        res['code'] = 1
        res['data'] = {}
        return Response(res)