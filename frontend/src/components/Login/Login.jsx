import React from 'react';
import { Form, Input, Button } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { Navigate } from "react-router-dom";
import './Login.css';
import axios from 'axios'

class Login extends React.Component {
  constructor(props) {
    super(props);
  }

  onFinish = (values) => {
    console.log('Success:', values);
    
    let url = 'http://127.0.0.1:8000/user/login/'

    axios.post(url, values, {headers: {'Content-Type': 'application/json'}}).then(res => {
      alert (res.data.msg)
      if (res.status === 200 && res.data.code === 1) {
        // console.log(res)
        console.log(res.data.data.id)
        this.props.LoggedIn(res.data.data.id)
      }
      else {
        console.log(res)
      }
    })
  };

  onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  render() {
    return this.props.isLoggedIn ? 
    <Navigate to = '/'/>
    :
    <div className='login-div'>
      <div className='login-title'>登录 Labelpix</div>
      <Form
        name="basic"
        onFinish={this.onFinish}
        onFinishFailed={this.onFinishFailed}
        autoComplete="off"
      >
        <Form.Item
          name="username"
          rules={[
            {
              required: true,
              message: '请输入用户名!',
            },
          ]}
        >
          <Input 
            prefix={<UserOutlined />}
            placeholder="Username"
          />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[
            {
              required: true,
              message: '请输入密码!',
            },
          ]}
        >
          <Input.Password 
            prefix={<LockOutlined />}
            placeholder="Password"
          />
        </Form.Item>

        <Form.Item
          wrapperCol={{
            offset: 8,
            span: 16,
          }}
        >
          <Button type="primary" htmlType="submit">
            登录
          </Button>
          <a href="/register" style={{marginLeft: '15%'}}>去注册</a>
        </Form.Item>
      </Form>
    </div>
  }
}

export default Login;