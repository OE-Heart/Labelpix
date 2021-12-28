import React from 'react';
import axios from 'axios';

import { Upload, Button, message } from 'antd';
import { CloudUploadOutlined } from '@ant-design/icons';

import './PicUpload.css'
import DirectoryUpload from './DirectoryUpload';
import VideoUpload from './VideoUpload';

class PicUpload extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      fileList: [],          //文件列表，用于控制upload组件
    }
  }

  handleFileChange = ({file, fileList}) => { //处理文件change，保证用户选择的文件只有一个
    this.setState({
      'fileList': fileList.length? [fileList[fileList.length - 1]] : []
    })
  }
  
  handlePicUpload = () => {
    if(!this.state.fileList.length) {
        message.warning("请选择要上传的文件")
    }
  
    const data = new FormData()
    data.append('pic', this.state.fileList[0].originFileObj)
  
    this.setState({
        uploading: true
    })

    data.append('owner', this.props.User_ID)

    console.log(data)

    let url = 'http://127.0.0.1:8000/picture/upload/'

    axios.post(url, data, {headers: {'Content-Type': 'multipart/form-data'}}).then(
      res => {
        message.info(res.data.msg)
        if (res.status === 200 && res.data.code === 1) {
          console.log('上传成功')
        }
        else {
          console.log(res)
        }
      }
    ).catch((err) =>{
        console.log(err)
    }).finally(() =>{
        this.setState({
            uploading: false
        })
    })
  }

  render() {
    return (
      <div className='PicUpload-div'>
      <Upload fileList={this.state.fileList} beforeUpload={(f, fList) => false} onChange={this.handleFileChange}>
        <Button>
          <CloudUploadOutlined /> 选择文件
        </Button>
      </Upload>
      <Button onClick={this.handlePicUpload}>上传</Button>
      <DirectoryUpload User_ID={this.props.User_ID}/>
      <VideoUpload User_ID={this.props.User_ID}/>
      </div>
    )
  }
}

export default PicUpload;