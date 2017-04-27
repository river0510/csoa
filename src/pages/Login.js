import React from 'react'
import LoginForm from '../components/LoginForm/LoginForm'

class Login extends React.Component {
	render() {
		return (
			<div style={{height:"100%",width:"100%",backgroundColor:"#ddd"}}>
				<LoginForm/>
			</div>
		)
	}
}

export default Login;