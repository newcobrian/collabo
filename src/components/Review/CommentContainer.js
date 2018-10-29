import React from 'react';
import { Link } from 'react-router';
import CommentList from './CommentList';
import CommentInput from './CommentInput';
import ListErrors from '../ListErrors';

var linkify = require('linkify-it')();

const CommentContainer = props => {
	if (props.authenticated) {
		return (
			<div className="comments-module-wrapper w-100">
		          
		          

		          <CommentList
					comments={props.comments}
					commentObject={props.commentObject}
					authenticated={props.authenticated}
					threadId={props.threadId}
					thread={props.thread}
					project={props.project}
					orgName={props.orgName}
					deleteComment={props.deleteComment}
					usersList={props.usersList}
					orgUserData={props.orgUserData}
					type={props.type}
					parentId={props.parentId} />

					
					<div className="comment-indent main-reply">
						<div className="comment-input-container">

						  <ListErrors errors={props.errors}></ListErrors>
						  {!props.hideCommentInput && 
						  	<CommentInput 
						  	commentObject={props.commentObject} 
						  	threadId={props.threadId}
						  	authenticated={props.authenticated} 
						  	project={props.project}
						  	orgName={props.orgName}
						  	type={props.type}
						  	usersList={props.usersList}
						  	parentId={props.parentId} />
						  }
						</div>
					</div>
				</div>

		);
	} else {
		return (
			<div className="pdding-top-sm w-100">

				<div className="v2-type-body1 mrgn-bottom-sm brdr-all fill--white brdr--primary w-100 pdding-all-sm ta-center">
					<Link className="color--primary weight-500" to="/login">Log in</Link>
					&nbsp;or&nbsp;
					<Link className="color--primary weight-500" to="/register">Sign up</Link>
					&nbsp;to comment
				</div>


				<CommentList
					comments={props.comments}
					commentObject={props.commentObject}
					authenticated={props.authenticated}
					threadId={props.threadId}
					deleteComment={props.deleteComment}
					type={props.type} />

				

			</div>
		);
	}
}

export default CommentContainer;