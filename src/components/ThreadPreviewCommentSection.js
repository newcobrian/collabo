import React from 'react';
import { Link } from 'react-router';
import ProfilePic from './ProfilePic';
import ImagePicker from './ImagePicker';
import * as Constants from '../constants';
import * as Helpers from '../helpers';
import CommentContainer from './Review/CommentContainer';
import DisplayTimestamp from './DisplayTimestamp';

class ThreadPreviewCommentSection extends React.Component {
	constructor() {
		super()
	}

	componentDidUpdate() {
	    let scrollHeight = this.commentContainer.scrollHeight
	    this.commentContainer.scrollTop = scrollHeight
	}

	render() {
		return (
			<div className="comment-row-wrapper flx flx-row">
	            <div className="co-thread-reply-wrapper" ref={(el) => { this.commentContainer = el; }}>
	              <CommentContainer
	                authenticated={this.props.authenticated}
	                userInfo={this.props.userInfo}
	                comments={this.props.thread.comments || {}}
	                errors={this.props.commentErrors}
	                commentObject={this.props.thread}
	                threadId={this.props.thread.threadId}
	                thread={this.props.thread}
	                project={this.props.project}
	                orgName={this.props.orgName}
	                orgUserData={this.props.orgUserData}
	                type={Constants.THREAD_TYPE}
	                deleteComment={this.props.deleteComment} />
	            </div>
          </div>
		)
	}
}

export default ThreadPreviewCommentSection;