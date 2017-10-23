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
import OtherChoseForm from './OtherChoseForm'

const confirm = Modal.confirm;
const Search = Input.Search;


class JobChose extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			jobData: [],
			deadline: null,
			detailVisible: false,
			detail: [],
			search: [],
			otherChoseVisible: false
		};
	}

	//报名确定对话框
	showApplyConfirm(id, e) {
		e.preventDefault();
		let _self = this;

		function applyJob(id) {
			fetch(config.api + '/Practice/applyJob?id=' + id, {
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
					_self.getJob();
				} else {
					message.error(data.message);
				}
			}).catch(err => console.log(err))
		}

		confirm({
			title: '确定要报名吗？',
			content: '每位同学只能选报一个岗位哦（报名前请先前往=>账号管理完善个人信息）',
			onOk() {
				applyJob(id);
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

		function deleteApplyJob() {
			fetch(config.api + '/Practice/deleteApplyJob?', {
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
					_self.getJob();
				} else {
					message.error(data.message);
				}
			}).catch(err => console.log(err))
		}

		confirm({
			title: '确定要撤销吗？',
			content: '老哥，再不报名就截止了',
			onOk() {
				deleteApplyJob();
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
				jobData: data
			})
			message.error('未找到岗位信息');
		} else {
			this.setState({
				jobData: res
			})
		}
	}


	//显示明细modal
	showDetail(id, e) {
		e.preventDefault();
		this.getOneJob(id);
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

	//显示自报岗位modal
	showOtherChose = (e) => {
		e.preventDefault();
		this.setState({
			otherChoseVisible: true
		})
	}
	handleOtherChoseOk = () => {
		this.getJob();
		this.setState({
			otherChoseVisible: false
		})
	}
	handleOtherChoseCancel = () => {
		this.getJob();
		this.setState({
			otherChoseVisible: false
		})
	}

	formColse = () => {
		return this.handleOtherChoseOk();
	}

	//获取对应年度的岗位数据
	getJob = () => {
		fetch(config.api + '/Practice/getJobByStudent', {
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
				data.job.forEach((value) => {
					value.key = value.id
				})
				this.setState({
					jobData: data.job,
					search: data.job,
					deadline: data.deadline
				})
			} else {
				this.setState({
					jobData: [],
					search: [],
					deadline: null
				})
			}
		}).catch(err => console.log(err))
	}

	getOneJob = (id) => {
		fetch(config.api + '/Practice/getOneJobByStudent?id=' + id, {
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
					detail: data.job
				})
			}
		}).catch(err => console.log(err))
	}

	componentWillMount() {
		this.getJob();
	}

	render() {
		const columns = [{
			title: '公司名称',
			dataIndex: 'company_name',
			key: 'company_name',
		}, {
			title: '岗位名称',
			dataIndex: 'job_name',
			key: 'job_name',
		}, {
			title: '待遇',
			dataIndex: 'salary',
			key: 'salary',
			width: 250,
		}, {
			title: '需要人数',
			dataIndex: 'need_number',
			key: 'need_number',
			width: 80,
		}, {
			title: '报名人数',
			dataIndex: 'apply_number',
			key: 'apply_number',
			width: 80,
		}, {
			title: '操作',
			key: 'action',
			width: 100,
			render: (text, record) => {
				if (record.is_chosed == 1) {
					return (
						<span>
					        <a href="#" onClick={this.showDetail.bind(this,record.id)}>明细</a>
					        <span className="ant-divider" />
							已报名
						</span>
					)
				} else {
					return (
						<span>
					        <a href="#" onClick={this.showDetail.bind(this,record.id)}>明细</a>
					        <span className="ant-divider" />
							<a href="#" onClick={this.showApplyConfirm.bind(this,record.id)}>报名</a>
						</span>
					)
				}
			},
		}];

		return (
			<div>
        <div style={{ marginBottom: 16 }}>
          <Button type="primary" className='top-button' onClick={this.showOtherChose}>自选实习</Button>
          <Button type="primary" className='top-button' onClick={this.showDeleteApplyConfirm}>撤销报名</Button>
          <span>截止时间：{this.state.deadline}</span>
          <span style={{marginLeft:20,color:'#2f7ae0',fontSize:15}}>每位同学只能选择一个岗位,有疑问请联系学院 26534325</span>
          <Search
            placeholder="搜索公司或岗位"
            style={{ width: 150 ,float:"right",marginRight:20}}
            onSearch={this.search}
          />
        </div>
        <Table columns={columns} dataSource={this.state.jobData} />
        <Modal
          visible={this.state.otherChoseVisible}
          title="自报岗位"
          onOk={this.handleOtherChoseOk}
          onCancel={this.handleOtherChoseCancel}
          footer={[           
          	<Button key="back" type="primary" size="large" onClick={this.handleOtherChoseOk}>
              取消
            </Button>]}
        >
        	<OtherChoseForm close={this.formColse}/>
        </Modal>
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
            <p><span className='detail-title'>公司名称：</span>{this.state.detail.company_name}</p>
            <p><span className='detail-title'>公司网址：</span>{this.state.detail.company_website}</p>
            <p><span className='detail-title'>岗位名称：</span>{this.state.detail.job_name}</p>
            <p><span className='detail-title'>岗位职责：</span>{this.state.detail.job_duty}</p>
            <p><span className='detail-title'>要求：</span>{this.state.detail.demand}</p>
            <p><span className='detail-title'>待遇：</span>{this.state.detail.salary}</p>
            <p><span className='detail-title'>工作时间：</span>{this.state.detail.working_time}</p>
            <p><span className='detail-title'>公司地址：</span>{this.state.detail.position}</p>
            <p><span className='detail-title'>推荐教师：</span>{this.state.detail.recommend_teacher}</p>
            <p><span className='detail-title'>其他：</span>{this.state.detail.other}</p>
          </div>
        </Modal>
      </div>
		);
	}
}

export default JobChose;