import React from 'react'
import {
	Form,
	Icon,
	Input,
	Button,
	message
} from 'antd';
import config from '../../config'
const FormItem = Form.Item;

function hasErrors(fieldsError) {
	return Object.keys(fieldsError).some(field => fieldsError[field]);
}

class ModifyPass extends React.Component {
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
				let bodyquery = "id=" + sessionStorage.id + "&password=" + values.password;
				fetch(config.api + '/modifyPass', {
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
			getFieldDecorator,
			getFieldsError,
			getFieldError,
			isFieldTouched
		} = this.props.form;

		// Only show error after a field is touched.
		const passwordError = isFieldTouched('password') && getFieldError('password');
		return (
			<Form layout="inline" onSubmit={this.handleSubmit} className="modifyPass">
		        <FormItem
		          validateStatus={passwordError ? 'error' : ''}
		          help={passwordError || ''}
		        >
		          {getFieldDecorator('password', {
		            rules: [{ required: true, message: '请输入新的密码' }],
		          })(
		            <Input prefix={<Icon type="lock" style={{ fontSize: 13 }} />} type="password" placeholder="请输入新的密码" />
		          )}
		        </FormItem>
		        <FormItem>
		          <Button
		            type="primary"
		            htmlType="submit"
		            disabled={hasErrors(getFieldsError())}
		          >
		            修改密码
		          </Button>
		        </FormItem>
	      	</Form>
		);
	}
}
ModifyPass.contextTypes = {
	router: React.PropTypes.object.isRequired
};
ModifyPass = Form.create()(ModifyPass);
export default ModifyPass;