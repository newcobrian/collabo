import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import Firebase from 'firebase';
import * as Actions from '../actions';
import * as Constants from '../constants';
import FollowUserButton from './FollowUserButton';
import ProfilePic from './ProfilePic';
import ProfileInfo from './ProfileInfo';

const mapStateToProps = state => ({
	...state.followers,
	currentUser: state.common.currentUser,
	authenticated: state.common.authenticated
});

class Followers extends React.Component {
	componentWillMount() {
		// this.props.loadFollowers(this.props.params.username);
		Firebase.database().ref(Constants.USERNAMES_TO_USERIDS_PATH + '/' + this.props.params.username + '/').on('value', snapshot => {
	      if (snapshot.exists()) {
	        let userId = snapshot.val().userId;
	        this.props.getFollowers(userId, Constants.HAS_FOLLOWERS_PATH);
	        this.props.getProfileUser(userId);
        	this.props.checkFollowing(userId);
	      }
	    });
	    this.props.sendMixpanelEvent('Followers page loaded');
	}

	componentWillUnmount() {
		Firebase.database().ref(Constants.USERNAMES_TO_USERIDS_PATH + '/' + this.props.params.username + '/').once('value', snapshot => {
	      if (snapshot.exists()) {
	        let userId = snapshot.val().userId;
	        this.props.unloadFollowers(userId, Constants.HAS_FOLLOWINGS_PATH);
	        this.props.unloadProfileUser(userId);
      		this.props.unloadProfileFollowing(userId);
	      }
	    });
	    Firebase.database().ref(Constants.USERNAMES_TO_USERIDS_PATH + '/' + this.props.params.username + '/').off();
	}
	renderTabs() {
	    return (
	      <div className="feed-toggle flx flx-row flx-just-center w-100 w-max">
	        <ul className="nav nav-pills outline-active">
	          <li className="nav-item">
	            <Link
	              className="nav-link"
	              to={`/${this.props.profile.username}`}>
	              Itineraries
	            </Link>
	          </li>

	          <li className="nav-item">
	            <Link
	              className="nav-link"
	              to={`/${this.props.profile.username}/likes`}>
	              Likes
	            </Link>
	          </li>

	          <li className="nav-item">
	            <Link
	              className="nav-link active"
	              to={`/${this.props.profile.username}/followers`}>
	              {this.props.followerCount} Followers
	            </Link>
	          </li>

	          <li className="nav-item">
	            <Link
	              className="nav-link"
	              to={`/${this.props.profile.username}/isfollowing`}>
	              Following {this.props.followingCount}
	            </Link>
	          </li>

	        </ul>
	      </div>
	    );
	}


	render() {
	    if (!this.props.profile) {
	      return null;
	    }
	    if (this.props.profile.length === 0) {
	      return (<div>User does not exist.</div>);
	    }

	    if (!this.props.followers) {
	      return null;
	    }
	    if (this.props.followers.length === 0) {
	      return (
	        <div className="flx flx-col page-common profile-page flx-align-center">
	          <ProfileInfo
	            authenticated={this.props.authenticated}
	            profile={this.props.profile}
	            follow={this.props.followUser}
	            unfollow={this.props.unfollowUser} />

	          {this.renderTabs()}
	          
	          <div className="flx flx-row flx-just-center w-100">
	            <div>{this.props.profile.username} has no followers yet.</div>
	          </div>
	        </div>
	      )
	    }
		const profile = this.props.profile;
		profile.isFollowing = this.props.isFollowing;

	    return (
	    	<div className="flx flx-col flx-align-center page-common profile-page">

		        <ProfileInfo
		          authenticated={this.props.authenticated}
		          profile={profile}
		          follow={this.props.followUser}
		          unfollow={this.props.unfollowUser} />


		        {this.renderTabs()}

		    	<div className="flx flx-row flx-just-center page-common follow-page pdding-top-md w-100 flx-wrap">
			      {
			        this.props.followers.map(follower => {
			        	const isUser = this.props.currentUser &&
	      					follower.userId === this.props.currentUser.uid;
			          	return (
			          		<div className="flx flx-col flx-center-all flx-wrap ta-center pdding-all-md" key={follower.userId}>
				          		<Link
						          to={`/${follower.username}`}
						          className="">
						          	<div className="mrgn-bottom-sm">
						          		<ProfilePic src={follower.image} className="user-image center-img" />
						        	</div>
						        </Link>
							    <div className="flx flx-col flx-align-center">
								    <div>
									   	<Link
								          to={`/${follower.username}`}
								          className="color--black">
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
			</div>
		);
	}
}

export default connect(mapStateToProps, Actions)(Followers);
export { Followers as Followers, mapStateToProps as mapStateToProps };
