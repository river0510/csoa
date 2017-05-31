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
	message,
	InputNumber,
	Radio
} from 'antd';
import config from '../../config'
const FormItem = Form.Item;
const RadioGroup = Radio.Group;


class ProjectCreateForm extends React.Component {
	handleSubmit = (e) => {
		e.preventDefault();
		this.props.form.validateFieldsAndScroll((err, values) => {
			if (!err) {
				let bodyquery =
					'&project_name=' + values.project_name +
					'&project_from=' + values.project_from +
					'&project_direction=' + values.project_direction +
					'&number=' + values.number +
					'&project_background=' + values.project_background +
					'&project_work=' + values.project_work +
					'&demand=' + values.demand +
					'&other=' + values.other;
				console.log(bodyquery);
				fetch(config.api + '/Graduate/projectCreate', {
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
          label="课题名称"
        >
          {getFieldDecorator('project_name', {
            rules: [{ required: true, message: '请输入课题名称' }],
          })(
            <Input />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="课程来源"
        >
          {getFieldDecorator('project_from', {
            rules: [{ required: true, message: '请选择课程来源' }],
          })(
			<Select style={{ width: 120 }}>
		      <Option value="国家级项目">国家级项目</Option>
		      <Option value="省部级项目">省部级项目</Option>
		      <Option value="市级项目">市级项目</Option>
		      <Option value="校级项目">校级项目</Option>
		      <Option value="院级项目">院级项目</Option>
		      <Option value="教师自拟">教师自拟</Option>
		      <Option value="师生共拟">师生共拟</Option>
		      <Option value="学生自拟">学生自拟</Option>
		    </Select>
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="研究方向"
        >
          {getFieldDecorator('project_direction', {
            rules: [{ required: true, message: '请选择研究方向' }],
          })(
			<Select style={{ width: 120 }}>
		      <Option value="理论研究">理论研究</Option>
		      <Option value="应用开发">应用开发</Option>
		      <Option value="综合研发">综合研发</Option>
		      <Option value="其他">其他</Option>
		    </Select>
          )}
        </FormItem>
       	<FormItem
          {...formItemLayout}
          label="可携带学生数"
        >
          {getFieldDecorator('number', { initialValue: 1 })(
			<InputNumber min={1} max={999} />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="课题背景"
        >
          {getFieldDecorator('project_background', {
            rules: [{ required: true, message: '请输入课题背景' }],
          })(
            <Input type="textarea" rows={2}/>
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="课题工作"
        >
          {getFieldDecorator('project_work', {
            rules: [{ required: true, message: '请输入课题工作' }],
          })(
            <Input type="textarea" rows={2}/>
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="技能要求"
        >
          {getFieldDecorator('demand', {
            rules: [{ required: true, message: '请输入技能要求' }],
          })(
            <Input type="textarea" rows={2} />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="备注"
        >
          {getFieldDecorator('other')(
            <Input type="textarea" rows={2}/>
          )}
        </FormItem>
        <FormItem {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit" size="large">上报题目</Button>
        </FormItem>
      </Form>
		);
	}
}
ProjectCreateForm.contextTypes = {
	router: React.PropTypes.object.isRequired
};
ProjectCreateForm = Form.create()(ProjectCreateForm);

export default ProjectCreateForm;