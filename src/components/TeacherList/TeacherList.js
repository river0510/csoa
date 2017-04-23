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
import './TeacherList.scss'

const confirm = Modal.confirm;
const Search = Input.Search;


class TeacherList extends React.Component {
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
      fileList: [],
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
        fetch(config.api + '/User/startTeacher?id=' + id, {
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
        this.getTeacher();
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
        fetch(config.api + '/User/forbidTeacher?id=' + id, {
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
        this.getTeacher();
        this.setState({
          selectedRowKeys: []
        })
      }, (err) => console.log(err))
  }

  //选中删除确定对话框
  showDeleteSelectedConfirm(e) {
    e.preventDefault();
    let deleteSelectedTeacher = this.deleteSeleted;
    confirm({
      title: '确定要删除选中项吗？',
      content: '删除过后将无法恢复',
      onOk() {
        deleteSelectedTeacher();
      },
      onCancel() {
        console.log('cancel');
      }
    })
  }

  //选中删除
  deleteSeleted = () => {
    let isSuccess = 1;

    function deleteTeacher(id) {
      return new Promise((resolve, reject) => {
        fetch(config.api + '/User/deleteTeacher?id=' + id, {
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
      promiseArray.push(deleteTeacher(id));
    })

    Promise.all(promiseArray)
      .then(() => {
        if (isSuccess) {
          message.success('操作成功');
        } else {
          message.error('操作失败');
        }
        this.getTeacher();
        this.setState({
          selectedRowKeys: []
        })
      }, (err) => console.log(err))
  }

  //单个删除确定对话框
  showDeleteConfirm(id, e) {
    e.preventDefault();
    let getTeacher = this.getTeacher;

    function deleteTeacher(id) {
      fetch(config.api + '/User/deleteTeacher?id=' + id, {
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
          getTeacher();
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

  //显示明细modal
  showDetail(id, e) {
    e.preventDefault();
    this.getOneTeacher(id);
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
    this.getTeacher();
    this.setState({
      importVisible: false,
      fileList: []
    })
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
      if (data[i].card_number == value || data[i].name == value || (data[i].department.indexOf(value) != -1)) {
        res.push(data[i]);
      }
    }
    if (!res[0]) {
      this.setState({
        data: data
      })
      message.error('未找到教师信息');
    } else {
      this.setState({
        data: res
      })
    }
  }

  //upload change
  handleChange = (info) => {
    console.log(info);
    let fileList = info.fileList;

    // 1. Limit the number of uploaded files
    //    Only to show two recent uploaded files, and old ones will be replaced by the new
    fileList = fileList.slice(-1);

    if (fileList[0].response) {
      message.success(fileList[0].response.message);
    }

    this.setState({
      fileList: fileList
    });
  }

  //获取老师数据
  getTeacher = () => {
    fetch(config.api + '/User/getTeacher', {
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
        let teacher = data.teacher;
        teacher.forEach((value, index) => {
          value.key = index;
          value.state = value.state == 1 ? '可用' : '停用';
          teacher[index] = value;
        })
        this.setState({
          data: teacher,
          search: teacher
        })
      } else {
        this.setState({
          data: [],
          search: []
        })
      }
    }).catch(err => console.log(err))
  }
  getOneTeacher = (id) => {
    fetch(config.api + '/User/getOneTeacher?id=' + id, {
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
        data.teacher['state'] = data.teacher['state'] == 1 ? '可用' : '停用'
        this.setState({
          detail: data.teacher
        })
      }
    }).catch(err => console.log(err))
  }

  componentWillMount() {
    this.getTeacher();
  }

  render() {
    const columns = [{
      title: '姓名',
      dataIndex: 'name',
    }, {
      title: '卡号',
      dataIndex: 'card_number',
    }, {
      title: '办公室',
      dataIndex: 'office',
    }, {
      title: '办公电话',
      dataIndex: 'telephone',
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
            <p>办公室：{this.state.detail.office}</p>
            <p>办公电话：{this.state.detail.telephone}</p>          
            <p>部门：{this.state.detail.department}</p>
            <p>手机：{this.state.detail.phone}</p>          
            <p>短号：{this.state.detail.short_phone}</p>
            <p>E-mail：{this.state.detail.email}</p>                    
            <p>QQ：{this.state.detail.qq}</p>
            <p>微信：{this.state.detail.wechat}</p>
          </div>
        </Modal>
        <Modal
          className="import-teacher-modal"
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
          <img src="../../imgs/teacherExample.png" alt=""/>
          <Upload 
            name="uploadfile" 
            action={config.api + "/User/importTeacher"} 
            listType="text"
            multiply={false}
            withCredentials={true}
            onChange={this.handleChange}
            fileList={this.state.fileList}
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

export default TeacherList;