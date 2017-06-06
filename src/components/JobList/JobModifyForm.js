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


class JobModifyForm extends React.Component {
	handleSubmit = (e) => {
		e.preventDefault();
		this.props.form.validateFieldsAndScroll((err, values) => {
			if (!err) {
				let bodyquery =
					'id=' + this.props.id +
					'&company_name=' + values.company_name +
					'&company_website=' + values.company_website +
					'&job_name=' + values.job_name +
					'&job_duty=' + values.job_duty +
					'&need_number=' + values.need_number +
					'&working_time=' + values.working_time +
					'&salary=' + values.salary +
					'&demand=' + values.demand +
					'&position=' + values.position +
					'&contacts=' + values.contacts +
					'&contact_number=' + values.contact_number +
					'&recommend_teacher=' + values.recommend_teacher +
					'&other=' + values.other;
				console.log(bodyquery);
				fetch(config.api + '/Practice/modifyJob', {
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
						setTimeout(() => {
							location.reload();
						}, 300)
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
            initialValue: this.props.data.company_name
          })(
            <Input />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="公司网址"
        >
          {getFieldDecorator('company_website', {
            initialValue: this.props.data.company_website
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
            initialValue: this.props.data.job_name
          })(
            <Input />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="岗位职责"
        >
          {getFieldDecorator('job_duty', {
            initialValue: this.props.data.job_duty
          })(
            <Input />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="需要人数"
        >
          {getFieldDecorator('need_number', {
            rules: [{ required: true, message: '请输入需要人数' }],
            initialValue: this.props.data.need_number
          })(
            <Input />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="工作时间"
        >
          {getFieldDecorator('working_time', {
            initialValue: this.props.data.working_time
          })(
            <Input />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="薪水"
        >
          {getFieldDecorator('salary', {
            initialValue: this.props.data.salary
          })(
            <Input />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="工作要求"
        >
          {getFieldDecorator('demand', {
            initialValue: this.props.data.demand
          })(
            <Input />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="公司位置"
        >
          {getFieldDecorator('position', {
            initialValue: this.props.data.position
          })(
            <Input />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="联系人"
        >
          {getFieldDecorator('contacts', {
            initialValue: this.props.data.contacts
          })(
            <Input />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="联系电话"
        >
          {getFieldDecorator('contact_number', {
            initialValue: this.props.data.contact_number
          })(
            <Input />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="推荐教师"
        >
          {getFieldDecorator('recommend_teacher', {
            initialValue: this.props.data.recommend_teacher
          })(
            <Input />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="其他"
        >
          {getFieldDecorator('other', {
            initialValue: this.props.data.other
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
JobModifyForm.contextTypes = {
	router: React.PropTypes.object.isRequired
};
JobModifyForm = Form.create()(JobModifyForm);

export default JobModifyForm;