import React from 'react'
import Distribute from '../components/DistributeStudent/DistributeStudent'

export default class DistributeStudent extends React.Component {
	render() {
		return (
			<Distribute job_id={this.props.params.job_id} year_id={this.props.params.year_id}/>
		)
	}
}