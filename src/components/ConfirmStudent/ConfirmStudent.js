import React from 'react'
import ReactDOM from 'react-dom'
import {
	Table,
	Button,
	Modal,
	message,
	Icon,
	Input,
} from 'antd';
import {
	Link
} from 'react-router'
import config from '../../config'
import './ConfirmStudent.scss'

const confirm = Modal.confirm;


class ConfirmStudent extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			studentData: [], //学生数据
			projectData: []
		};
	}

	//单个删除确定对话框
	showDeleteConfirm(id, e) {
		e.preventDefault();
		let project_id = this.props.project_id,
			getStudent = this.getStudent;

		function deleteByConfirm(id) {
			fetch(config.api + '/Graduate/deleteByConfirm?id=' + id, {
				method: 'get',
				mode: 'cors',
				credentials: "include",
				headers: {
					"Content-Type": "application/x-www-form-urlencoded"
				}
			}).then((res) => {
				return res.json();
			}).then((data) => {
				if (data.status == 200) {
					message.success(data.message);
					getStudent(project_id);
				} else {
					message.error(data.message);
				}
			}).catch(err => console.log(err))
		}

		confirm({
			title: '确定要删除该学生吗？',
			content: '确定要删除该学生吗',
			onOk() {
				deleteByConfirm(id);
			},
			onCancel() {
				console.log('Cancel');
			},
		});
	}

	confirmToggle(id,e){
		e.preventDefault();
		fetch(config.api + '/Graduate/confirmStudent?id=' + id, {
			method: 'get',
			mode: 'cors',
			credentials: "include",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded"
			},
		}).then((res) => {
			return res.json();
		}).then((data) => {
			if(data.status == 200)
				message.success(data.message)
			else
				message.error(data.message)
			this.getStudent(this.props.project_id)
		}).catch(err => console.log(err))		
	}

	//获取该课题下 所有报名学生
	getStudent = (project_id) => {
		fetch(config.api + '/Graduate/getStudentByProject?project_id=' + project_id, {
			method: 'get',
			mode: 'cors',
			credentials: "include",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded"
			},
		}).then((res) => {
			return res.json();
		}).then((data) => {
			data.student.forEach((value, index) => {
				value.key = index
			})
			this.setState({
				studentData: data.student,
				projectData: data.project
			})
		}).catch(err => console.log(err))
	}


	componentWillMount() {
		this.getStudent(this.props.project_id);
	}

	render() {
		const columns = [{
			title: '姓名',
			dataIndex: 'name',
			key: 'name'
		}, {
			title: '性别',
			dataIndex: 'sex',
			key: 'sex'
		},  {
			title: '专业',
			dataIndex: 'major',
			key: 'major'
		}, {
			title: '学号',
			dataIndex: 'card_number',
			key: 'card_number'
		}, {
			title: '手机',
			dataIndex: 'phone',
			key: 'phone'
		}, {
			title: '邮箱',
			dataIndex: 'email',
			key: 'email'
		}, {
			title: '状态',
			dataIndex: 'state',
			key: 'state',
			render: (text,record)=> record.state == 1 ? "已确认" : "未确认"
		},{
			title: '操作',
			key: 'action',
			render: (text, record) => (
				<span>
		          <a href="#" onClick={this.confirmToggle.bind(this,record.id)}>{record.state == 1 ? "撤销" :"确认"}</a>
		          <span className="ant-divider" />
		          <a href="#" onClick={this.showDeleteConfirm.bind(this,record.id)}>删除</a>
		        </span>
			),
		}];

		return (
			<div>
		        <div className='top'>
		          <span className='title'>{this.state.projectData.project_name}</span><span className='title'>需要人数：{this.state.projectData.number}</span><span className='title'>报名人数：{this.state.projectData.apply_number}</span>
		        </div>
		        <Table columns={columns} dataSource={this.state.studentData} />  
	       </div>
		);
	}
}

export default ConfirmStudent;