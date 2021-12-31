import React from 'react';
import './Menu.css';

import { Layout, Menu, Breadcrumb, message } from 'antd';
import {
  PieChartOutlined,
  TeamOutlined,
  FileImageOutlined,
  DatabaseOutlined,
  UserOutlined,
} from '@ant-design/icons';

import { Navigate, NavLink, Route, Routes } from "react-router-dom";
import Annotation from '../Annotation/Annotation';
import DatasetList from '../Dataset/DatasetList/DatasetList.tsx';
import PicList from '../Picture/PicList/PicList.tsx';
import PicUpload from '../Picture/PicUpload/PicUpload';
import TaskCreate from '../Task/TaskCreate/TaskCreate';
import TaskList from '../Task/TaskList/TaskList.tsx';
import DatasetCreate from '../Dataset/DatasetCreate/DatasetCreate';

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

class SiderMenu extends React.Component {
  constructor(props) {
    super(props);
  }
  state = {
    collapsed: false,
    selected: 0,
    selectedTask: [],
  };

  onCollapse = collapsed => {
    this.setState({ collapsed });
  };

  setSelected = selected => {
    this.setState({ selected });
  }
q
  setSelectedTask = selectedTask => {
    this.setState({ selectedTask });
  }

  render() {
    const { collapsed } = this.state;
    var content;
    switch(this.state.selected) {
      case 1:
        content = <TaskCreate User_ID={this.props.User_ID}/>;
        break;
      case 2:
        content = <TaskList User_ID={this.props.User_ID} setSelected={this.setSelected} setSelectedTask={this.setSelectedTask}/>;
        break;
      case 3:
        content = <PicList User_ID={this.props.User_ID} setSelected={this.setSelected}/>;
        break;
      case 4:
        content = <PicUpload User_ID={this.props.User_ID}/>
        break;
      case 5:
        content = <DatasetCreate User_ID={this.props.User_ID}/>;
        break;
      case 6:
        content = <DatasetList User_ID={this.props.User_ID} setSelected={this.setSelected}/>;
        break;
      case 7:
        content = <Annotation User_ID={this.props.User_ID} selectedTask={this.state.selectedTask}/>;
        break;
      default:
        content = <h1>Welcome to Labelpix!</h1>
        break;
    }
    return (
      this.props.isLoggedIn ?
      <Layout style={{ minHeight: '100vh' }}>
        <Sider collapsible collapsed={collapsed} onCollapse={this.onCollapse}>
          <div className="logo" />
          <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
            <SubMenu key="sub1" icon={<TeamOutlined />} title="任务管理">
              <Menu.Item key="1" onClick={()=>this.setState({selected: 1})}>创建任务</Menu.Item>
              <Menu.Item key="2" onClick={()=>this.setState({selected: 2})}>任务列表</Menu.Item>
            </SubMenu>
            <SubMenu key="sub2" icon={<FileImageOutlined />} title="图像管理">
                <Menu.Item key="3" onClick={()=>this.setState({selected: 3})}>图像列表</Menu.Item>
                <Menu.Item key="4" onClick={()=>this.setState({selected: 4})}>图像上传</Menu.Item>
            </SubMenu>
            <SubMenu key="sub3" icon={<DatabaseOutlined />} title="数据集管理">
              <Menu.Item key="5" onClick={()=>this.setState({selected: 5})}>创建数据集</Menu.Item>
              <Menu.Item key="6" onClick={()=>this.setState({selected: 6})}>数据集列表</Menu.Item>
            </SubMenu>
            <Menu.Item key="7" icon={<PieChartOutlined /> } onClick={()=>this.setState({selected: 7})}>
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
            {content}
          </Content>
          <Footer style={{ textAlign: 'center' }}>Labelpix ©2021 Created by OE.Heart</Footer>
        </Layout>
      </Layout>
      :
      <Navigate to= '/login'/>
    );
  }
}

export default SiderMenu;