import React from 'react';
import { Upload, Button, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';

class DirectoryUpload extends React.Component {
	constructor(props) {
    super(props)
    this.state = {
      fileList: [],          //文件列表，用于控制upload组件
    }
  }

	handleFileChange = ({file, fileList}) => { 
    this.setState({fileList})
  }

	handleDirectoryUpload = () => {
		if(!this.state.fileList.length) {
      message.warning("请选择要上传的文件夹")
    }

		// console.log(this.state.fileList.length)

		let url = 'http://127.0.0.1:8000/picture/upload/'

		for (var file of this.state.fileList) {

			var data = new FormData()
			data.append('pic', file.originFileObj)
			data.append('owner', this.props.User_ID)

			// console.log(data)

			axios.post(url, data, {headers: {'Content-Type': 'multipart/form-data'}}).then(
				res => {
					// alert (res.data.msg)
					if (res.status === 200 && res.data.code === 1) {
						console.log('上传成功')
					}
					else {
						message.success(res.data.msg)
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

			this.setState({fileList: []})
  
		}
	}

  render () {
		return (
			<div>
				<Upload fileList={this.state.fileList} beforeUpload={(f, fList) => false} onChange={this.handleFileChange} directory>
    			<Button icon={<UploadOutlined />}>选择文件夹</Button>
  			</Upload>
				<Button onClick={this.handleDirectoryUpload}>上传</Button>
			</div>
			)
	}
}

export default DirectoryUpload;