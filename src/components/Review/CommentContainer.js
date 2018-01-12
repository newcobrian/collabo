import React from 'react';
import { Link } from 'react-router';
import CommentList from './CommentList';
import CommentInput from './CommentInput';
import ListErrors from '../ListErrors';

const CommentContainer = props => {
	if (props.authenticated && props.userInfo) {
		return (
			<div className="comments-module">
		        <CommentList
		          comments={props.comments}
		          commentObject={props.commentObject}
		          authenticated={props.authenticated}
		          userInfo={props.userInfo}
		          itineraryId={props.itineraryId}
		          deleteComment={props.deleteComment} />
		          
		          <div className="comment-input-wrapper mrgn-top-sm">
		            <ListErrors errors={props.errors}></ListErrors>
		            <CommentInput 
		            	commentObject={props.commentObject} 
		            	itineraryId={props.itineraryId}
		            	authenticated={props.authenticated} 
		            	userInfo={props.userInfo}
		            	type={props.type} />
		          </div>
		     </div>
		);
	} else {
		return (
			<div className="v2-type-body2 pdding-top-sm pdding-bottom-md">
				<div className="mrgn-top-md mrgn-bottom-md brdr-all fill--light-gray pdding-all-sm ta-center">
					<Link className="color--primary" to="/login">Log in</Link>
					&nbsp;or&nbsp;
					<Link className="color--primary" to="/register">Sign up</Link>
					&nbsp;to comment.
				</div>
				<CommentList
					comments={props.comments}
					commentObject={props.commentObject}
					authenticated={props.authenticated}
					userInfo={props.userInfo}
					itineraryId={props.itineraryId}
					deleteComment={props.deleteComment} />
			</div>
		);
	}
}

export default CommentContainer;