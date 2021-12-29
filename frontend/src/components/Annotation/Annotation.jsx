import { message } from "antd";
import React from "react";
import ReactImageAnnotate from "react-image-annotate";
import "./Annotation.css";
import axios from "axios";

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
            if (tag == "truncated") object["truncated"] = 1
            if (tag == "difficult") object["difficult"] = 1
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
        message.info(res.data.msg)
        if (res.status === 200 && res.data.code === 1) {
          this.setState({exited: true})
          console.log("提交成功")
        }
        else {
          console.log(res)
        }
      }
    ).catch((err) =>{
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
      this.handleVOCSubmit(MainLayoutState)
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
          enabledTools={["select", "create-box"]}
          images={this.state.images}
          selectedImage={this.state.selectedImage}
          onNextImage={this.handleNext}
          onPrevImage={this.handlePrev}
          // taskDescription={this.props.selectedTask.description}
          regionClsList={["person", "Bird", "Cat", "Cow", "Dog", "Horse", "Sheep", "Aeroplane", "Bicycle", "Boat", "Bus", "Car", "Motorbike", "Train", "Bottle", "Chair", "Dining table", "Potted plant", "Sofa", "Monitor"]}
          regionTagList={["difficult", "truncated"]}
          hideSettings={true}
          onExit={this.handleExit}
        />
      )
    }
  }
}

export default Annotation;