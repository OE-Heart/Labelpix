from django.db.models import query
from rest_framework.viewsets import ModelViewSet
from .serializers import PictureSerializer
from .models import Picture, VOCPicture, COCOPicture
from rest_framework.decorators import action
from rest_framework.response import Response
from django.contrib.auth.models import User
from .serializers import PictureSerializer
from rest_framework.parsers import JSONParser, FormParser, MultiPartParser

# Create your views here.

class PictureViewset(ModelViewSet):
    '''
    图像类
    '''
    parser_classes = [JSONParser, FormParser, MultiPartParser, ]
    serializer_class = PictureSerializer
    queryset = Picture.objects.all()

    @action(methods=['POST'], url_path='upload', detail=False)
    def upload_picture(self, req):
        '''
        上传
        :param request: 用于传参数，必要参数 pic: 图像 owner: 拥有者
        :return:
        '''

        print(req.data)
        print(req.FILES)

        pic = req.FILES.get('pic')
        filename = pic.name
        owner = User.objects.get(id=req.data.get('owner'))

        res = {
            'code': 0,
            'msg': '',
            'data': {}
        }

        if not all([pic, filename, owner]):
            res['msg'] = '参数异常'
            return Response(res)
        
        new_pic = Picture(
            pic = pic,
            filename = filename,
            owner = owner
        )
        new_pic.save()

        res['msg'] = '上传成功'
        res['code'] = 1
        res['data'] = {}
        return Response(res)

    @action(methods=['POST'], url_path='list', detail=False)
    def picture_list_of_owner(self, req):

        owner = User.objects.get(id=req.data.get('owner'))

        res = {
            'code': 0,
            'msg': '',
            'data': {}
        }

        if not all([owner]):
            res['msg'] = '参数异常'
            return Response(res)
        
        picture_list = Picture.objects.filter(owner=owner)
        print(picture_list)

        res['msg'] = '查询成功'
        res['code'] = 1
        res['data'] = {}
        return Response(res)

    # @action(methods=['POST'], url_path='download', detail=False)
    # def download_picture(req):
        
    # def upload_video(req):

    # def label_voc_picture(req):

    # def label_coco_picture(req):