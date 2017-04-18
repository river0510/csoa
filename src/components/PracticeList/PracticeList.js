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
import './PracticeList.scss'

const confirm = Modal.confirm;
const Search = Input.Search;
const Option = Select.Option;


class PracticeList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      yearData: [], //年度数据
      selectedYear: null, //选中的年份
      practiceData: [], //实习数据
      search: [], //所有实习数据，用来搜索
      addStudentVisible: false
    };
  }

  //单个删除确定对话框
  showDeleteConfirm(id, e) {
    e.preventDefault();
    let getPracticeStudent = this.getPracticeStudent();
    let year_id = this.state.selectedYear;

    function deleteTeacher(id) {
      fetch(config.api + '/Practice/deleteStudent?id=' + id, {
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
          getPracticeStudent(year_id);
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
      this.getPracticeStudent(year_id);
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
    fetch(config.api + '/Practice/addStudent', {
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
        this.getPracticeStudent(year_id);
      } else {
        message.error(data.message);
        this.getPracticeStudent(year_id);
      }
    }).catch(err => console.log(err))
  }

  //获取对应年度的学生数据
  getPracticeStudent = (year_id) => {
    fetch(config.api + '/Practice/getPracticeStudent?year_id=' + year_id, {
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
        let practiceStudent = data.practiceStudent;
        practiceStudent.forEach((value, index) => {
          value.key = value.id;
          practiceStudent[index] = value;
        })
        this.setState({
          practiceData: practiceStudent,
          search: practiceStudent
        })
      } else if (data.status == 400) {
        this.setState({
          practiceData: [],
          search: []
        })
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
          this.getPracticeStudent(this.state.selectedYear)
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
      title: '学号',
      dataIndex: 'card_number',
      key: 'card_number'
    }, {
      title: '姓名',
      dataIndex: 'name',
      key: 'name'
    }, {
      title: '专业',
      dataIndex: 'major',
      key: 'major'
    }, {
      title: '班级',
      dataIndex: 'class',
      key: 'class'
    }, {
      title: '实习公司',
      dataIndex: 'company_name',
      key: 'company_name'
    }, {
      title: '指导老师',
      dataIndex: 'teacher_name',
      key: 'teacher_name'
    }, {
      title: '成绩',
      dataIndex: 'grade',
      key: 'grade'
    }, {
      title: '操作',
      key: 'action',
      render: (text, record) => (
        <span>
          <a href="#" onClick={this.showDeleteConfirm.bind(this,record.id)}>删除</a>
        </span>
      ),
    }];

    const options = [];
    this.state.yearData.forEach((value) => {
      options.push(<Option value={value.id} key={value.id}>{value.year}</Option>)
    })
    return (
      <div>
        <div style={{ marginBottom: 16 }}>
          <Select value={this.state.selectedYear} style={{ width: 120 }} onChange={this.handleChange}>
            {options}
          </Select>
          <Button type="primary" className='top-button' onClick={this.showAddModal}>添加学生</Button>
          <Button type="primary" className='top-button' >统计结果导出</Button>
          <Button type="primary" className='top-button' >实习年度管理</Button>
          <Button type="primary" className='top-button' >实习模板管理</Button>
          <Search
            placeholder="搜索卡号、姓名、部门"
            style={{ width: 200 ,float:"right",marginRight:20}}
            onSearch={value=>{this.search(value)}}
          />
        </div>
        <Table columns={columns} dataSource={this.state.practiceData} />
        <Modal
          visible={this.state.addStudentVisible}
          title="添加学生"
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
      </div>
    );
  }
}

export default PracticeList;