import React from 'react'
import {
	Link
} from 'react-router'
import {
	Menu,
	Icon
} from 'antd'
const SubMenu = Menu.SubMenu;
import './Sider.scss'

export default class Sider extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			current: '1',
			openKeys: []
		}
	}
	handleClick = (e) => {
		console.log('Clicked: ', e);
		this.setState({
			current: e.key
		});
	}
	onOpenChange = (openKeys) => {
		const state = this.state;
		const latestOpenKey = openKeys.find(key => !(state.openKeys.indexOf(key) > -1));
		const latestCloseKey = state.openKeys.find(key => !(openKeys.indexOf(key) > -1));

		let nextOpenKeys = [];
		if (latestOpenKey) {
			nextOpenKeys = this.getAncestorKeys(latestOpenKey).concat(latestOpenKey);
		}
		if (latestCloseKey) {
			nextOpenKeys = this.getAncestorKeys(latestCloseKey);
		}
		this.setState({
			openKeys: nextOpenKeys
		});
	}
	getAncestorKeys = (key) => {
		const map = {

		};
		return map[key] || [];
	}
	render() {
		let byxt = this.props.role.project_manage == 1 || this.props.role.document_download == 1 || this.props.role.teacher_project == 1 || this.props.role.teacher_confirm == 1 || this.props.role.project_chose == 1;
		let sxbm = this.props.role.job_manage == 1 || this.props.role.post_manage == 1 || this.props.role.job_chose == 1 || this.props.role.submit_document == 1;
		// debugger;
		return (
			<Menu
	        mode="inline"
	        openKeys={this.state.openKeys}
	        selectedKeys={[this.state.current]}
	        style={{ width: 240 }}
	        onOpenChange={this.onOpenChange}
	        onClick={this.handleClick} 
	        className="sider"
	      >
	        <SubMenu key="sub1" title={<span>系统管理</span>} className={this.props.role.system_manage == 1 ? '':'hide'}>
	          <Menu.Item key="1"><Link to='/teacherManage' >教师管理</Link></Menu.Item>
	          <Menu.Item key="2"><Link to='/studentManage' >学生管理</Link></Menu.Item>
	          <Menu.Item key="3"><Link to='/addArticle' >角色管理</Link></Menu.Item>
	          <Menu.Item key="4"><Link to='/addArticle' >菜单管理</Link></Menu.Item>
	          <Menu.Item key="5"><Link to='/addArticle' >日志管理</Link></Menu.Item>
	        </SubMenu>
	        <SubMenu key="sub2" title={<span>毕业选题</span>} className={byxt ? '' : 'hide'}>
	          <Menu.Item key="6" className={this.props.role.project_manage == 1 ? '':'hide'}><Link to='/addArticle'>毕设管理</Link></Menu.Item>
	          <Menu.Item key="8" className={this.props.role.document_download == 1 ? '':'hide'}><Link to='/addArticle'>文档下载</Link></Menu.Item>
	          <Menu.Item key="9" className={this.props.role.teacher_project == 1 ? '':'hide'}><Link to='/addArticle'>老师报题</Link></Menu.Item>
	          <Menu.Item key="10" className={this.props.role.teacher_confirm == 1 ? '':'hide'}><Link to='/addArticle'>老师确认</Link></Menu.Item>
	          <Menu.Item key="11" className={this.props.role.project_chose == 1 ? '':'hide'}><Link to='/addArticle'>学生选题</Link></Menu.Item>
	        </SubMenu>
			<SubMenu key="sub4" title={<span>实习报名</span>} className={sxbm ? '' : 'hide'}>
			  <Menu.Item key="12" className={this.props.role.job_manage == 1 ? '':'hide'}><Link to='/practiceManage'>实习管理</Link></Menu.Item>
	          <Menu.Item key="13" className={this.props.role.post_manage == 1 ? '':'hide'}><Link to='/addArticle'>岗位管理</Link></Menu.Item>
			  <Menu.Item key="14" className={this.props.role.job_chose == 1 ? '':'hide'}><Link to='/addArticle'>选择岗位</Link></Menu.Item>
	          <Menu.Item key="15" className={this.props.role.submit_document == 1 ? '':'hide'}><Link to='/addArticle'>提交文档</Link></Menu.Item>	          		 
	        </SubMenu>                              
	      </Menu>
		);
	}
}