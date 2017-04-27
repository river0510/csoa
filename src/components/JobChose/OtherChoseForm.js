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
const FormItem = Form.Item;


class OtherChoseForm extends React.Component {
	handleSubmit = (e) => {
		e.preventDefault();
		this.props.form.validateFieldsAndScroll((err, values) => {
			if (!err) {
				let bodyquery =
					'&company_name=' + values.company_name +
					'&job_name=' + values.job_name;
				console.log(bodyquery);
				fetch(config.api + '/Practice/otherChose', {
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
						this.props.close();
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
			<Form onSubmit={this.handleSubmit}>
        <FormItem
          {...formItemLayout}
          label="公司名称"
        >
          {getFieldDecorator('company_name', {
            rules: [{ required: true, message: '请输入公司名称' }],
          })(
            <Input />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="岗位名称"
        >
          {getFieldDecorator('job_name', {
            rules: [{ required: true, message: '请输入岗位名称' }],
          })(
            <Input />
          )}
        </FormItem>
        <FormItem {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit" size="large">报名</Button>
        </FormItem>
      </Form>
		);
	}
}
OtherChoseForm.contextTypes = {
	router: React.PropTypes.object.isRequired
};
OtherChoseForm = Form.create()(OtherChoseForm);

export default OtherChoseForm;