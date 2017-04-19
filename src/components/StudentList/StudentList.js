import React from 'react'
import {
  Table,
  Button,
  Modal,
  message,
  Upload,
  Icon,
  Input
} from 'antd';
import {
  Link
} from 'react-router'
import config from '../../config'
import './StudentList.scss'

const confirm = Modal.confirm;
const Search = Input.Search;

class StudentList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedRowKeys: [], // Check here to configure the default column
      loading: false,
      detailVisible: false,
      importVisible: false,
      data: [], //显示的数据
      search: [], //提供给搜索的所有数据
      detail: {},
    };
  }


  //全部取消 按钮控制
  cancelSeleted = () => {
    this.setState({
      loading: true
    });
    // ajax request after empty completing
    setTimeout(() => {
      this.setState({
        selectedRowKeys: [],
        loading: false,
      });
    }, 200);
  }

  onSelectChange = (selectedRowKeys) => {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    this.setState({
      selectedRowKeys
    });
  }

  //选中启用
  startSeleted = () => {
    let isSuccess = 1;

    //将异步操作 promise封装
    function start(id) {
      return new Promise((resolve, reject) => {
        fetch(config.api + '/User/startStudent?id=' + id, {
          method: 'get',
          mode: 'cors',
          credentials: "include",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          }
        }).then((res) => {
          return res.json();
        }).then((data) => {
          if (data.status != 200) {
            isSuccess = 0;
          }
          resolve();
        }).catch(err => console.log(err))
      })
    }

    let promiseArray = [];
    this.state.selectedRowKeys.forEach((value) => {
      let id = this.state.data[value].id;
      promiseArray.push(start(id));
    })
    Promise.all(promiseArray)
      .then(() => {
        if (isSuccess) {
          message.success('操作成功');
        } else {
          message.error('操作失败');
        }
        this.getStudent();
        this.setState({
          selectedRowKeys: []
        })
      }, (err) => console.log(err))
  }

  //选中停用
  forbidSeleted = () => {
    let isSuccess = 1;

    function forbid(id) {
      return new Promise((resolve, reject) => {
        fetch(config.api + '/User/forbidStudent?id=' + id, {
          method: 'get',
          mode: 'cors',
          credentials: "include",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          }
        }).then((res) => {
          return res.json();
        }).then((data) => {
          if (data.status != 200) {
            isSuccess = 0;
          }
          resolve();
        }).catch(err => console.log(err))
      })
    }

    let promiseArray = [];
    this.state.selectedRowKeys.forEach((value) => {
      let id = this.state.data[value].id;
      promiseArray.push(forbid(id));
    })

    Promise.all(promiseArray)
      .then(() => {
        if (isSuccess) {
          message.success('操作成功');
        } else {
          message.error('操作失败');
        }
        this.getStudent();
        this.setState({
          selectedRowKeys: []
        })
      }, (err) => console.log(err))
  }

  //选中删除确定对话框
  showDeleteSelectedConfirm(e) {
    e.preventDefault();
    let deleteSelectedStudent = this.deleteSeleted;
    confirm({
      title: '确定要删除选中项吗？',
      content: '删除过后将无法恢复',
      onOk() {
        deleteSelectedStudent();
      },
      onCancel() {
        console.log('cancel');
      }
    })
  }

  //选中删除
  deleteSeleted = () => {
    let isSuccess = 1;

    function deleteStudent(id) {
      return new Promise((resolve, reject) => {
        fetch(config.api + '/User/deleteStudent?id=' + id, {
          method: 'get',
          mode: 'cors',
          credentials: "include",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          }
        }).then((res) => {
          return res.json();
        }).then((data) => {
          if (data.status != 200) {
            isSuccess = 0;
          }
          resolve();
        }).catch(err => console.log(err))
      })
    }

    let promiseArray = [];
    this.state.selectedRowKeys.forEach((value) => {
      let id = this.state.data[value].id;
      promiseArray.push(deleteStudent(id));
    })

    Promise.all(promiseArray)
      .then(() => {
        if (isSuccess) {
          message.success('操作成功');
        } else {
          message.error('操作失败');
        }
        this.getStudent();
        this.setState({
          selectedRowKeys: []
        })
      }, (err) => console.log(err))
  }

  //单个删除确定对话框
  showDeleteConfirm(id, e) {
    e.preventDefault();
    let getStudent = this.getStudent;

    function deleteStudent(id) {
      fetch(config.api + '/User/deleteStudent?id=' + id, {
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
          getStudent();
        } else {
          message.error(data.message);
        }
      }).catch(err => console.log(err))
    }

    confirm({
      title: '确定要删除吗？',
      content: '删除过后将无法恢复',
      onOk() {
        deleteStudent(id);
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }

  //显示明细modal
  showDetail(id, e) {
    e.preventDefault();
    this.getOneStudent(id);
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

  //显示教师信息导入modal
  showImport = (e) => {
    e.preventDefault();
    this.setState({
      importVisible: true
    })
  }
  handleImportOk = (e) => {
    e.preventDefault();
    this.getStudent();
    this.setState({
      importVisible: false,
      fileList: []
    })
    message.success('教师信息导入成功');
  }
  handleImportCancel = (e) => {
    e.preventDefault();
    this.setState({
      importVisible: false
    })
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
      message.error('未找到学生信息');
    }
  }

  //获取学生数据
  getStudent = () => {
    fetch(config.api + '/User/getStudent', {
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
        let student = data.student;
        student.forEach((value, index) => {
          value.key = index;
          value.state = value.state == 1 ? '可用' : '停用';
          student[index] = value;
        })
        this.setState({
          data: student,
          search: student
        })
      }
    }).catch(err => console.log(err))
  }
  getOneStudent = (id) => {
    fetch(config.api + '/User/getOneStudent?id=' + id, {
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
        data.student['state'] = data.student['state'] == 1 ? '可用' : '停用'
        this.setState({
          detail: data.student
        })
      }
    }).catch(err => console.log(err))
  }

  componentWillMount() {
    this.getStudent();
  }

  render() {
    const columns = [{
      title: '学生编号',
      dataIndex: 'id',
    }, {
      title: '姓名',
      dataIndex: 'name',
    }, {
      title: '学号',
      dataIndex: 'card_number',
    }, {
      title: '宿舍',
      dataIndex: 'dorm',
    }, , {
      title: '专业',
      dataIndex: 'major',
    }, {
      title: '手机',
      dataIndex: 'phone',
    }, {
      title: '状态',
      dataIndex: 'state',
    }, {
      title: '操作',
      key: 'action',
      render: (text, record) => (
        <span>
          <a href="#" onClick={this.showDetail.bind(this,record.id)}>明细</a>
          <span className="ant-divider" />
          <Link to={'/userModify/' + record.role_id + '/' + record.card_number}>修改</Link>
          <span className="ant-divider" />
          <a href="#" onClick={this.showDeleteConfirm.bind(this,record.id)}>删除</a>
        </span>
      ),
    }];


    const {
      loading,
      selectedRowKeys
    } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
      selections: []
    };
    const hasSelected = selectedRowKeys.length > 0;
    return (
      <div>
        <div style={{ marginBottom: 16 }}>
          <Button type="primary" className='top-button' onClick={this.cancelSeleted} disabled={!hasSelected} loading={loading}>取消选中</Button>
          <Button type="primary" className='top-button' onClick={this.forbidSeleted} disabled={!hasSelected} loading={loading}>选中停用</Button>
          <Button type="primary" className='top-button' onClick={this.startSeleted} disabled={!hasSelected} loading={loading}>选中可用</Button>
          <Button type="primary" className='top-button' onClick={this.showDeleteSelectedConfirm.bind(this)} disabled={!hasSelected} loading={loading}>选中删除</Button>
          <Button type="primary" className='top-button' onClick={this.showImport} >批量导入</Button>
          <span style={{ marginLeft: 8 }}>{hasSelected ? `Selected ${selectedRowKeys.length} items` : ''}</span>
          <Search
            placeholder="搜索卡号、姓名、部门"
            style={{ width: 200 ,float:"right",marginRight:20}}
            onSearch={value=>{this.search(value)}}
          />
        </div>
        <Table rowSelection={rowSelection} columns={columns} dataSource={this.state.data} />
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
            <p>姓名：{this.state.detail.name}</p>
            <p>卡号：{this.state.detail.card_number}</p>
            <p>性别：{this.state.detail.sex}</p>
            <p>生源：{this.state.detail.origin}</p>
            <p>宿舍：{this.state.detail.dorm}</p>
            <p>专业：{this.state.detail.major}</p>          
            <p>手机：{this.state.detail.phone}</p>          
            <p>短号：{this.state.detail.short_phone}</p>
            <p>E-mail：{this.state.detail.email}</p>                    
            <p>QQ：{this.state.detail.qq}</p>
            <p>微信：{this.state.detail.wechat}</p>
          </div>
        </Modal>
        <Modal
          className="import-student-modal"
          width="1100px"
          visible={this.state.importVisible}
          title="教师信息Excel导入"
          onOk={this.handleImportOk}
          onCancel={this.handleImportCancel}
          footer={[
            <Button key="back" type="primary" size="large" onClick={this.handleImportOk}>
              OK
            </Button>,
          ]}
        >
          <p>上传事例：</p>
          <img src="../../imgs/studentExample.png" alt=""/>
          <Upload 
            name="uploadfile" 
            action={config.api + "/User/importStudent"} 
            listType="text"
          >
            <Button className="upload-button">
              <Icon type="upload" /> 选择文件
            </Button>
          </Upload>
        </Modal>        
      </div>
    );
  }
}

export default StudentList;