import React from 'react'
import TeacherModifyForm from '../components/UserModifyForm/TeacherModifyForm'
import StudentModifyForm from '../components/UserModifyForm/StudentModifyForm'

export default class UserModify extends React.Component {
	render() {
		let userModifyForm;
		if (sessionStorage.role_id == 2 || sessionStorage.role_id == 3) {
			userModifyForm = (<TeacherModifyForm />);
		} else if (sessionStorage.role_id == 4) {
			userModifyForm = (<StudentModifyForm />);
		}
		return (
			<div>
				{userModifyForm}
			</div>
		)
	}
}