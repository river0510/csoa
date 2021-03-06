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


class GraduateList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      yearData: [], //年度数据
      selectedYear: null, //选中的年份
      graduateData: [], //毕设数据
      search: [], //所有实习数据，用来搜索
      addStudentVisible: false,
      detailVisible: false,
      detail: []
    };
  }

  //单个删除确定对话框
  showDeleteConfirm(id, e) {
    e.preventDefault();
    let getGraduateStudent = this.getGraduateStudent();
    let year_id = this.state.selectedYear;

    function deleteTeacher(id) {
      fetch(config.api + '/Research/deleteStudent?id=' + id, {
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
          getGraduateStudent(year_id);
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

  //搜索
  search = (value) => {
    let data = this.state.search;
    let res = [];
    //卡号、姓名查询
    for (let i = 0; i < data.length; i++) {
      let isFind = data[i].name.indexOf(value) != -1 || data[i].card_number.indexOf(value) != -1;
      if (isFind) {
        res.push(data[i]);
      }
    }
    if (!res[0]) {
      this.setState({
        graduateData: data
      })
      message.error('未找到学生信息');
    } else {
      this.setState({
        graduateData: res
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

  //下拉选择
  handleChange = (value) => {
    this.setState({
      selectedYear: value
    }, () => {
      let year_id = this.state.selectedYear;
      console.log(`selected ${year_id}`);
      this.getGraduateStudent(year_id);
    })
  }

  //添加学生
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
  addStudent = () => {
    if (!this.state.selectedYear) {
      message.error('请选择实习年份');
      return;
    }
    let inputNode = ReactDOM.findDOMNode(this.refs.inputStudents)
    let year_id = this.state.selectedYear;
    let bodyquery = 'year_id=' + year_id + '&students=' + inputNode.value;
    fetch(config.api + '/Research/addStudent', {
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
        this.getGraduateStudent(year_id);
      } else {
        message.error(data.message);
        this.getGraduateStudent(year_id);
      }
    }).catch(err => console.log(err))
  }

  //获得一个课题详细信息
  getOneProject = (id)=>{
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
        console.log(data)

        this.setState({
          detail: data.project
        })
      } else if (data.status == 400) {
        message.error(data.message);
      }
    }).catch(err => console.log(err))
  }

  //获取对应年度的学生数据
  getGraduateStudent = (year_id) => {
    fetch(config.api + '/Research/getGraduateStudent?year_id=' + year_id, {
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
        let graduateStudent = data.graduateStudent;
        graduateStudent.forEach((value, index) => {
          value.key = value.id;
          graduateStudent[index] = value;
          delete graduateStudent[index].grade;
        })
        console.log(graduateStudent);
        this.setState({
          graduateData: graduateStudent,
          search: graduateStudent
        })
      } else if (data.status == 400) {
        this.setState({
          graduateData: [],
          search: []
        })
        message.error(data.message);
      }
    }).catch(err => console.log(err))
  }

  //获取所有年度
  getYear = () => {
    fetch(config.api + '/Research/getYear', {
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
          this.getGraduateStudent(this.state.selectedYear)
        })
      }
    }).catch(err => console.log(err))
  }

  componentWillMount() {
    this.getYear();
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
      title: '研究题目',
      dataIndex: 'project_name',
      key: 'project_name'
    }, {
      title: '指导教师',
      dataIndex: 'teacher_name',
      key: 'teacher'
    },{
      title: '操作',
      key: 'action',
      render: (text, record) => (
        <span>
          <a href="#" onClick={this.showDetail.bind(this,record.project_id)}>明细</a>
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


    return (
      <div>
        <div style={{ marginBottom: 16 }}>
          <Select value={this.state.selectedYear} style={{ width: 120 }} onChange={this.handleChange}>
            {options}
          </Select>
          <Button type="primary" className='top-button' onClick={this.showAddModal}>添加学生</Button>
          <Button type="primary" className='top-button' ><a href={config.api + '/Research/export?year_id=' + this.state.selectedYear}>统计结果导出</a></Button>
          <Button type="primary" className='top-button' ><a href={config.api + '/Research/export2?year_id=' + this.state.selectedYear}>入所题目导出</a></Button>
          <Button type="primary" className='top-button' ><Link to='/researchYearManage'>年度管理</Link></Button>
          {/*<Button type="primary" className='top-button' >模板管理</Button>*/}
          <Search
            placeholder="搜索卡号、姓名、部门"
            style={{ width: 200 ,float:"right",marginRight:20}}
            onSearch={this.search}
          />
        </div>
        <Table columns={columns} dataSource={this.state.graduateData} />
        <Modal
          visible={this.state.addStudentVisible}
          title={year+"年度添加学生"}
          onOk={this.handleAddOk}
          onCancel={this.handleAddCancel}
          footer={[
            <Button key="OK" type="primary" size="large" onClick={this.handleAddOk}>
              OK
            </Button>,
          ]}
        >
          <Input type="textarea" rows={10} ref='inputStudents'/>
          <Button type="primary" onClick={this.addStudent} className='add-button'>添加</Button>
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
            <p><span className='detail-title'>教师名称：</span>{this.state.detail.name}</p>
            <p><span className='detail-title'>课题名称：</span>{this.state.detail.project_name}</p>
            <p><span className='detail-title'>课题来源：</span>{this.state.detail.project_from}</p>
            <p><span className='detail-title'>研究方向：</span>{this.state.detail.project_direction}</p>
            <p><span className='detail-title'>可带学生人数：</span>{this.state.detail.number}</p>
            <p><span className='detail-title'>课题背景：</span>{this.state.detail.project_background}</p>
            <p><span className='detail-title'>技能要求：</span>{this.state.detail.demand}</p>
            <p><span className='detail-title'>备注：</span>{this.state.detail.other}</p>
          </div>
        </Modal>    
      </div>
    );
  }
}

export default GraduateList;