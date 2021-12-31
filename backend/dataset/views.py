from rest_framework.viewsets import ModelViewSet
from .serializers import DatasetSerializer, COCODatasetSerializer
from .models import Dataset, COCODataset
from picture.models import Picture
from rest_framework.decorators import action
from rest_framework.response import Response
import os
from pathlib import Path
from django.core.files import File
from django.http import HttpResponse, Http404, StreamingHttpResponse

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

class COCODatasetViewset(ModelViewSet):

    serializer_class = COCODatasetSerializer
    queryset = COCODataset.objects.all()

    @action(methods=['POST'], url_path='annotate', detail=False)
    def COCO_annotation(self, req):

        dataset = Dataset.objects.get(id=req.data.get('dataset'))
        annotation = req.data.get('annotation')

        res = {
            'code': 0,
            'msg': '',
            'data': {}
        }

        if not all([dataset, annotation]):
            res['msg'] = '参数异常'
            return Response(res)

        # print(dataset)
        # print(annotation)

        BASE_DIR = Path(__file__).resolve().parent.parent
        MEDIA_ROOT = os.path.join(BASE_DIR, 'media').replace('\\', '/')
        JSON_PATH = os.path.join(MEDIA_ROOT, "file").replace('\\', '/')

        json_abs_path = os.path.join(JSON_PATH, str(dataset.id))+"_COCO.json"
        filename = str(dataset.id)+"_COCO.json"

        with open(json_abs_path, 'w+') as f:
            f.write(annotation)
            if COCODataset.objects.filter(dataset=dataset.id).first() == None:
                new_COCODataset = COCODataset.objects.create(
                    dataset = dataset, 
                    annotation = None
                )
                new_COCODataset.annotation.save(filename, File(f))
            else:
                COCOData = COCODataset.objects.get(dataset=dataset.id)
                COCOData.annotation.delete()
                COCOData.annotation.save(filename, File(f))

        res['msg'] = '提交成功'
        res['code'] = 1
        res['data'] = {}
        return Response(res)

    @action(methods=['POST'], url_path='download', detail=False)
    def COCO_download(self, req):

        dataset = Dataset.objects.get(id=req.data.get('dataset'))
        
        res = {
            'code': 0,
            'msg': '',
            'data': {}
        }

        if not all([dataset]):
            res['msg'] = '参数异常'
            return Response(res)

        file_path = COCODataset.objects.get(dataset=dataset).annotation.path

        try:
            res = StreamingHttpResponse(open(file_path, 'rb'))
            res['content_type'] = "application/octet-stream"
            res['Content-Disposition'] = 'attachment; filename=' + os.path.basename(file_path)
            return res
        except Exception:
            res['msg'] = '下载出错'
            return Response(res)
