import { message } from "antd";
import React from "react";
import ReactImageAnnotate from "react-image-annotate";
import './Annotation.css';

class Annotation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      images: [
        {
          src: "https://placekitten.com/408/287",
          name: "Image 1",
          regions: []
        },
        {
          src: "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
          name: "Image 1",
          regions: []
        }
      ],
      selectedImage: 0,
    }
  }

  handleNext = () => {
    if (this.state.selectedImage === this.state.images.length-1) {
      message.info('已经是最后一个了');
    }
    else {
      this.setState({selectedImage: this.state.selectedImage+1})
    }
  }

  handlePrev = () => {
    if (this.state.selectedImage === 0) {
      message.info('已经是第一个了');
    }
    else {
      this.setState({selectedImage: this.state.selectedImage-1})
    }
  }

  render() {
    return (
      <ReactImageAnnotate
        labelImages
        images={this.state.images}
        selectedImage={this.state.selectedImage}
        onNextImage={this.handleNext}
        onPrevImage={this.handlePrev}
        hideClone
        regionClsList={["Alpha", "Beta", "Charlie", "Delta"]}
        regionTagList={["tag1", "tag2", "tag3"]}
      />
    )
  }
}

export default Annotation;