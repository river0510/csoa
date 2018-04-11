import React from 'react'
import ReactDOM from 'react-dom'
import {
	Table,
	Button,
	Modal,
	message,
	Upload,
	Icon,
	Input,
	Select
} from 'antd';
import {
	Link
} from 'react-router'
import config from '../../config'

const confirm = Modal.confirm;
const Search = Input.Search;
const Option = Select.Option;


class ProjectConfirm extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			projectData: [], //课题数据
			addStudentVisible: false,
			importVisible: false,
			modifyId: null,
			modifyData: {},
			fileList: [],
			search: []
		};
	}

	//单个删除确定对话框
	showDeleteConfirm(id, e) {
		e.preventDefault();
		let _self = this;

		function deleteJob(id) {
			fetch(config.api + '/Graduate/deleteJob?id=' + id, {
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
					_self.getProjectByTeacher();
				} else {
					message.error(data.message);
				}
			}).catch(err => console.log(err))
		}

		confirm({
			title: '确定要删除吗？',
			content: '删除过后将无法恢复',
			onOk() {
				deleteJob(id);
			},
			onCancel() {
				console.log('Cancel');
			},
		});
	}

	//搜索
	search = (value) => {
		let data = this.state.search;
		let res = [];
		//卡号、姓名查询
		for (let i = 0; i < data.length; i++) {
			let isFind = data[i].company_name.indexOf(value) != -1 || data[i].job_name.indexOf(value) != -1;
			if (isFind) {
				res.push(data[i]);
			}
		}
		if (!res[0]) {
			this.setState({
				projectData: data
			})
			message.error('未找到岗位信息');
		} else {
			this.setState({
				projectData: res
			})
		}
	}

	toggleLock(id,e){
		e.preventDefault();
		fetch(config.api + '/Graduate/toggleLock?id=' + id, {
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
				this.getProjectByTeacher();				
			} else {
				message.error(data.message);
			}
		}).catch(err => console.log(err))		
	}

	//获取对应年度的岗位数据
	getProjectByTeacher = () => {
		fetch(config.api + '/Graduate/getProjectByTeacher', {
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
				data.project.forEach((value) => {
					value.key = value.id
				})
				this.setState({
					projectData: data.project,
					search: data.project
				})
			} else {
				this.setState({
					projectData: [],
					search: []
				})
			}
		}).catch(err => console.log(err))
	}

	componentWillMount() {
		this.getProjectByTeacher();
	}

	render() {
		const columns = [{
			title: '题目名称',
			dataIndex: 'project_name',
			key: 'project_name',
		}, {
			title: '研究方向',
			dataIndex: 'project_direction',
			key: 'project_direction',
		}, {
			title: '可带学生人数',
			dataIndex: 'number',
			key: 'number',
			width: 200,
		}, {
			title: '已报人数',
			dataIndex: 'apply_number',
			key: 'apply_number',
			width: 200,
		}, {
			title: '状态',
			dataIndex: 'state',
			key: 'state',
			width: 100,
			render: (text,record) => {
				return record.state == 1 ? "锁定" : "未锁定"
			}
		}, {
			title: '操作',
			key: 'action',
			width: 100,
			render: (text, record) => {
				return (
					<span>
				        <Link to={"/confirmStudent/" + record.id} >确认</Link>
				        <span className="ant-divider" />
				        <a href="#" onClick={this.toggleLock.bind(this,record.id)}>{record.state == 1 ? "解锁" : "锁定"}</a>
					</span>
				)
			},
		}];

		return (
		<div>
        <div style={{ marginBottom: 16 }}>
          <Search
            placeholder="搜索卡号、姓名、部门"
            style={{ width: 200 ,float:"right",marginRight:20,marginBottom: 20}}
            onSearch={this.search}
          />
        </div>

        <Table style={{clear: "both"}} columns={columns} dataSource={this.state.projectData} />
 
      </div>
		);
	}
}

export default ProjectConfirm;