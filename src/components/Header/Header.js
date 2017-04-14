import React from 'react'
import {
  Link
} from 'react-router'
import {
  Menu,
  Icon
} from 'antd'


import './Header.scss'

export default class Header extends React.Component {
  state = {
    current: 'mail',
  }
  back = (e) => {
    e.preventDefault();
    window.history.back();
    location.reload();
  }
  render() {
    return (
      <Menu
        onClick={this.handleClick}
        selectedKeys={[this.state.current]}
        mode="horizontal"
        className="header-menu"
      >
        <Menu.Item key="mail">
          <Icon type="mail" />计软学院学生事务管理平台
        </Menu.Item>
        <Menu.Item className='link' key="1">
          <Link  to='/login' >退出</Link>
        </Menu.Item>
        <Menu.Item className='link' key="2">
          <a href="#" onClick={this.back}>返回</a>
        </Menu.Item>               
        <Menu.Item className='link' key="3">
          <Link to='/account' ><Icon type="setting" />账号管理</Link>
        </Menu.Item>                     
      </Menu>
    );
  }
}