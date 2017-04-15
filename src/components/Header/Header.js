import React from 'react'
import {
  Link
} from 'react-router'
import {
  Menu,
  Icon,
  message
} from 'antd'

import './Header.scss'
import config from '../../config'

class Header extends React.Component {
  state = {
    current: 'mail',
  }
  back = (e) => {
    e.preventDefault();
    window.history.back();
    location.reload();
  }
  logout = () => {
    fetch(config.api + '/User/logout', {
      method: 'get',
      mode: 'cors',
      credentials: "include",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
    }).then((res) => {
      return res.json();
    }).then((data) => {
      if (data.status == 200) {
        message.success(data.message);
        sessionStorage.clear();
        this.context.router.push('/login');
      } else {
        message.error(data.message);
      }
    }).catch(err => console.log(err))
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
          <a onClick={this.logout}>退出</a>
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
Header.contextTypes = {
  router: React.PropTypes.object.isRequired
};
export default Header;