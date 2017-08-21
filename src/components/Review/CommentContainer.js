import React from 'react';
import { Link } from 'react-router';
import CommentList from './CommentList';
import CommentInput from './CommentInput';
import ListErrors from '../ListErrors';

const CommentContainer = props => {
	if (props.authenticated && props.userInfo) {
		return (
			<div className="comments-module pdding-right-md">
		        <CommentList
		          comments={props.comments}
		          commentObject={props.commentObject}
		          authenticated={props.authenticated}
		          userInfo={props.userInfo}
		          deleteComment={props.deleteComment} />
		          
		          <div className="comment-input-wrapper">
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
			<div className="col-xs-12 col-md-8 offset-md-2">
				<p>
					<Link to="/login">Sign in</Link>
					&nbsp;or&nbsp;
					<Link to="/register">Sign up</Link>
					&nbsp;to add comments to this article.
				</p>

				<CommentList
					comments={props.comments}
					commentObject={props.commentObject}
					authenticated={props.authenticated}
					userInfo={props.userInfo}
					deleteComment={props.deleteComment} />
			</div>
		);
	}
}

export default CommentContainer;