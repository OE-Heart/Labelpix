from rest_framework.viewsets import ModelViewSet
from .serializers import DatasetSerializer
from .models import Dataset
from picture.models import Picture
from rest_framework.decorators import action
from django.contrib.auth import login
from rest_framework.response import Response

# Create your views here.

class DatasetViewset(ModelViewSet):

    serializer_class = DatasetSerializer
    queryset = Dataset.objects.all()

    @action(methods=['POST'], url_path='create', detail=False)
    def create_dataset(self, request):

        print(request.data)

        name = request.data.get('name')
        description = request.data.get('description')
        picList = request.data.get('pics')
        print(picList)

        res = {
            'code': 0,
            'msg': '',
            'data': {}
        }
        if not all([name, description, picList]):
            res['msg'] = '参数异常'
            return Response(res)

        new_dataset = Dataset.objects.create(
            name = name,
            description = description,
        )

        pics = Picture.objects.filter(id__in=picList)
        new_dataset.pics.set(pics)
        new_dataset.save()

        res['msg'] = '创建成功'
        res['code'] = 1
        res['data'] = {}
        return Response(res)

    # def export_dataset(req):
