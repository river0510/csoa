import React from 'react'
import ReactDOM from 'react-dom'
import {
	Table,
	Button,
	Modal,
	message,
	Icon,
	Input,
	DatePicker
} from 'antd';
import {
	Link
} from 'react-router'
import config from '../../config'
import './YearList.scss'

const confirm = Modal.confirm;


class YearList extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			yearData: [], //年度数据
			addYearVisible: false,
			modifyYearVisible: false,
			modifyId: null,
			deadline: null
		};
	}

	//单个删除确定对话框
	showDeleteConfirm(id, e) {
		e.preventDefault();

		let _self = this;

		function deleteTeacher(id) {
			fetch(config.api + '/Practice/deleteYear?id=' + id, {
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
					_self.getYear();
				} else {
					message.error(data.message);
				}
			}).catch(err => console.log(err))
		}

		confirm({
			title: '确定要删除吗？',
			content: '该年度的实习学生名单将一起删除',
			onOk() {
				deleteTeacher(id);
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
			if (data[i].card_number == value || data[i].name == value || data[i].department == value) {
				res.push(data[i]);
				this.setState({
					data: res
				})
			}
		}
		if (!res[0]) {
			this.setState({
				data: data
			})
			message.error('未找到教师信息');
		}
	}

	//添加年度
	showAddModal = () => {
		this.setState({
			addYearVisible: true,
		});
	}
	add = () => {
		let inputNode = ReactDOM.findDOMNode(this.refs.inputYear)
		let bodyquery = 'year=' + inputNode.value + '&deadline=' + this.state.deadline
		fetch(config.api + '/Practice/addYear', {
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
				this.getYear();
				this.setState({
					addYearVisible: false,
					deadline: null,
				});
				inputNode.value = null;
			} else {
				message.error(data.message);
			}
		}).catch(err => console.log(err))
	}
	handleAddCancel = () => {
		this.setState({
			addYearVisible: false,
			deadline: null
		});
		let inputNode = ReactDOM.findDOMNode(this.refs.inputYear)
		inputNode.value = null;
	}

	//修改年度
	showModifyModal(id, e) {
		e.preventDefault()
		this.setState({
			modifyYearVisible: true,
			modifyId: id
		});
	}
	modify = () => {
		let bodyquery = 'id=' + this.state.modifyId + '&deadline=' + this.state.deadline;
		console.log(bodyquery);
		fetch(config.api + '/Practice/modifyYear', {
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
				this.getYear();
				this.setState({
					modifyYearVisible: false,
					deadline: null,
					modifyId: null,
				});
			} else {
				message.error(data.message);
			}
		}).catch(err => console.log(err))
	}
	handleModifyCancel = () => {
		this.setState({
			modifyYearVisible: false,
			deadline: null,
			modifyId: null
		});
	}

	//日期
	onChange = (date, dateString) => {
		this.setState({
			deadline: dateString
		})
	}

	//获取所有年度
	getYear = () => {
		fetch(config.api + '/Practice/getYear', {
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
				data.year.forEach((value, index) => {
					value.key = index
				})
				this.setState({
					yearData: data.year
				})
			}
		}).catch(err => console.log(err))
	}

	componentWillMount() {
		this.getYear();
	}

	render() {
		const columns = [{
			title: '编号',
			dataIndex: 'id',
			key: 'id'
		}, {
			title: '年度',
			dataIndex: 'year',
			key: 'year'
		}, {
			title: '截止日期',
			dataIndex: 'deadline',
			key: 'deadline'
		}, {
			title: '操作',
			key: 'action',
			render: (text, record) => (
				<span>
		          <a href="#" onClick={this.showModifyModal.bind(this,record.id)}>修改</a>
                  <span className="ant-divider" />
		          <a href="#" onClick={this.showDeleteConfirm.bind(this,record.id)}>删除</a>
		        </span>
			),
		}];

		return (
			<div>
		        <div style={{ marginBottom: 16 }}>
		          <Button type="primary" className='top-button' onClick={this.showAddModal}>添加年度</Button>
		        </div>
		        <Table columns={columns} dataSource={this.state.yearData} /> 
		        <Modal
		          className='add-year'
		          visible={this.state.addYearVisible}
		          title="实习年度管理"
		          onOk={this.handleYearOk}
		          onCancel={this.handleAddCancel}
		          footer={[
		            <Button key="cancel" type="primary" size="large" onClick={this.handleAddCancel}>取消</Button>,
		            <Button key="OK" type="primary" size="large" onClick={this.add}>添加</Button>,
		          ]}
		        >
		          <span className='add-year-label'>年度：</span>
		          <Input type="text" ref='inputYear' className='input-year' ref="inputYear"/>
		          <span className='add-year-label'>截止日期：</span>
		          <DatePicker onChange={this.onChange} />
		        </Modal>
		        <Modal
		          className='modify-year'
		          visible={this.state.modifyYearVisible}
		          title="实习年度管理"
		          onCancel={this.handleModifyCancel}
		          footer={[
		            <Button key="cancel" type="primary" size="large" onClick={this.handleModifyCancel}>取消</Button>,
		            <Button key="OK" type="primary" size="large" onClick={this.modify}>修改</Button>,
		          ]}
		        >
		          <span className='add-year-label'>截止日期：</span>
		          <DatePicker onChange={this.onChange} />
		        </Modal>   
	       </div>
		);
	}
}

export default YearList;