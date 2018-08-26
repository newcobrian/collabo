import React from 'react';
import { Link } from 'react-router';
import CommentList from './CommentList';
import CommentInput from './CommentInput';
import ListErrors from '../ListErrors';

var linkify = require('linkify-it')();

const CommentContainer = props => {
	if (props.authenticated && props.userInfo) {
		return (
			<div className="comments-module">
		          
		          <div className="comment-input-wrapper mrgn-bottom-sm">
		            <ListErrors errors={props.errors}></ListErrors>
		            <CommentInput 
		            	commentObject={props.commentObject} 
		            	threadId={props.threadId}
		            	authenticated={props.authenticated} 
		            	userInfo={props.userInfo}
		            	project={props.project}
		            	orgName={props.orgName}
		            	type={props.type}
		            	usersList={props.usersList} />
		          </div>

		          <CommentList
								comments={props.comments}
								commentObject={props.commentObject}
								authenticated={props.authenticated}
								userInfo={props.userInfo}
								threadId={props.threadId}
								orgName={props.orgName}
								deleteComment={props.deleteComment}
								type={props.type} />


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
					userInfo={props.userInfo}
					threadId={props.threadId}
					deleteComment={props.deleteComment}
					type={props.type} />

				

			</div>
		);
	}
}

export default CommentContainer;