import React from 'react'
import Editor from 'react-umeditor'
import config from '../../config.js'
import './Umeditor.scss';

export default class Umeditor extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			content: ""
		}
	}
	handleChange(content) {
		this.setState({
			content: content
		})
	}
	getIcons() {
		var icons = [
			" bold italic underline strikethrough fontborder emphasis | ",
			"paragraph fontfamily fontsize | superscript subscript | ",
			"forecolor backcolor | removeformat | insertorderedlist insertunorderedlist | selectall | ",
			"cleardoc  | indent outdent | justifyleft justifycenter justifyright | touppercase tolowercase | ",
			"horizontal date time  | image spechars | inserttable"
		]
		return icons;
	}
	getPlugins() {
		return {
			"image": {
				"uploader": {
					"name": "file",
					"url": config.api + "/upload"
				}
			}
		}
	}
	render() {
		var icons = this.getIcons();
		var plugins = this.getPlugins();
		return (
			<Editor 
				ref="editor" 
				icons={icons} 
				value={this.state.content}
				onChange={this.handleChange.bind(this)} 
				plugins={plugins}
				className="editor"
			/>
		)
	}
}