import React from 'react'
import {
	Form,
	Icon,
	Input,
	Button,
	Radio,
	message
} from 'antd';
import config from '../../config.js'
const FormItem = Form.Item;
const RadioGroup = Radio.Group;

function hasErrors(fieldsError) {
	return Object.keys(fieldsError).some(field => fieldsError[field]);
}

class CreateUser extends React.Component {
	constructor(props) {
		super(props);
	}
	componentDidMount() {
		// To disabled submit button at the beginning.
		this.props.form.validateFields();
	}
	handleSubmit = (e) => {
		e.preventDefault();
		this.props.form.validateFields((err, values) => {
			if (!err) {
				let bodyquery = "userName=" + values.userName + "&password=" + values.password + "&role=" + values.role;
				fetch(config.api + '/signup', {
					method: 'post',
					mode: 'cors',
					body: bodyquery,
					headers: {
						"Content-Type": "application/x-www-form-urlencoded"
					},
				}).then((res) => {
					return res.json();
				}).then((data) => {
					console.log(data);
					if (data.status == 200) {
						message.success(data.message);
					} else {
						message.error(data.message);
					}
				}).catch(err => console.log(err))
			}
		});
		this.props.getUsers();
	}
	render() {
		const {
			getFieldDecorator,
			getFieldsError,
			getFieldError,
			isFieldTouched
		} = this.props.form;

		// Only show error after a field is touched.
		const userNameError = isFieldTouched('userName') && getFieldError('userName');
		const passwordError = isFieldTouched('password') && getFieldError('password');
		const roleError = isFieldTouched('role') && getFieldError('role');
		return (
			<Form layout="inline" onSubmit={this.handleSubmit} className="createUser">
				<FormItem
		          validateStatus={userNameError ? 'error' : ''}
		          help={userNameError || ''}
		        >
		          {getFieldDecorator('userName', {
		            rules: [{ required: true, message: '请输入用户名!' }],
		          })(
		            <Input prefix={<Icon type="user" style={{ fontSize: 13 }} />} placeholder="请输入用户名" />
		          )}
		        </FormItem>
		        <FormItem
		          validateStatus={passwordError ? 'error' : ''}
		          help={passwordError || ''}
		        >
		          {getFieldDecorator('password', {
		            rules: [{ required: true, message: '请输入密码!' }],
		          })(
		            <Input prefix={<Icon type="lock" style={{ fontSize: 13 }} />} type="password" placeholder="请输入密码" />
		          )}
		        </FormItem>
				<FormItem
				  validateStatus={roleError ? 'error' : ''}
		          help={roleError || ''}					
				>
		          {getFieldDecorator('role',{
		          	rules: [{ required: true, message: '请选择角色!' }]
		          })(
		            <RadioGroup>
		              <Radio value="0" >超级管理员</Radio>
		              <Radio value="1">一般管理员</Radio>
		            </RadioGroup>
		          )}
		        </FormItem>
		        <FormItem>
		          <Button
		            type="primary"
		            htmlType="submit"
		            disabled={hasErrors(getFieldsError())}
		          >
		            新增用户
		          </Button>
		        </FormItem>
	      	</Form>
		);
	}
}

CreateUser = Form.create()(CreateUser);
export default CreateUser;