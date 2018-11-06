import React from 'react';
import CommentContainer from './Review/CommentContainer';

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