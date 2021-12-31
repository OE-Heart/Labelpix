import { message } from "antd";
import React from "react";
import ReactImageAnnotate from "react-image-annotate";
import "./Annotation.css";
import axios from "axios";

const categories = [
  {'supercategory': 'Person', 'id': 1, 'name': 'Person'},
  {'supercategory': 'Animal', 'id': 2, 'name': 'Bird'},
  {'supercategory': 'Animal', 'id': 3, 'name': 'Cat'},
  {'supercategory': 'Animal', 'id': 4, 'name': 'Cow'},
  {'supercategory': 'Animal', 'id': 5, 'name': 'Dog'},
  {'supercategory': 'Animal', 'id': 6, 'name': 'Horse'},
  {'supercategory': 'Animal', 'id': 7, 'name': 'Sheep'},
  {'supercategory': 'Vehicle', 'id': 8, 'name': 'Aeroplane'},
  {'supercategory': 'Vehicle', 'id': 9, 'name': 'Bicycle'},
  {'supercategory': 'Vehicle', 'id': 10, 'name': 'Boat'},
  {'supercategory': 'Vehicle', 'id': 11, 'name': 'Bus'},
  {'supercategory': 'Vehicle', 'id': 12, 'name': 'Car'},
  {'supercategory': 'Vehicle', 'id': 13, 'name': 'Motorbike'},
  {'supercategory': 'Vehicle', 'id': 14, 'name': 'Train'},
  {'supercategory': 'Indoor', 'id': 15, 'name': 'Bottle'},
  {'supercategory': 'Indoor', 'id': 16, 'name': 'Chair'},
  {'supercategory': 'Indoor', 'id': 17, 'name': 'Dining table'},
  {'supercategory': 'Indoor', 'id': 18, 'name': 'Potted plant'},
  {'supercategory': 'Indoor', 'id': 19, 'name': 'Sofa'},
  {'supercategory': 'Indoor', 'id': 20, 'name': 'TV'},
]

class Annotation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      images: [
        {
          src: "",
          name: "",
          regions: []
        },
      ],
      picList: [],
      selectedImage: 0,
      viewedAll: false,
      exited: false,
    };
  }

  getData = async () =>{
    let url = "http://localhost:8000/dataset/"+this.props.selectedTask.dataset+"/"
    var res = await axios.get(url, {headers: {"Content-Type": "application/json"}})
    var picList = res.data.pics

    this.setState({picList})

    const images = []
    for (var pic_id of picList) {
      url = "http://localhost:8000/picture/"+pic_id+"/"
      var annotations = await axios.get(url, {headers: {"Content-Type": "application/json"}})
      // console.log(annotations.data)
      var item = {
        src: annotations.data.pic,
        name: annotations.data.filename,
        regions: []
      }

      images.push(item)
    }
    
    return images;
  }

  componentDidMount() {
    this.getData().then(res => {
      this.setState({images: res, loading: false});
    });
  }

  handleNext = () => {
    if (this.state.selectedImage === this.state.images.length-1) {
      message.info("已经是最后一个了")
    }
    else{
      if (this.state.selectedImage === this.state.images.length-2) {
        this.setState({viewedAll: true})
      }
      this.setState({selectedImage: this.state.selectedImage+1})
    }
  }

  handlePrev = () => {
    if (this.state.selectedImage === 0) {
      message.info("已经是第一个了")
    }
    else {
      this.setState({selectedImage: this.state.selectedImage-1})
    }
  }

  handleVOCSubmit = (MainLayoutState) => {
    var annotations = []
    MainLayoutState.images.forEach((image) => {
      var annotation = {}
      annotation["folder"] = "ImageSets"
      annotation["file_name"] = image.name
      annotation["size"] = {
        "height": image.pixelSize.h,
        "width": image.pixelSize.w,
        "depth": 3,
      }
      annotation["segmented"] = 0
      var objects = []
      image.regions.forEach((region) => {
        var object = {}
        object["name"] = region.cls
        object["bndbox"] = {
          "xmin": region.x,
          "xmax": region.x+region.w,
          "ymin": region.y,
          "ymax": region.y+region.h,
        }
        object["truncated"] = 0
        object["difficult"] = 0
        if (region.tags) {
          for (var tag of region.tags) {
            if (tag === "truncated") object["truncated"] = 1
            if (tag === "difficult") object["difficult"] = 1
          }
        }
        // console.log(object)
        objects.push(object)
      })
      annotation["object"] = objects
      var foo = {}
      foo["annotation"] = annotation
      annotations.push(foo)
    })
    // console.log(annotations)

    let url = "http://127.0.0.1:8000/VOC/annotate/"

    const data = {
      "images": this.state.picList,
      "annotations": annotations,
    }

    // console.log(data)

    axios.post(url, data, {headers: {"Content-Type": "application/json"}}).then(
      res => {
        if (res.status === 200 && res.data.code === 1) {
          message.success(res.data.msg)
          this.setState({exited: true})
          console.log("提交成功")
        }
        else {
          message.error(res.data.msg)
          console.log(res)
        }
      }
    ).catch((err) =>{
        console.log(err)
    })

  }

  handleCOCOSubmit = (MainLayoutState) => {
    let date = new Date();
    let dataset = {};
    dataset['info'] = {
      'description': this.state.name, 
      'url': '', 
      'version': '1.0',
      'year': date.getFullYear().toString(),
      'contributor': '',
      'date_created': date.toLocaleString(),
    };
    dataset['license'] = [
      {
        "url": "http://creativecommons.org/licenses/by-nc-sa/2.0/", 
        "id": 1, 
        "name": "Attribution-NonCommercial-ShareAlike License"
      },
    ];
    dataset['images'] = MainLayoutState.images.map(item => {
      return {
        'license': 1,
        'file_name': item.name,
        'coco_url': item.src,
        'height': item.pixelSize.h,
        'width': item.pixelSize.w,
        'date_captured': null,
        'flickr_url': '',
        'id': item.id
      }
    });
    dataset['categories'] = categories;

    let annotations = [];
    for (let i = 0; i < MainLayoutState.images.length; i++){
      for (let j = 0; j < MainLayoutState.images[i].regions.length; j++){
        if (MainLayoutState.images[i].regions[j].type === 'polygon'){
          let segmentations = [];
          for (let k = 0; k < MainLayoutState.images[i].regions[j].points.length; k++){
            segmentations.push(MainLayoutState.images[i].regions[j].points[k][0]);
            segmentations.push(MainLayoutState.images[i].regions[j].points[k][1]);
          }
          annotations.push({
            'segmentation': [segmentations],
            'area': null,
            'iscrowd': 0,
            'image_id': MainLayoutState.images[i].id,
            'bbox': null,
            'category_id': categories.find(item => {
              return item.name === MainLayoutState.images[i].regions[j].cls;
            }).id,
            'id': parseInt(MainLayoutState.images[i].regions[j].id)
          })
        }
        else if (MainLayoutState.images[i].regions[j].type === 'box'){
          let bbox = [
            MainLayoutState.images[i].regions[j].x,
            MainLayoutState.images[i].regions[j].y,
            MainLayoutState.images[i].regions[j].w,
            MainLayoutState.images[i].regions[j].h,
          ];
          annotations.push({
            'segmentation': null,
            'area': null,
            'iscrowd': 0,
            'image_id': MainLayoutState.images[i].id,
            'bbox': bbox,
            'category_id': categories.find(item => {
              return item.name === MainLayoutState.images[i].regions[j].cls;
            })['id'],
            'id': parseInt(MainLayoutState.images[i].regions[j].id)
          })
        }
      }
    }
    dataset['annotations'] = annotations
    // console.log(dataset)

    const data = {
      "dataset": this.props.selectedTask.dataset,
      "annotation": JSON.stringify(dataset),
    }

    axios.post('http://127.0.0.1:8000/COCO/annotate/', data, {headers: {"Content-Type": "application/json"}}).then(res => {
      if (res.status === 200 && res.data.code === 1) {
        message.success(res.data.msg)
        this.setState({exited: true})
      }
      else {
        message.error(res.data.msg)
        console.log(res)
      }
    }).catch(err => {
      console.log(err)
    })
  }

  handleExit = (MainLayoutState) => {
    if (!this.state.viewedAll) {
      message.error("还未浏览过全部图片")
    }
    else if (this.state.exited) {
      message.info("已经完成提交")
    }
    else {
      // console.log(MainLayoutState)
      if (this.props.selectedTask.type === 'V') {
        this.handleVOCSubmit(MainLayoutState)
      }
      else if (this.props.selectedTask.type === 'C') {
        this.handleCOCOSubmit(MainLayoutState)
      }
      else {
        message.error("暂不支持当前数据集格式")
      }
    }
  }

  render() {
    if (this.state.loading) {
      return <div>请先选择要标注的任务</div>
    }
    else {
      return (
        <ReactImageAnnotate
          labelImages
          enabledTools={['select', 'create-box', 'create-polygon']}
          images={this.state.images}
          selectedImage={this.state.selectedImage}
          onNextImage={this.handleNext}
          onPrevImage={this.handlePrev}
          regionClsList={categories.map(item => {return item.name})}
          regionTagList={["difficult", "truncated"]}
          hideSettings={true}
          onExit={this.handleExit}
        />
      )
    }
  }
}

export default Annotation;