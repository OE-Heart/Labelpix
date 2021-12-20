import React from 'react';
import './Menu.css';

import { Layout, Menu, Breadcrumb } from 'antd';
import {
  DesktopOutlined,
  PieChartOutlined,
  FileOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';

import { Navigate, NavLink, Route, Routes } from "react-router-dom";
import PicUpload from '../Picture/PicUpload/PicUpload';
import withRouter from './withRouter';

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

class SiderMenu extends React.Component {
  constructor(props) {
    super(props);
  }
  state = {
    collapsed: false,
  };

  onCollapse = collapsed => {
    console.log(collapsed);
    this.setState({ collapsed });
  };

  render() {
    const { collapsed } = this.state;
    return (
      this.props.isLoggedIn ?
      <Layout style={{ minHeight: '100vh' }}>
        <Sider collapsible collapsed={collapsed} onCollapse={this.onCollapse}>
          <div className="logo" />
          <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
            <SubMenu key="sub1" icon={<UserOutlined />} title="任务管理">
              <Menu.Item key="1">创建任务</Menu.Item>
              <Menu.Item key="2">任务列表</Menu.Item>
            </SubMenu>
            <SubMenu key="sub2" icon={<UserOutlined />} title="图像管理">
                <Menu.Item key="4">图像列表</Menu.Item>
                <Menu.Item key="/picture/upload">
                  <NavLink exact to='/picture/upload'>
                    <span>图像上传</span>
                  </NavLink>
                </Menu.Item>
            </SubMenu>
            <SubMenu key="sub3" icon={<UserOutlined />} title="数据集管理">
              <Menu.Item key="6">数据集列表</Menu.Item>
            </SubMenu>
            <Menu.Item key="7" icon={<PieChartOutlined />}>
              数据标注
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout className="site-layout">
          <Header className="site-layout-background" style={{ padding: 0 }}>
            <div className="title">
              Labelpix
            </div>
          </Header>
          <Content style={{ margin: '0 16px' }}>
            <PicUpload User_ID={this.props.User_ID}/>
          </Content>
          <Footer style={{ textAlign: 'center' }}>Labelpix ©2021 Created by OE.Heart</Footer>
        </Layout>
      </Layout>
      :
      <Navigate to= '/login'/>
    );
  }
}

export default withRouter(SiderMenu);