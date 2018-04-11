import React from 'react'
import Confirm from '../components/ConfirmResearchStudent/ResearchConfirm'

export default class ConfirmResearchStudent extends React.Component {
	render() {
		return (
			<Confirm project_id={this.props.params.project_id} />
		)
	}
}