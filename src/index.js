import 'core-js/fn/object/assign';
import React from 'react';
import ReactDOM from 'react-dom';
import {
	Router,
	Route,
	hashHistory
} from 'react-router';
import HomeLayout from './layouts/home-layout'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Home from './pages/Home'
import AddArticle from './pages/AddArticle'
import Account from './pages/Account'
import UserModify from './pages/UserModify'
import TeacherManage from './pages/TeacherManage'
import StudentManage from './pages/StudentManage'

// Render the main component into the dom
ReactDOM.render((
	<Router history={hashHistory}>
		<Route component={HomeLayout}>
			<Route path='/' component={Account}/>
			<Route path='/addArticle' component={AddArticle}/>
			<Route path='/account' component={Account}/>
			<Route path='/userModify/:role_id/:userName' component={UserModify}/>
			<Route path='/teacherManage' component={TeacherManage}/>
			<Route path='/studentManage' component={StudentManage}/>
		</Route>
		<Route path='/login' component={Login}/>
		<Route path='/signup' component={Signup}/>
	</Router>
), document.getElementById('app'));