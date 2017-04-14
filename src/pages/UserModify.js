import React from 'react'
import {
	message
}
from 'antd'
import TeacherModifyForm from '../components/UserModifyForm/TeacherModifyForm'
import StudentModifyForm from '../components/UserModifyForm/StudentModifyForm'


export default class UserModify extends React.Component {
	render() {
		let userModifyForm;
		if (sessionStorage.userName != this.props.params.userName && sessionStorage.role_id != 1) {
			window.history.back();
			message.error('想偷窥？')
		}
		if (this.props.params.role_id == 2 || this.props.params.role_id == 3) {
			userModifyForm = (<TeacherModifyForm role_id={this.props.params.role_id} userName={this.props.params.userName}/>);
		} else if (this.props.params.role_id == 4) {
			userModifyForm = (<StudentModifyForm role_id={this.props.params.role_id} userName={this.props.params.userName}/>);
		}
		return (
			<div>
				{userModifyForm}
			</div>
		)
	}
}