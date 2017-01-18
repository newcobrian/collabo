import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import Firebase from 'firebase';
import * as Actions from '../actions';
import * as Constants from '../constants';
import FollowUserButton from './FollowUserButton';

const mapStateToProps = state => ({
	...state.followers,
	currentUser: state.common.currentUser
});

class Followers extends React.Component {
	componentWillMount() {
		Firebase.database().ref(Constants.USERNAMES_TO_USERIDS_PATH + '/' + this.props.params.username + '/').once('value', snapshot => {
	      if (snapshot.exists()) {
	        let userId = snapshot.val().userId;
	        this.props.getFollowers(userId, Constants.FOLLOWERS_PATH);
	      }
	    });
	}

	componentWillUnmount() {
		Firebase.database().ref(Constants.USERNAMES_TO_USERIDS_PATH + '/' + this.props.params.username + '/').once('value', snapshot => {
	      if (snapshot.exists()) {
	        let userId = snapshot.val().userId;
	        this.props.unloadFollowers(userId, Constants.FOLLOWINGS_PATH);
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
	    	<div>
		      {
		        this.props.followers.map(follower => {
		        	const isUser = this.props.currentUser &&
      					follower.userId === this.props.currentUser.uid;
		          	return (
		          		<div key={follower.userId}>
				          	<div>
				          		<Link
						          to={`@${follower.username}`}
						          className="comment-author">
						          <img src={follower.image} className="comment-author-img" />
						        </Link>
						    </div>
						    <div>
							   	<Link
						          to={`@${follower.username}`}
						          className="comment-author">
						          {follower.username}
						        </Link>
						    </div>
						    <div>
						    	<FollowUserButton
				                isUser={isUser}
				                user={follower}
				                follow={this.props.followUser}
				                unfollow={this.props.unfollowUser}
				                isFollowing={follower.isFollowing}
				                />
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
