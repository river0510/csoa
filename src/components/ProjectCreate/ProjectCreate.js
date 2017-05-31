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
import './JobChose.scss'
import ProjectCreateForm from './ProjectCreateForm'

const confirm = Modal.confirm;
const Search = Input.Search;


class JobChose extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			projectData: [],
			detailVisible: false,
			detail: [],
			search: [],
			otherChoseVisible: false
		};
	}

	//搜索
	search = (value) => {
		let data = this.state.search;
		let res = [];
		//卡号、姓名查询
		for (let i = 0; i < data.length; i++) {
			let isFind = (data[i].project_name.indexOf(value) != -1) || (data[i].project_direction.indexOf(value) != -1);
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

	//显示题目创建modal
	showProjectCreate = (e) => {
		e.preventDefault();
		this.setState({
			otherChoseVisible: true
		})
	}
	handleOtherChoseOk = () => {
		this.getProject();
		this.setState({
			otherChoseVisible: false
		})
	}
	handleOtherChoseCancel = () => {
		this.getProject();
		this.setState({
			otherChoseVisible: false
		})
	}
	formColse = () => {
		return this.handleOtherChoseOk();
	}

	//获取对应年度的岗位数据
	getProject = () => {
		fetch(config.api + '/Graduate/getProject', {
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
		this.getProject();
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
			width: 250,
		}, {
			title: '已报人数',
			dataIndex: 'apply_number',
			key: 'apply_number',
			width: 80,
		}, {
			title: '状态',
			dataIndex: 'state',
			key: 'state',
			width: 80,
		}, {
			title: '操作',
			key: 'action',
			width: 100,
			render: (text, record) => {
				if (record.is_mine) {
					return (
						<span>
					        <a href="#" >修改</a>
					        <span className="ant-divider" />
							<a href="#" >删除</a>
						</span>
					)
				}
			},
		}];

		return (
			<div>
        <div style={{ marginBottom: 16 }}>
          <Button type="primary" className='top-button' onClick={this.showProjectCreate}>添加题目</Button>
          <Search
            placeholder="搜索课题名称、研究方向"
            style={{ width: 150 ,float:"right",marginRight:20}}
            onSearch={this.search}
          />
        </div>
        <Table columns={columns} dataSource={this.state.projectData} />
        <Modal
          visible={this.state.otherChoseVisible}
          title="题目上报"
          onOk={this.handleOtherChoseOk}
          onCancel={this.handleOtherChoseCancel}
          footer={[           
          	<Button key="back" type="primary" size="large" onClick={this.handleOtherChoseOk}>
              取消
            </Button>]}
        >
        	<ProjectCreateForm close={this.formColse}/>
        </Modal>
      </div>
		);
	}
}

export default JobChose;