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
import JobModifyForm from './JobModifyForm'
import './JobList.scss'

const confirm = Modal.confirm;
const Search = Input.Search;
const Option = Select.Option;


class JobList extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			yearData: [], //年度数据
			selectedYear: null, //选中的年份
			jobData: [], //实习数据
			addStudentVisible: false,
			importVisible: false,
			modifyId: null,
			modifyData: {}
		};
	}

	//单个删除确定对话框
	showDeleteConfirm(id, e) {
		e.preventDefault();
		let _self = this;

		function deleteJob(id) {
			fetch(config.api + '/Practice/deleteJob?id=' + id, {
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
					_self.getJob(_self.state.selectedYear);
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

	//下拉选择
	handleChange = (value) => {
		this.setState({
			selectedYear: value
		}, () => {
			let year_id = this.state.selectedYear;
			console.log(`selected ${year_id}`);
			this.getJob(year_id);
		})
	}

	//添加岗位
	showAddModal = () => {
		this.setState({
			addStudentVisible: true,
		});
	}
	handleAddOk = () => {
		this.setState({
			addStudentVisible: false
		});
		let inputNode = ReactDOM.findDOMNode(this.refs.inputStudents)
		inputNode.value = null;
	}
	handleAddCancel = () => {
		this.setState({
			addStudentVisible: false
		});
		let inputNode = ReactDOM.findDOMNode(this.refs.inputStudents)
		inputNode.value = null;
	}


	//显示岗位信息导入modal
	showImport = (e) => {
		e.preventDefault();
		this.setState({
			importVisible: true
		})
	}
	handleImportOk = (e) => {
		e.preventDefault();
		this.getJob(this.state.selectedYear);
		this.setState({
			importVisible: false,
			fileList: []
		})
		message.success('岗位信息导入成功');
	}
	handleImportCancel = (e) => {
		e.preventDefault();
		this.setState({
			importVisible: false
		})
	}

	//显示岗位信息修改modal
	showModify(id, e) {
		e.preventDefault();
		this.setState({
			modifyId: id,
			modifyVisible: true
		})
		this.getOneJob(id);
	}
	handleModifyOk = (e) => {
		e.preventDefault();
		this.setState({
			modifyVisible: false
		})
	}
	handleModifyCancel = (e) => {
		e.preventDefault();
		this.setState({
			modifyVisible: false
		})
	}

	//获取对应年度的岗位数据
	getJob = (year_id) => {
		fetch(config.api + '/Practice/getJob?year_id=' + year_id, {
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
				})
			} else {
				this.setState({
					jobData: []
				})
				message.error(data.message);
			}
		}).catch(err => console.log(err))
	}

	getOneJob = (id) => {
		fetch(config.api + '/Practice/getOneJob?id=' + id, {
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
					modifyData: data.job
				})
			} else {
				message.error(data.message);
			}
		}).catch(err => console.log(err))
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
				this.setState({
					yearData: data.year,
					selectedYear: data.year[0].id
				}, () => {
					this.getJob(this.state.selectedYear)
				})
			}
		}).catch(err => console.log(err))
	}

	componentWillMount() {
		this.getYear();
	}

	render() {
		const columns = [{
			title: '公司名称',
			dataIndex: 'company_name',
			key: 'company_name'
		}, {
			title: '岗位名称',
			dataIndex: 'job_name',
			key: 'job_name'
		}, {
			title: '需要人数',
			dataIndex: 'need_number',
			key: 'need_number'
		}, {
			title: '报名人数',
			dataIndex: 'apply_number',
			key: 'apply_number'
		}, {
			title: '操作',
			key: 'action',
			render: (text, record) => (
				<span>
          <a href="#" onClick={this.showDeleteConfirm.bind(this,record.id)}>分配学生</a>
          <span className="ant-divider" />
          <a href="#" onClick={this.showModify.bind(this,record.id)}>修改</a>
          <span className="ant-divider" />
          <a href="#" onClick={this.showDeleteConfirm.bind(this,record.id)}>删除</a>
        </span>
			),
		}];

		const options = [];
		let year;
		this.state.yearData.forEach((value) => {
			options.push(<Option value={value.id} key={value.id}>{value.year}</Option>)
			if (value.id == this.state.selectedYear)
				year = value.year;
		})

		let deadline,
			yearData = this.state.yearData,
			year_id = this.state.selectedYear;
		yearData.forEach((value, index) => {
			if (value.id == year_id) {
				deadline = value.deadline;
			}
		})

		return (
			<div>
        <div style={{ marginBottom: 16 }}>
          <Select value={this.state.selectedYear} style={{ width: 120 }} onChange={this.handleChange}>
            {options}
          </Select>
          <Button type="primary" className='top-button' onClick={this.showImport}>添加岗位</Button>
          <span>报名截止时间：{deadline}</span>
          <Search
            placeholder="搜索卡号、姓名、部门"
            style={{ width: 200 ,float:"right",marginRight:20}}
            onSearch={value=>{this.search(value)}}
          />
        </div>
        <Table columns={columns} dataSource={this.state.jobData} />
        <Modal
          className='import-modal'
          width="1100px"
          visible={this.state.importVisible}
          title="岗位信息Excel导入"
          onOk={this.handleImportOk}
          onCancel={this.handleImportCancel}
          footer={[
            <Button key="back" type="primary" size="large" onClick={this.handleImportOk}>
              OK
            </Button>,
          ]}
        >
          <p>上传事例：</p>
          <img src="../../imgs/jobExample.png" alt=""/>
          <Upload 
            name="uploadfile" 
            action={config.api + "/Practice/importJob?year_id=" + this.state.selectedYear} 
            listType="text"
          >
            <Button className="upload-button">
              <Icon type="upload" /> 选择文件
            </Button>
          </Upload>
        </Modal>
        <Modal
          visible={this.state.modifyVisible}
          title="岗位信息修改"
          onOk={this.handleModifyOk}
          onCancel={this.handleModifyCancel}
          footer={[           
          	<Button key="back" type="primary" size="large" onClick={this.handleModifyOk}>
              OK
            </Button>]}
        >
			<JobModifyForm id={this.state.modifyId} data={this.state.modifyData}/>
        </Modal> 
      </div>
		);
	}
}

export default JobList;