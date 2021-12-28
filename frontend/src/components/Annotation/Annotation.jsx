import { message } from "antd";
import React from "react";
import ReactImageAnnotate from "react-image-annotate";
import './Annotation.css';
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
      selectedImage: 0,
    };
  }

  getData = async () =>{
    let url = "http://localhost:8000/dataset/"+this.props.selectedTask.dataset+"/"
    var res = await axios.get(url, {headers: {'Content-Type': 'application/json'}})
    var picList = res.data.pics

    const images = []
    for (var pic_id of picList) {
      url = "http://localhost:8000/picture/"+pic_id+"/"
      var result = await axios.get(url, {headers: {'Content-Type': 'application/json'}})
      // console.log(result.data)
      var item = {
        src: result.data.pic,
        name: result.data.filename,
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
      message.info('已经是最后一个了')
    }
    else {
      this.setState({selectedImage: this.state.selectedImage+1})
    }
  }

  handlePrev = () => {
    if (this.state.selectedImage === 0) {
      message.info('已经是第一个了')
    }
    else {
      this.setState({selectedImage: this.state.selectedImage-1})
    }
  }

  onExit = () => {
    message.info("exit")
  }

  render() {
    if (this.state.loading) {
      return <div></div>
    }
    else {
      return (
        <ReactImageAnnotate
          labelImages
          enabledTools={['select', 'create-point', 'create-box', 'create-polygon']}
          images={this.state.images}
          selectedImage={this.state.selectedImage}
          onNextImage={this.handleNext}
          onPrevImage={this.handlePrev}
          // taskDescription={this.props.selectedTask.description}
          regionClsList={["Alpha", "Beta", "Charlie", "Delta"]}
          regionTagList={["tag1", "tag2", "tag3"]}
          onExit={this.onExit}
        />
      )
    }
  }
}

export default Annotation;