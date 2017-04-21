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
import './DistributeStudent.scss'

const confirm = Modal.confirm;


class DistributeStudent extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			studentData: [], //学生数据
			jobData: []
		};
	}

	//单个删除确定对话框
	showDeleteConfirm(id, e) {
		e.preventDefault();
		let job_id = this.props.job_id,
			getStudent = this.getStudent;

		function unDistribute(id) {
			fetch(config.api + '/Practice/unDistribute?id=' + id, {
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
					getStudent(job_id);
				} else {
					message.error(data.message);
				}
			}).catch(err => console.log(err))
		}

		confirm({
			title: '确定要撤销岗位吗？',
			content: '确定要撤销岗位吗',
			onOk() {
				unDistribute(id);
			},
			onCancel() {
				console.log('Cancel');
			},
		});
	}

	//获取该岗位所有实习生
	getStudent = (job_id) => {
		fetch(config.api + '/Practice/getStudentByJob?job_id=' + job_id, {
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
				jobData: data.job
			})
		}).catch(err => console.log(err))
	}

	//分配学生
	distribute = () => {
		let input = ReactDOM.findDOMNode(this.refs.input);
		let bodyquery = 'job_id=' + this.props.job_id + '&card_number=' + input.value + '&year_id=' + this.props.year_id;
		fetch(config.api + '/Practice/distributeStudent', {
			method: 'post',
			mode: 'cors',
			credentials: "include",
			body: bodyquery,
			headers: {
				"Content-Type": "application/x-www-form-urlencoded"
			},
		}).then((res) => {
			return res.json();
		}).then((data) => {
			if (data.status == 200) {
				message.success(data.message);
				this.getStudent(this.props.job_id);
			} else {
				message.error(data.message);
			}
		}).catch(err => console.log(err))
	}

	componentWillMount() {
		this.getStudent(this.props.job_id);
	}

	render() {
		const columns = [{
			title: '学号',
			dataIndex: 'card_number',
			key: 'card_number'
		}, {
			title: '姓名',
			dataIndex: 'name',
			key: 'name'
		}, {
			title: '操作',
			key: 'action',
			render: (text, record) => (
				<span>
		          <a href="#" onClick={this.showDeleteConfirm.bind(this,record.id)}>撤销分配</a>
		        </span>
			),
		}];

		return (
			<div>
		        <div className='top'>
		          <span className='title'>{this.state.jobData.company_name}</span><span className='title'>{this.state.jobData.job_name}</span><span className='title'>需要人数：{this.state.jobData.need_number}</span><span className='title'>报名人数：{this.state.jobData.apply_number}</span>
		          <div className='distribute'>
			          <Input type='text' ref='input' className='input' placeholder='请输入学号'></Input>
			          <Button type="primary" className='top-button' onClick={this.distribute}>分配学生</Button>		          	
		          </div>
		        </div>
		        <Table columns={columns} dataSource={this.state.studentData} />  
	       </div>
		);
	}
}

export default DistributeStudent;