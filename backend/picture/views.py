from django import urls
from rest_framework.viewsets import ModelViewSet
from .serializers import PictureSerializer
from .models import Picture, VOCPicture
from dataset.models import Dataset
from rest_framework.decorators import action
from rest_framework.response import Response
from django.contrib.auth.models import User
import cv2
import random, datetime, os
import xmltodict
from .serializers import PictureSerializer, VOCPictureSerializer
from rest_framework.parsers import JSONParser, FormParser, MultiPartParser
from pathlib import Path
from django.core.files import File
from django.core.files.images import ImageFile

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

    @action(methods=['POST'], url_path='video', detail=False)
    def upload_video(self, request):
        res = {
            'code': 0,
            'msg': '',
            'data': {}
        }

        if request.method == 'POST':
            owner = User.objects.get(id=request.data.get('owner'))
            file = request.FILES.get("file")

            res = {
                'code': 0,
                'msg': '',
                'data': {}
            }

            if not all([file, owner]):
                res['msg'] = '参数异常'
                return Response(res)

            BASE_DIR = Path(__file__).resolve().parent.parent
            MEDIA_ROOT = os.path.join(BASE_DIR, 'media').replace('\\', '/')

            # 视频保存目录
            video_path = os.path.join(MEDIA_ROOT, "video").replace('\\', '/')
            video_name = datetime.datetime.now().strftime("%Y%m%d%H%M%S") + str(random.randint(1, 99)) + file.name.split('.')[0]
            video_abs_path = os.path.join(video_path, video_name + '.' + file.name.split('.')[-1])

            try:
                with open(video_abs_path, 'wb+') as f:
                    f.write(file.read())
            except Exception as e:
                print(e)
                res['msg'] = '文件写入错误'
                res['code'] = 500
                res['data'] = {}
                return Response(res)

            # 视频截取
            vc = cv2.VideoCapture(video_abs_path)
            c = 0
            frameRate = 200  # 帧数截取间隔（每隔200帧截取一帧）
            if vc.isOpened():  # 判断是否正常打开
                try:
                    while (True):
                        ret, frame = vc.read()
                        if(ret):
                            if (c%frameRate == 0):
                                # print("开始截取视频第：" + str(c) + " 帧")
                                snapshot_abs_path = os.path.join(video_path, "snapshot", video_name)+"_"+str(c)+".jpg"
                                cv2.imwrite(snapshot_abs_path, frame)  # 存储为图像
                                with open(snapshot_abs_path, 'rb') as f:
                                    file_name = video_name+str(c)+".jpg"
                                    new_pic = Picture.objects.create(pic = None,
                                        filename = file_name,
                                        owner = owner)
                                    new_pic.pic.save(file_name, ImageFile(f))
                            c += 1
                            cv2.waitKey(0)
                        else:
                            # print("所有帧都已经保存完成")
                            break
                    vc.release()
                    res['msg'] = '存储成功'
                    res['code'] = 1
                    res['data'] = {}
                    return Response(res)                    
                except Exception as e:
                    print(e)
                    res['msg'] = '模型创建错误'
                    res['code'] = 500
                    res['data'] = {}
                    return Response(res)
            else:
                res['msg'] = '视频无法正常打开'
                res['code'] = 500
                res['data'] = {}
                return Response(res)
        else:
            res['msg'] = '请求方式错误'
            res['code'] = 500
            res['data'] = {}
            return Response(res)

class VOCPictureViewset(ModelViewSet):

    serializer_class = VOCPictureSerializer
    queryset = VOCPicture.objects.all()

    @action(methods=['POST'], url_path='annotate', detail=False)
    def VOC_annotation(self, req):

        pics = req.data.get('images')
        annotations = req.data.get('annotations')

        res = {
            'code': 0,
            'msg': '',
            'data': {}
        }

        if not all([pics, annotations]):
            res['msg'] = '参数异常'
            return Response(res)

        BASE_DIR = Path(__file__).resolve().parent.parent
        MEDIA_ROOT = os.path.join(BASE_DIR, 'media').replace('\\', '/')
        XML_PATH = os.path.join(MEDIA_ROOT, "file").replace('\\', '/')

        for i in range(len(pics)):
            xmlstr = xmltodict.unparse(annotations[i])
            xml_abs_path = os.path.join(XML_PATH, str(pics[i]))+"_VOC.xml"
            pic = Picture.objects.get(id=pics[i])
            filename = str(pics[i])+"_VOC.xml"

            with open(xml_abs_path, 'w+') as f:
                f.write(xmlstr)
                if VOCPicture.objects.filter(pic=pics[i]).first() == None:
                    new_VOCPicture = VOCPicture.objects.create(
                        pic = pic,
                        annotation = None
                    )
                    new_VOCPicture.annotation.save(filename, File(f))
                else:
                    VOCPic = VOCPicture.objects.get(pic=pics[i])
                    VOCPic.annotation.delete()
                    VOCPic.annotation.save(filename, File(f))

        res['msg'] = '提交成功'
        res['code'] = 1
        res['data'] = {}
        return Response(res) 

    @action(methods=['POST'], url_path='download', detail=False)
    def VOC_download(self, req):

        dataset = Dataset.objects.get(id=req.data.get('dataset'))

        res = {
            'code': 0,
            'msg': '',
            'data': {}
        }

        if not all([dataset]):
            res['msg'] = '参数异常'
            return Response(res)

        print(dataset)
        print(dataset.pics.all())
        data = []
        for item in dataset.pics.all():
            VocPic = VOCPicture.objects.get(pic=item)
            new_data_item = {
                'id': item.id,
                'url': VocPic.annotation.url
            }
            data.append(new_data_item)

        print(data)
        
        res['msg'] = '导出成功'
        res['code'] = 1
        res['data'] = data
        return Response(res)