import React from 'react'
import {
	Popover,
	Tag
} from 'antd';

export default class FeedBack extends React.Component {
	render() {
		const content = (
			<div style={{fontSize:15}}>
			    <p>系统还开发没多久就急着使用，所以可能存在一些bug。有任何建议或者bug反馈请联系：</p>
			    <p>邮箱：851164343@qq.com</p>
			    <p>感谢老哥，稳！</p>
			</div>
		);
		return (
			<Popover content={content} title="Title">
			    <Tag color="blue" style={{marginLeft:20}}>问题反馈</Tag>
			  </Popover>
		)
	}
}