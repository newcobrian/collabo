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
		          deleteComment={props.deleteComment}
		          type={props.type} />
		          
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
			<div className="pdding-top-sm w-100">

				<CommentList
					comments={props.comments}
					commentObject={props.commentObject}
					authenticated={props.authenticated}
					userInfo={props.userInfo}
					itineraryId={props.itineraryId}
					deleteComment={props.deleteComment}
					type={props.type} />

				<div className="v2-type-body1 mrgn-bottom-sm brdr-all fill--white brdr--primary w-100 pdding-all-sm ta-center">
					<Link className="color--primary weight-500" to="/login">Log in</Link>
					&nbsp;or&nbsp;
					<Link className="color--primary weight-500" to="/register">Sign up</Link>
					&nbsp;to comment
				</div>

			</div>
		);
	}
}

export default CommentContainer;