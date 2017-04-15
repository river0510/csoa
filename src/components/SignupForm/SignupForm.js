import React from 'react'
import './SignupForm.scss';
import {
	Form,
	Icon,
	Input,
	Button,
	Checkbox,
	message
} from 'antd';
import config from '../../config'
const FormItem = Form.Item;


class Signup extends React.Component {
	constructor() {
		super();
		this.handleSubmit = this.handleSubmit.bind(this);
	}
	handleSubmit(e) {
		e.preventDefault();
		this.props.form.validateFields((err, values) => {
			if (!err) {
				let bodyquery = "userName=" + values.userName + "&password=" + values.password;
				fetch(config.api + '/signup', {
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
						message.success('注册成功');
						sessionStorage.setItem('token', data.token);
						this.context.router.push('/login');
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
			<div className='signup-wrapper'>
			  <h2>注册</h2>
			  <Form onSubmit={this.handleSubmit} className="login-form">
		        <FormItem>
		          {getFieldDecorator('userName', {
		            rules: [{ required: true, message: '请输入用户名!' }],
		          })(
		            <Input prefix={<Icon type="user" style={{ fontSize: 13 }} />} placeholder="Username" />
		          )}
		        </FormItem>
		        <FormItem>
		          {getFieldDecorator('password', {
		            rules: [{ required: true, message: '请输入密码!' }],
		          })(
		            <Input prefix={<Icon type="lock" style={{ fontSize: 13 }} />} type="password" placeholder="Password" />
		          )}
		        </FormItem>
		        <FormItem>
		          <Button type="primary" htmlType="submit" className="signup-form-button">
		            注册
		          </Button>
		        </FormItem>
		      </Form>
      		</div>
		);
	}
}
Signup.contextTypes = {
	router: React.PropTypes.object.isRequired
};
Signup = Form.create()(Signup);
export default Signup;