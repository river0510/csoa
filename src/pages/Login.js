import React from 'react'
import LoginForm from '../components/LoginForm/LoginForm'

class Login extends React.Component {
	render() {
		//登陆前清除用户信息
		sessionStorage.clear();
		return (
			<div style={{height:"100%",width:"100%",backgroundColor:"#eee"}}>
				<LoginForm/>
			</div>
		)
	}
}

export default Login;