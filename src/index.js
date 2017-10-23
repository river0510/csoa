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
import PracticeManage from './pages/PracticeManage'
import YearManage from './pages/YearManage'
import JobManage from './pages/JobManage'
import DistributeStudent from './pages/DistributeStudent'
import NotComplete from './pages/NotComplete'
import JobChose from './pages/JobChose'
import GraduateManage from './pages/GraduateManage'
import GraduateYearManage from './pages/GraduateYearManage'
import ProjectCreate from './pages/ProjectCreate'
import ProjectConfirm from './pages/ProjectConfirm'
import ConfirmStudent from './pages/ConfirmStudent'
import ProjectChose from './pages/ProjectChose'

var Promise = require('es6-promise').Promise;
import 'fetch-detector'
import 'fetch-ie8'
require('es6-promise').polyfill();

// Render the main component into the dom
ReactDOM.render((
	<Router history={hashHistory}>
		<Route component={HomeLayout}>
			<Route path='/' component={Account}/>
			<Route path='/notComplete' component={NotComplete}/>
			<Route path='/account' component={Account}/>
			<Route path='/userModify/:role_id/:userName' component={UserModify}/>
			<Route path='/teacherManage' component={TeacherManage}/>
			<Route path='/studentManage' component={StudentManage}/>
			<Route path='/practiceManage' component={PracticeManage}/>
			<Route path='/yearManage' component={YearManage}/>
			<Route path='/jobManage' component={JobManage}/>
			<Route path='/distributeStudent/:job_id/:year_id' component={DistributeStudent}/>
			<Route path='/jobChose' component={JobChose}/>
			<Route path='/graduateManage' component={GraduateManage}/>
			<Route path='/graduateYearManage' component={GraduateYearManage}/>
			<Route path='/projectCreate' component={ProjectCreate}/>
			<Route path='/projectConfirm' component={ProjectConfirm}/>
			<Route path='/confirmStudent/:project_id' component={ConfirmStudent}/>
			<Route path='/projectChose' component={ProjectChose}/>
		</Route>
		<Route path='/login' component={Login}/>
		<Route path='/signup' component={Signup}/>
	</Router>
), document.getElementById('app'));