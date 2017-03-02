import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import Firebase from 'firebase';
import * as Actions from '../actions';
import * as Constants from '../constants';
import FollowUserButton from './FollowUserButton';
import ProxyImage from './ProxyImage';

const mapStateToProps = state => ({
	...state.followers,
	currentUser: state.common.currentUser,
	authenticated: state.common.authenticated
});

class Followers extends React.Component {
	componentWillMount() {
		Firebase.database().ref(Constants.USERNAMES_TO_USERIDS_PATH + '/' + this.props.params.username + '/').once('value', snapshot => {
	      if (snapshot.exists()) {
	        let userId = snapshot.val().userId;
	        this.props.getFollowers(userId, Constants.HAS_FOLLOWERS_PATH);
	      }
	    });
	}

	componentWillUnmount() {
		Firebase.database().ref(Constants.USERNAMES_TO_USERIDS_PATH + '/' + this.props.params.username + '/').once('value', snapshot => {
	      if (snapshot.exists()) {
	        let userId = snapshot.val().userId;
	        this.props.unloadFollowers(userId, Constants.HAS_FOLLOWINGS_PATH);
	      }
	    });
	}

	render() {
		if (!this.props.followers) {
		    return (
		      <div className="article-preview">Loading...</div>
		    );
		  }

	    return (
	    	<div className="roow roow-col-left page-common follow-page">
		    	<div className="page-title-wrapper">
			      <div className="text-page-title">Following</div>
			    </div>
		      {
		        this.props.followers.map(follower => {
		        	const isUser = this.props.currentUser &&
      					follower.userId === this.props.currentUser.uid;
		          	return (
		          		<div className="roow roow-row list-row" key={follower.userId}>
				          	<div className="">
				          		<Link
						          to={`@${follower.username}`}
						          className="comment-author">
						          	<div className="reviewer-photo center-img">
						          		<ProxyImage src={follower.image} className="comment-author-img" />
						        	</div>
						        </Link>
						    </div>
						    <div className="roow roow-col-left">
							    <div>
								   	<Link
							          to={`@${follower.username}`}
							          className="comment-author">
							          {follower.username}
							        </Link>
							    </div>
							    <div>
							    	<FollowUserButton
							    	authenticated={this.props.authenticated}
					                isUser={isUser}
					                user={follower}
					                follow={this.props.followUser}
					                unfollow={this.props.unfollowUser}
					                isFollowing={follower.isFollowing}
					                />
					            </div>
					        </div>
						</div>
          			)
		      	})
		      }
		    </div>
		);
	}
}

export default connect(mapStateToProps, Actions)(Followers);
export { Followers as Followers, mapStateToProps as mapStateToProps };
