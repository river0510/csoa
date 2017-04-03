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
import ModifyPass from './ModifyPass'
import CreateUser from './CreateUser'
import config from '../../config'
import './Account.scss'
const confirm = Modal.confirm
const FormItem = Form.Item

export default class AccountComponent extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			data: []
				// key: '1',
				// userName: 'admin',
				// password: 'admin',
				// role: '超级管理员'
		}
	}
	delete(key, e) {
		e.preventDefault();
		e.stopPropagation();
		let reGetUsers = this.getUsers;
		console.log(reGetUsers);
		confirm({
			title: '确定要删除吗?',
			content: '删除的账号将无法登陆',
			onOk() {
				let bodyquery = 'id=' + key;
				console.log(bodyquery);
				fetch(config.api + '/deleteUser', {
					method: 'post',
					mode: 'cors',
					body: bodyquery,
					headers: {
						"Content-Type": "application/x-www-form-urlencoded"
					}
				}).then((res) => {
					return res.json();
				}).then((data) => {
					if (data.status == 200) {
						message.success(data.message);
						reGetUsers();
					} else {
						message.error(data.message);
					}
				}).catch(err => console.log(err))
			},
			onCancel() {}
		});
	}
	test = () => {
		alert('success');
	}
	getUsers = () => {
		fetch(config.api + '/getUsers', {
			method: 'get',
			mode: 'cors',
			headers: {
				"Content-Type": "application/x-www-form-urlencoded"
			}
		}).then((res) => {
			return res.json();
		}).then((data) => {
			if (data.status == 200) {
				this.setState({
					data: data.users
				});
			} else {
				message.error(data.message);
			}
		}).catch(err => console.log(err))
	}
	componentDidMount() {
		this.getUsers();
	}
	render() {
		const columns = [{
			title: '用户名',
			dataIndex: 'userName',
			key: 'userName',
		}, {
			title: '密码',
			dataIndex: 'password',
			key: 'password',
		}, {
			title: '权限',
			dataIndex: 'role',
			key: 'role',
		}, {
			title: '操作',
			key: 'action',
			render: (text, record) => {
				if (this.state.data.length == 1) {
					return (
						<span>
							<Button type="danger" onClick={this.delete.bind(this,record.key)} disabled>
								删除
							</Button>
						</span>
					)
				} else {
					return (
						<span>
							<Button type="danger" onClick={this.delete.bind(this,record.key)}>
								删除
							</Button>
						</span>
					)
				}
			},
		}];
		// const data = [{
		// 	key: '1',
		// 	userName: 'admin',
		// 	password: 'admin',
		// 	role: '超级管理员'
		// }]
		let data = this.state.data;
		return (
			<div>
				<div className='account-top'>
					<span>当前账户:{sessionStorage.userName}</span>
					<ModifyPass />				
				</div>
				<CreateUser getUsers = {this.getUsers}/>
				<Table className="table" columns={columns} dataSource={data} />
			</div>

		)
	}
}