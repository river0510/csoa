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
import ProjectModifyForm from './ProjectModifyForm'

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
			otherChoseVisible: false,
			modifyVisible: false,
			modifyData: {}
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

	  //单个删除确定对话框
	  showDeleteConfirm(id, e) {
	    e.preventDefault();
	    let getProject = this.getProject;
	    function deleteTeacher(id) {
	      fetch(config.api + '/Graduate/deleteProject?id=' + id, {
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
	          getProject();
	        } else {
	          message.error(data.message);
	        }
	      }).catch(err => console.log(err))
	    }

	    confirm({
	      title: '确定要删除吗？',
	      content: '删除过后将无法恢复',
	      onOk() {
	        deleteTeacher(id);
	      },
	      onCancel() {
	        console.log('Cancel');
	      },
	    });
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

	//显示修改题目modal
	showProjectModify(id,e){
		e.preventDefault();
		this.getOneProject(id);
		this.setState({
			modifyVisible: true
		})
	}
	modifyOk = () => {
		this.getProject();
		this.setState({
			modifyVisible: false
		})
	}
	modifyCancel = () => {
		this.getProject();
		this.setState({
			modifyVisible: false
		})
	}
	modifyFormColse = () => {
		return this.modifyOk();
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

	//获取对应年度的岗位数据
	getOneProject = (id) => {
		fetch(config.api + '/Graduate/getOneProject?id=' + id, {
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
					modifyData: data.project
				})
			} else {
				this.setState({
					modifyData: {}
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
			render: (text,record) => {
				return record.state == 1 ? "锁定" : "未锁定"
			}
		}, {
			title: '操作',
			key: 'action',
			width: 100,
			render: (text, record) => {
				if (record.is_mine) {
					return (
						<span>
					        <a href="#" onClick={this.showProjectModify.bind(this,record.id)}>修改</a>
					        <span className="ant-divider" />
							<a href="#" onClick={this.showDeleteConfirm.bind(this,record.id)}>删除</a>
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
        <Modal
          visible={this.state.modifyVisible}
          title="题目修改"
          onOk={this.modifyOk}
          onCancel={this.modifyCancel}
          footer={[           
          	<Button key="back" type="primary" size="large" onClick={this.modifyOk}>
              取消
            </Button>]}
        >
        	<ProjectModifyForm close={this.modifyFormColse} data={this.state.modifyData}/>
        </Modal>
      </div>
		);
	}
}

export default JobChose;