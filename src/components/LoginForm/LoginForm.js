import React from 'react'
import './LoginForm.scss';
import {
	Form,
	Icon,
	Input,
	Button,
	Checkbox,
	message
} from 'antd';
import {
	Link
} from 'react-router';
import config from '../../config'
const FormItem = Form.Item;


class Login extends React.Component {
	constructor() {
		super();
		this.handleSubmit = this.handleSubmit.bind(this);
	}
	handleSubmit(e) {
		e.preventDefault();
		this.props.form.validateFields((err, values) => {
			if (!err) {
				let bodyquery = "userName=" + values.userName + "&password=" + values.password;
				fetch(config.api + '/User/login', {
					method: 'post',
					mode: 'cors',
					body: bodyquery,
					headers: {
						"Content-Type": "application/x-www-form-urlencoded"
					},
				}).then((res) => {
					return res.json();
				}).then((data) => {
					if (data.status == 200) {
						message.success(data.message);
						sessionStorage.userName = data.userName;
						sessionStorage.role = data.role;
						sessionStorage.id = data.id;
						this.context.router.push('/');
					} else {
						message.error(data.message);
					}
				}).catch(err => console.log(err))
			}
		});
	}
	render() {
		const {
			getFieldDecorator
		} = this.props.form;
		return (
			<div className='login-wrapper'>
			  <h2>计软学院学生事务管理系统</h2>
			  <Form onSubmit={this.handleSubmit} className="login-form">
		        <FormItem>
		          {getFieldDecorator('userName', {
		            rules: [{ required: true, message: '请输入校园卡号或用户名!' }],
		          })(
		            <Input prefix={<Icon type="user" style={{ fontSize: 13 }} />} placeholder="校园卡号或用户名" />
		          )}
		        </FormItem>
		        <FormItem>
		          {getFieldDecorator('password', {
		            rules: [{ required: true, message: '请输入密码!' }],
		          })(
		            <Input prefix={<Icon type="lock" style={{ fontSize: 13 }} />} type="password" placeholder="密码" />
		          )}
		        </FormItem>
		        <FormItem>
		          <Button type="primary" htmlType="submit" className="login-form-button">
		            登陆
		          </Button>
		        </FormItem>	        
		      </Form>
      		</div>
		);
	}
}
Login.contextTypes = {
	router: React.PropTypes.object.isRequired
};
Login = Form.create()(Login);
export default Login;