import React from 'react';
import { Form, Input, Button } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import './Register.css';
import axios from 'axios'

class Register extends React.Component {
  onFinish = (values) => {
    console.log('Success:', values);

    if (values.username.length < 6) {
      alert('用户名长度应在6位以上')
      return
    }

    if (values.password.length < 6) {
      alert('用户名长度应在6位以上')
      return
    }

    var reg =/^\w+@[a-z0-9]\.[a-z]+$/i
    if (!reg.test(values.email)) {
      alert('邮箱格式错误')
      return
    }
    
    let url = 'http://127.0.0.1:8000/user/register/'

    axios.post(url, values, {headers: {'Content-Type': 'application/json'}}).then(res => {
      alert(res.data.msg)
      if (res.status === 200 && res.data.code === 1) {
        console.log('注册成功')
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
    return (
      <div className='register-div'>
        <div className='register-title'>注册 Labelpix 账号</div>
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
            name="email"
            rules={[
              {
                required: true,
                message: '请输入邮箱!',
              },
            ]}
          >
            <Input
              prefix={<MailOutlined />}
              placeholder="Email"
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
              注册
            </Button>
            <a href="/login" style={{marginLeft: '15%'}}>去登录</a>
          </Form.Item>
        </Form>
      </div>
    )
  }
}

export default Register;