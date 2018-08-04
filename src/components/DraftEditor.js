import React, { Component } from 'react';
import { EditorState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import '../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

class DraftEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editorState: this.props.body,
    };
  }

  onEditorStateChange: Function = (value) => {
    this.props.changeBody(value)
  };

  render() {
    const { editorState } = this.state;
    return (
      <Editor
        editorState={this.props.body}
        wrapperClassName="demo-wrapper"
        editorClassName="demo-editor"
        onEditorStateChange={this.onEditorStateChange}
      />
    )
  }
}


export default DraftEditor;