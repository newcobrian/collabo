import React from 'react';
import { connect } from 'react-redux';
import * as Actions from '../actions';
import * as Constants from '../constants';
import * as Helpers from '../helpers';

import { Editor } from 'react-draft-wysiwyg';
import '../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

// draft-js Editor and plugins
// import Editor from 'draft-js-plugins-editor';
// import createToolbarPlugin from 'draft-js-static-toolbar-plugin';
// import 'draft-js-static-toolbar-plugin/lib/plugin.css';

// const toolbarPlugin = createToolbarPlugin();

// const { Toolbar } = toolbarPlugin;

// const plugins = [
// 	toolbarPlugin
// ]

const RichTextEditor = props => {
	return (
		<div>
			<Editor
		        editorState={props.editorState}
		        wrapperClassName={props.wrapperClass}
		        editorClassName={props.editorClass}
		        onEditorStateChange={props.onChange}
		        mention={{
	              separator: ' ',
	              trigger: '@',
	              suggestions: props.usersList,
	            }}
	            toolbarHidden={props.toolbarHidden}
	            readOnly={props.readOnly}
		    />

			{/*<Editor value={this.props.body} onChange={this.changeBody} />
			<Editor
		        editorState={props.editorState}
		        wrapperClassName={props.wrapperClass}
		        editorClassName={props.editorClass}
		        onChange={props.onChange}
		        plugins={plugins}
			    />
			    <Toolbar /> */}
		</div>
	)
}

export default RichTextEditor;