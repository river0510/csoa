import React from 'react'
import {
  Form,
  Input,
  Tooltip,
  Icon,
  Cascader,
  Select,
  Row,
  Col,
  Checkbox,
  Button,
  message
} from 'antd';
import config from '../../config'
import './UserModifyForm.scss'
const FormItem = Form.Item;


class StudentModifyForm extends React.Component {
  state = {
    data: {}
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        let bodyquery =
          'card_number=' + this.props.userName +
          '&role_id=' + this.props.role_id +
          '&class=' + values.class +
          '&major=' + values.major +
          '&dorm=' + values.dorm +
          '&identity_card=' + values.identity_card +
          '&phone=' + values.phone +
          '&short_phone=' + values.short_phone +
          '&email=' + values.email +
          '&qq=' + values.qq +
          '&wechat=' + values.wechat;
        console.log(bodyquery);
        fetch(config.api + '/User/userModify', {
          method: 'post',
          mode: 'cors',
          body: bodyquery,
          credentials: "include",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
        }).then((res) => {
          return res.json();
        }).then((data) => {
          if (data.status == 200) {
            message.success(data.message);
            window.history.back();
            location.reload();
          } else {
            message.error(data.message);
          }
        }).catch(err => console.log(err))
      }
    });
  }
  getUserInfo = () => {
    let bodyquery = 'userName=' + this.props.userName + '&role_id=' + this.props.role_id;
    fetch(config.api + '/User/getUserInfo', {
      method: 'post',
      mode: 'cors',
      body: bodyquery,
      credentials: "include",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
    }).then((res) => {
      return res.json();
    }).then((data) => {
      if (data.status == 200) {
        this.setState({
          data: data
        })
      }
    }).catch(err => console.log(err))
  }

  componentDidMount() {
    this.getUserInfo();
  }

  render() {
    const {
      getFieldDecorator
    } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: {
          span: 24
        },
        sm: {
          span: 6
        },
      },
      wrapperCol: {
        xs: {
          span: 24
        },
        sm: {
          span: 14
        },
      },
    };
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 14,
          offset: 6,
        },
      },
    };
    return (
      <Form onSubmit={this.handleSubmit} className='user-modify'>
        <FormItem
          {...formItemLayout}
          label="班级"
        >
          {getFieldDecorator('class', {
            rules: [{ required: true, message: '请输入你的班级' }],
            initialValue: this.state.data.class
          })(
            <Input />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="专业"
        >
          {getFieldDecorator('major', {
            rules: [{ required: true, message: '请输入你的专业' }],
            initialValue: this.state.data.major
          })(
            <Input />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="宿舍"
        >
          {getFieldDecorator('dorm', {
            rules: [{ required: true, message: '请输入你的宿舍' }],
            initialValue: this.state.data.dorm
          })(
            <Input />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="身份证"
        >
          {getFieldDecorator('identity_card', {
            rules: [{ required: true, message: '请输入你的身份证号' }],
            initialValue: this.state.data.identity_card
          })(
            <Input />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="手机"
        >
          {getFieldDecorator('phone', {
            rules: [{ required: true, message: '请输入你的手机号' }],
            initialValue: this.state.data.phone
          })(
            <Input />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="短号"
        >
          {getFieldDecorator('short_phone', {
            rules: [{ required: true, message: '请输入你的短号，没有则填写‘无’' }],
            initialValue: this.state.data.short_phone
          })(
            <Input />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="E-mail"
        >
          {getFieldDecorator('email', {
            rules: [{
              type: 'email', message: '老铁，你邮箱能不能正常点？',
            }, {
              required: true, message: '请输入你的邮箱',
            }],
            initialValue: this.state.data.email
          })(
            <Input />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="QQ"
        >
          {getFieldDecorator('qq', {
            rules: [{ required: true, message: '请输入你的QQ' }],
            initialValue: this.state.data.qq
          })(
            <Input />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="微信"
        >
          {getFieldDecorator('wechat', {
            rules: [{ required: true, message: '请输入你的微信' }],
            initialValue: this.state.data.wechat
          })(
            <Input />
          )}
        </FormItem>
        <FormItem {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit" size="large">修改</Button>
        </FormItem>
      </Form>
    );
  }
}
StudentModifyForm.contextTypes = {
  router: React.PropTypes.object.isRequired
};
StudentModifyForm = Form.create()(StudentModifyForm);

export default StudentModifyForm;