import React from 'react';
import { connect } from 'react-redux';
import * as Actions from '../actions';
import * as Constants from '../constants';
import * as Helpers from '../helpers';

// import { Editor } from 'react-draft-wysiwyg';
// import '../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

// draft-js Editor and plugins
// import Editor from 'draft-js-plugins-editor';
// import createToolbarPlugin from 'draft-js-static-toolbar-plugin';
// import 'draft-js-static-toolbar-plugin/lib/plugin.css';

// const toolbarPlugin = createToolbarPlugin();

// const { Toolbar } = toolbarPlugin;

// const plugins = [
// 	toolbarPlugin
// ]


import ReactQuill from 'react-quill';
import Quill from 'quill'
import 'react-quill/dist/quill.snow.css';
import MagicUrl from 'quill-magic-url';
// import QuillMentions from 'quill-mentions'
// import Mention from 'quill-mention'

Quill.register('modules/magicUrl', MagicUrl);
// Quill.register('modules/mention', Mention);

const RichTextEditor = props => {
	var IMAGE_MIME_REGEX = /^image\/(p?jpeg|gif|png)$/i;

	var loadImage = function (file) {
	    var reader = new FileReader();
	    reader.onload = function(e){
	        var img = document.createElement('img');
	        img.src = e.target.result;
	        
	        var range = window.getSelection().getRangeAt(0);
	        range.deleteContents();
	        range.insertNode(img);
	    };
	    reader.readAsDataURL(file);
	};

	document.onpaste = function(e){
	    var items = e.clipboardData.items;

	    for (var i = 0; i < items.length; i++) {
	        if (IMAGE_MIME_REGEX.test(items[i].type)) {
	            loadImage(items[i].getAsFile());
	            return;
	        }
	    }
	    
	   e.PreventDefault()
	}

	const toolbarOptions = props.toolbarHidden ? false : [
		[{ 'font': [] }],
		[{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
		[{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
	    ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
	    ['blockquote', 'code-block'],

	    [{ 'align': [] }],
	    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
	    [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent

	    [ 'link', 'image' ],          // add's image support
	    
	    ['clean']                                         // remove formatting button
	];

	const QuillModules = {
		magicUrl: true,
		toolbar: toolbarOptions,
		// mentions: {}
		// imageDrop: true
	}

	// if (props.mentionsList) {
	// 	QuillModules.mention = {
	// 		allowedChars: /^[A-Za-z\sÅÄÖåäö]*$/,
 //        	mentionDenotationChars: ["@"],
 //        	source: function (searchTerm, renderList, mentionChar) {
	//             let values = props.mentionsList
	            
	//             if (searchTerm.length === 0) {
	//               renderList(values, searchTerm);
	//             } else {
	//               const matches = [];
	//               for (let i = 0; i < values.length; i++)
	//                 if (~values[i].value.toLowerCase().indexOf(searchTerm.toLowerCase())) matches.push(values[i]);
	//               renderList(matches, searchTerm);
	//             }
	// 		}
	// 	}
	// }

	return (
		<div>
			<ReactQuill value={props.editorState}
				wrapperClassName={props.wrapperClass}
		        editorClassName={props.editorClass}
                onChange={(content, delta, source, editor) => {
				    props.onChange(editor.getHTML())
				}}
                modules={QuillModules}
                readOnly={props.readOnly}
            	/>
			{/*<Editor
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
		    />*/}

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