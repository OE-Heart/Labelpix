import React from "react";
import { Form, Select, Input, Button } from 'antd';
import axios from "axios";

const { Option } = Select;

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
};

class TaskCreate extends React.Component {
  constructor(props) {
    super(props);
  }
  state = {
    datasetList: [],
  }

  async componentDidMount() {
    let url = 'http://127.0.0.1:8000/dataset/'
    var res = axios.get(url, {headers: {'Content-Type': 'application/json'}})
    // console.log((await res).data.results)
    this.setState({datasetList: (await res).data.results})
    console.log(this.state.datasetList)
  }

  onFinish = (values) => {
    values['creat_user'] = this.props.User_ID;
    console.log('Received values of form: ', values);

    let url = 'http://127.0.0.1:8000/task/create/'

    axios.post(url, values, {headers: {'Content-Type': 'application/json'}}).then(
      res => {
        alert (res.data.msg)
        if (res.status === 200 && res.data.code === 1) {
          console.log('创建成功')
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
  };

  render() {
    return (
      <Form
        name="validate_other"
        {...formItemLayout}
        onFinish={this.onFinish}
      >
        <Form.Item
          name="name"
          label="任务名称"
          hasFeedback
          rules={[
            {
              required: true,
              message: '请输入任务名称！',
            },
          ]}
        >
          <Input placeholder="请输入任务名称"/>
        </Form.Item>
  
        <Form.Item
          name="description"
          label="任务介绍"
          hasFeedback
          rules={[
            {
              required: true,
              message: '请输入任务介绍！',
            },
          ]}
        >
          <Input.TextArea placeholder="请输入任务介绍"/>
        </Form.Item>
  
        <Form.Item
          name="type"
          label="数据集格式"
          hasFeedback
          rules={[
            {
              required: true,
              message: '请选择数据集格式！',
            },
          ]}
        >
          <Select placeholder="请选择数据集格式">
            <Option value="V">VOC</Option>
            <Option value="C">COCO</Option>
          </Select>
        </Form.Item>
  
        <Form.Item
          name="dataset"
          label="数据集"
          hasFeedback
          rules={[
            {
              required: true,
              message: '请选择数据集！',
            },
          ]}
        >
          <Select placeholder="请选择数据集">
            {this.state.datasetList.map( (item) => (
              <Option value={item.id}>{item.name}</Option>
            ))}
          </Select>
        </Form.Item>
  
        <Form.Item
          wrapperCol={{
            span: 12,
            offset: 6,
          }}
        >
          <Button type="primary" htmlType="submit">
            创建
          </Button>
        </Form.Item>
      </Form>
    );
  }
}

export default TaskCreate;