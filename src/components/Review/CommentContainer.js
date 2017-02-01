import React from 'react';
import { Link } from 'react-router';
import CommentList from './CommentList';
import CommentInput from './CommentInput';
import ListErrors from '../ListErrors';

const CommentContainer = props => {
	if (props.authenticated && props.currentUser) {
		return (
			<div className="comments-module">
		        <CommentList
		          comments={props.comments}
		          review={props.review}
		          currentUser={props.currentUser} />
		        <div className="comment-input-wrapper">
		          <ListErrors errors={props.errors}></ListErrors>
		          <CommentInput review={props.review} currentUser={props.currentUser} authenticated={props.authenticated} />
		        </div>
		     </div>
		);
	} else {
		return (
			<div className="col-xs-12 col-md-8 offset-md-2">
				<p>
					<Link to="login">Sign in</Link>
					&nbsp;or&nbsp;
					<Link to="register">Sign up</Link>
					&nbsp;to add comments to this article.
				</p>

				<CommentList
					comments={props.comments}
					review={props.review}
					currentUser={props.currentUser} />
			</div>
		);
	}
}

export default CommentContainer;