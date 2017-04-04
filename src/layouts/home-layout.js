import React from 'react'
import Header from '../components/Header/Header'
import Sider from '../components/Sider/Sider'
import './home-layout.scss'
import config from '../config'

class HomeLayout extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			role: {}
		}
	}
	getRole = () => {
		let bodyquery = "role_id=" + sessionStorage.role_id;
		fetch(config.api + '/User/getRole', {
			method: 'post',
			mode: 'cors',
			body: bodyquery,
			headers: {
				"Content-Type": "application/x-www-form-urlencoded"
			},
		}).then((res) => {
			return res.json();
		}).then((data) => {
			if (data.status == 200) {
				this.setState({
					role: data.role
				})
			}
		}).catch(err => console.log(err))
	}
	componentWillMount() {
		if (sessionStorage.userName == null) {
			this.context.router.push('/login');
		}
		this.getRole();
	}
	render() {
		let content = this.props.children;
		return (
			<div>
				<Header/>
				<Sider role={this.state.role}/>
				<div className="content">
					{content}
				</div>
			</div>
		)
	}
}
HomeLayout.contextTypes = {
	router: React.PropTypes.object.isRequired
};
export default HomeLayout