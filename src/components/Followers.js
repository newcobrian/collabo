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
	        this.props.getProfileCounts(userId);
        	this.props.checkFollowing(this.props.authenticated, userId);
	      }
	      else {
	      	this.props.userDoesntExist();
	      }
	    });
	    this.props.sendMixpanelEvent(Constants.MIXPANEL_PAGE_VIEWED, { 'page name' : 'followers'});
	}

	componentWillUnmount() {
		Firebase.database().ref(Constants.USERNAMES_TO_USERIDS_PATH + '/' + this.props.params.username + '/').once('value', snapshot => {
	      if (snapshot.exists()) {
	        let userId = snapshot.val().userId;
	        this.props.unloadFollowers(userId, Constants.HAS_FOLLOWINGS_PATH);
	        this.props.unloadProfileUser(userId);
      		this.props.unloadProfileFollowing(this.props.authenticated, userId);
	      }
	    });
	    Firebase.database().ref(Constants.USERNAMES_TO_USERIDS_PATH + '/' + this.props.params.username + '/').off();
	    
	    if (!this.props.authenticated) {
      		this.props.setAuthRedirect(this.props.location.pathname);
    	}
	}
	renderTabs() {
	    return (
	      <div className="feed-toggle">
	        <ul className="nav nav-pills  flx flx-row flx-just-space-around flx-align-space-around outline-active">
	          <li className="nav-item">
	            <Link
	              className="nav-link flx flx-col flx-center-all ta-center"
	              to={`/${this.props.profile.username}`}>
	              <div className="stats-number">
	              	{this.props.numGuides}
	              </div>
	              Guides
	            </Link>
	          </li>

	          <li className="nav-item">
	            <Link
	              className="nav-link flx flx-col flx-center-all ta-center"
	              to={`/${this.props.profile.username}/likes`}>
	              <div className="stats-number">
	              {this.props.numLikes}
	              </div>
	              Likes
	            </Link>
	          </li>

	          <li className="nav-item">
	            <Link
	              className="nav-link active flx flx-col flx-center-all ta-center"
	              to={`/${this.props.profile.username}/followers`}>
	              <div className="stats-number">
	              	{this.props.numFollowers}
	              </div>
	              Followers
	            </Link>
	          </li>

	          <li className="nav-item">
	            <Link
	              className="nav-link flx flx-col flx-center-all ta-center"
	              to={`/${this.props.profile.username}/isfollowing`}>
	              <div className="stats-number">
	              {this.props.numFollowing}
	              </div>
	              Following
	            </Link>
	          </li>

	        </ul>
	      </div>
	    );
	}


	render() {
		if (this.props.userNotFound) {
	      return (
	        <div className="error-module flx flx-col flx-center-all ta-center v2-type-body3 color--black">
	          <div className="xiao-img-wrapper mrgn-bottom-sm">
	            <img className="center-img" src="/img/xiaog.png"/>
	          </div>
	          <div className="mrgn-bottom-md">Sorry, we couldn't find this user.</div>
	        </div>
	      );
	    }
	    if (!this.props.profile) {
	      return (
	        <div className="loading-module flx flx-col flx-center-all v2-type-body3 fill--black">
	          <div className="earth-graphic w-100">  
	            <img className="center-img" src="/img/globe01.gif"/>
	          </div>
	          <div>Loading...</div>
	        </div>
	        )
	    }
	    if (this.props.profile.length === 0) {
	      return (
	        <div className="error-module flx flx-col flx-center-all ta-center v2-type-body3 color--black">
	          <div className="xiao-img-wrapper mrgn-bottom-sm">
	            <img className="center-img" src="/img/xiaog.png"/>
	          </div>
	          <div className="mrgn-bottom-md">Sorry, we couldn't find this user.</div>
	        </div>
	      );
	    }

	    if (!this.props.followers) {
	      return (
	        <div className="loading-module flx flx-col flx-center-all v2-type-body3 fill--black">
	          <div className="earth-graphic w-100">  
	            <img className="center-img" src="/img/globe01.gif"/>
	          </div>
	          <div>Loading...</div>
	        </div>
	        )
	    }
	    if (this.props.followers.length === 0) {
	      return (
	        <div className="flx flx-col page-common profile-page flx-align-center">
	          <div className="w-100 w-max mrgn-bottom-md flx flx-row flx-m-col">
		          <ProfileInfo
		            authenticated={this.props.authenticated}
		            profile={this.props.profile}
		            follow={this.props.followUser}
		            signOut={this.props.signOutUser}
		            unfollow={this.props.unfollowUser} />

		          {this.renderTabs()}
	          </div>
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
	    		<div className="w-100 w-max mrgn-bottom-md flx flx-row flx-m-col">
			        <ProfileInfo
			          authenticated={this.props.authenticated}
			          profile={profile}
			          follow={this.props.followUser}
			          unfollow={this.props.unfollowUser} />


			        {this.renderTabs()}
			    </div>
		    	<div className="flx flx-row flx-just-center follow-page w-100 flx-wrap brdr-top">
			      {
			        this.props.followers.map(follower => {
			        	const isUser = this.props.currentUser &&
	      					follower.userId === this.props.currentUser.uid;
			          	return (
			          		<div className="w-100 ta-center pdding-top-sm pdding-bottom-sm brdr-bottom" key={follower.userId}>
				          		<div className="flx flx-row flx-just-start flx-align-center w-100 w-max pdding-left-md pdding-right-md">
					          		<Link
							          to={`/${follower.username}`}
							          className="mrgn-right-md">
							          	<div className="">
							          		<ProfilePic src={follower.image} className="center-img" />
							        	</div>
							        </Link>
								   	<Link
							          to={`/${follower.username}`}
							          className="color--black">
							          {follower.username}
							        </Link>
								    <div className="flx-item-right">
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
