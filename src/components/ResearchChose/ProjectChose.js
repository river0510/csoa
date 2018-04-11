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


class ProjectChose extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			projectData: [],
			deadline: null,
			detailVisible: false,
			detail: [],
			search: [],
		};
	}

	//报名确定对话框
	showApplyConfirm(id, e) {
		e.preventDefault();
		let _self = this;

		function applyProject(id) {
			fetch(config.api + '/Research/applyProject?id=' + id, {
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
					_self.getProject();
				} else {
					message.error(data.message);
				}
			}).catch(err => console.log(err))
		}

		confirm({
			title: '确定要报名吗？',
			content: '每位同学只能选报一个课题哦（报名前请先前往=>账号管理完善个人信息）',
			onOk() {
				applyProject(id);
			},
			onCancel() {
				console.log('Cancel');
			},
		});
	}

	//撤销报名确定对话框
	showDeleteApplyConfirm = (e) => {
		e.preventDefault();
		let _self = this;

		function deleteApplyProject() {
			fetch(config.api + '/Research/deleteApplyProject?', {
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
					_self.getProject();
				} else {
					message.error(data.message);
				}
			}).catch(err => console.log(err))
		}

		confirm({
			title: '确定要撤销吗？',
			content: '老哥，再不报名就截止了',
			onOk() {
				deleteApplyProject();
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
			let isFind = (data[i].company_name.indexOf(value) != -1) || (data[i].job_name.indexOf(value) != -1);
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


	//显示明细modal
	showDetail(id, e) {
		e.preventDefault();
		this.getOneProject(id);
		this.setState({
			detailVisible: true
		})
	}
	handleDetailOk = () => {
		this.setState({
			detailVisible: false
		})
	}
	handleDetailCancel = () => {
		this.setState({
			detailVisible: false
		})
	}


	//获取对应年度的岗位数据
	getProject = () => {
		fetch(config.api + '/Research/getProjectByStudent', {
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

			console.log(data.project);
				this.setState({
					projectData: data.project,
					search: data.project,
					deadline: data.deadline
				})
			} else {
				message.error(data.message);
				this.setState({
					projectData: [],
					search: [],
					deadline: null
				})
			}
		}).catch(err => console.log(err))
	}

	getOneProject = (id) => {
		fetch(config.api + '/Research/getOneProject?id=' + id, {
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
				this.setState({
					detail: data.project
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
				if(record.state == 1){
					return (
						<span>
							<a href="#" onClick={this.showDetail.bind(this,record.id)}>明细</a>
				            <span className="ant-divider" />
							<span>
						        {record.is_chosed == 1 ? "已报名" : "已锁定" }
							</span>
						</span>
					)
				}else{
					return (
						<span>
							<a href="#" onClick={this.showDetail.bind(this,record.id)}>明细</a>
				            <span className="ant-divider" />
				            <span>{record.is_chosed == 1 ? "已报名" : <a onClick={this.showApplyConfirm.bind(this,record.id)}>报名</a> }</span>
						</span>
					)
				}
			},
		}];

		return (
			<div>
        <div style={{ marginBottom: 16 }}>
          <Button type="primary" className='top-button' onClick={this.showDeleteApplyConfirm}>撤销报名</Button>
          <span>截止时间：{this.state.deadline}</span>
          <span style={{marginLeft:20,color:'#2f7ae0',fontSize:15}}>请在报名后抓紧时间联系老师，光在网站上等是没用的！</span>
          <Search
            placeholder="搜索课题"
            style={{ width: 150 ,float:"right",marginRight:20}}
            onSearch={this.search}
          />
        </div>
        <Table columns={columns} dataSource={this.state.projectData} />
        <Modal
          visible={this.state.detailVisible}
          title="详细信息"
          onOk={this.handleDetailOk}
          onCancel={this.handleDetailCancel}
          footer={[
            <Button key="back" type="primary" size="large" onClick={this.handleDetailOk}>
              OK
            </Button>,
          ]}
        >
          <div className="detail">
            <p><span className='detail-title'>教师名称：</span>{this.state.detail.name}</p>
            <p><span className='detail-title'>课题名称：</span>{this.state.detail.project_name}</p>
            <p><span className='detail-title'>课题来源：</span>{this.state.detail.project_from}</p>
            <p><span className='detail-title'>研究方向：</span>{this.state.detail.project_direction}</p>
            <p><span className='detail-title'>可带学生人数：</span>{this.state.detail.number}</p>
            <p><span className='detail-title'>课题背景：</span>{this.state.detail.project_background}</p>
            <p><span className='detail-title'>技能要求：</span>{this.state.detail.demand}</p>
            <p><span className='detail-title'>备注：</span>{this.state.detail.other}</p>
            <p><span className='detail-title'>老师办公室：</span>{this.state.detail.office}</p>
            <p><span className='detail-title'>老师办公电话：</span>{this.state.detail.telephone}</p>
            <p><span className='detail-title'>老师手机：</span>{this.state.detail.phone}</p>
            <p><span className='detail-title'>老师短号：</span>{this.state.detail.short_phone}</p>
            <p><span className='detail-title'>老师邮箱：</span>{this.state.detail.email}</p>
          </div>
        </Modal>
      </div>
		);
	}
}

export default ProjectChose;