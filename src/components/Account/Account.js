import React from 'react'
import {
	Table,
	Icon,
	Modal,
	Button,
	Form,
	Input,
	message
} from 'antd'
import {
	Link
} from 'react-router'
import ModifyPass from './ModifyPass'
import config from '../../config'
import './Account.scss'
const confirm = Modal.confirm
const FormItem = Form.Item

export default class AccountComponent extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			data: {}
		}
	}
	getData = () => {
		let bodyquery = 'userName=' + sessionStorage.userName + '&role_id=' + sessionStorage.role_id;
		fetch(config.api + '/User/getUserInfo', {
			method: 'post',
			mode: 'cors',
			body: bodyquery,
			credentials: "include",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded"
			},
		}).then((res) => {
			return res.json();
		}).then((data) => {
			if (data.status == 200) {
				this.setState({
					data: data
				})
			}
		}).catch(err => console.log(err))
	}
	componentWillMount() {
		this.getData();
	}
	render() {
		let name = this.state.data.name ? '姓名：' + this.state.data.name : '';
		name = (<span>{name}</span>);
		let userInfo;
		let role_id = sessionStorage.role_id;
		if (role_id == 2 || role_id == 3) {
			userInfo = (
				<div className='user-info'>
					<p><span className='tip'>姓名：</span><span>{this.state.data.name}</span></p>
					<p><span className='tip'>校园卡号：</span><span>{this.state.data.card_number}</span></p>
					<p><span className='tip'>办公室：</span><span>{this.state.data.office}</span></p>
					<p><span className='tip'>办公电话：</span><span>{this.state.data.telephone}</span></p>
					<p><span className='tip'>部门：</span><span>{this.state.data.department}</span></p>
					<p><span className='tip'>手机：</span><span>{this.state.data.phone}</span></p>
					<p><span className='tip'>短号：</span><span>{this.state.data.short_phone}</span></p>
					<p><span className='tip'>邮箱：</span><span>{this.state.data.email}</span></p>
					<p><span className='tip'>QQ：</span><span>{this.state.data.qq}</span></p>
					<p><span className='tip'>微信：</span><span>{this.state.data.wechat}</span></p>
					<Button type='primary' className='modify-button'><Link to={'/userModify/'+role_id+'/'+this.state.data.card_number}>修改个人信息</Link></Button>
				</div>
			);
		} else if (role_id == 4) {
			userInfo = (
				<div className='user-info'>
					<p><span className='tip'>姓名：</span><span>{this.state.data.name}</span></p>
					<p><span className='tip'>学号：</span><span>{this.state.data.card_number}</span></p>
					<p><span className='tip'>班级：</span><span>{this.state.data.class}</span></p>
					<p><span className='tip'>专业：</span><span>{this.state.data.major}</span></p>
					<p><span className='tip'>宿舍：</span><span>{this.state.data.dorm}</span></p>
					<p><span className='tip'>身份证：</span><span>{this.state.data.identity_card}</span></p>
					<p><span className='tip'>手机：</span><span>{this.state.data.phone}</span></p>
					<p><span className='tip'>短号：</span><span>{this.state.data.short_phone}</span></p>					
					<p><span className='tip'>邮箱：</span><span>{this.state.data.email}</span></p>
					<p><span className='tip'>QQ：</span><span>{this.state.data.qq}</span></p>
					<p><span className='tip'>微信：</span><span>{this.state.data.wechat}</span></p>
					<Button type='primary' className='modify-button'><Link to={'/userModify/'+role_id + '/' + this.state.data.card_number}>修改个人信息</Link></Button>
				</div>
			);
		}
		return (
			<div>
				<div className='account-top'>
					<span>当前账户：{sessionStorage.userName}</span>
					{name}
					<span>上次登陆：{this.state.data.time}</span>
					<span>IP：{this.state.data.ip}</span>
					<ModifyPass />				
				</div>
				{userInfo}
			</div>
		)
	}
}