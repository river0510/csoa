import React from 'react'
import Confirm from '../components/ConfirmStudent/ConfirmStudent'

export default class ConfirmStudent extends React.Component {
	render() {
		return (
			<Confirm project_id={this.props.params.project_id} />
		)
	}
}