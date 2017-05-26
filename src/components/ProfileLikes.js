import { Profile, mapStateToProps } from './Profile';
import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import Firebase from 'firebase';
import * as Actions from '../actions';
import * as Constants from '../constants';
import FollowUserButton from './FollowUserButton'
import ProxyImage from './ProxyImage';
import ProfileInfo from './ProfileInfo';

class ProfileLikes extends Profile {
  componentWillMount() {
    Firebase.database().ref(Constants.USERNAMES_TO_USERIDS_PATH + '/' + this.props.params.username + '/').once('value', snapshot => {
      if (snapshot.exists()) {
        let userId = snapshot.val().userId;
        this.props.getProfileUser(userId);
        this.props.checkFollowing(userId);
        this.props.getFollowingCount(userId);
        this.props.getFollowerCount(userId);
        this.props.getLikesByUser(this.props.authenticated, userId);
      }
    });
    this.props.sendMixpanelEvent('Likes page loaded');
  }

  componentWillUnmount() {
    if (this.props.profile) {
      this.props.unloadProfileUser(this.props.profile.userId);
      this.props.unloadProfileFollowing(this.props.profile.userId);
      this.props.unloadLikesOrSavesByUser(this.props.profile.userId, Constants.LIKES_BY_USER_PATH);
    }
  }

  onSetPage(page) {
  	// const promise = agent.Articles.favoritedBy(this.props.profile.username, page);
  	// this.props.onSetPage(page, promise);
  }

  renderTabs() {
    return (
      <div className="feed-toggle roow roow-row-center">
          <ul className="nav nav-pills outline-active">
            <li className="nav-item">
              <Link
                className="nav-link"
                to={`@${this.props.profile.username}`}>
                Itineraries
              </Link>
            </li>

            <li className="nav-item">
              <Link
                className="nav-link active"
                to={`@${this.props.profile.username}/likes`}>
                Likes
              </Link>
            </li>

            <li className="nav-item">
              <Link
                className="nav-link"
                to={`@${this.props.profile.username}/followers`}>
                Followers
              </Link>
            </li>

            <li className="nav-item">
              <Link
                className="nav-link"
                to={`@${this.props.profile.username}/isfollowing`}>
                Is Following
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

    const profile = this.props.profile;
    profile.isFollowing = this.props.isFollowing;
    const isUser = this.props.currentUser &&
      this.props.profile.userId === this.props.currentUser.uid;

    return (
      <div className="roow roow-row-top page-common profile-page">

        <ProfileInfo
          authenticated={this.props.authenticated}
          profile={profile}
          follow={this.props.followUser}
          unfollow={this.props.unfollowUser} />

        {this.renderTabs()}
      </div>
    )
  }
}

export default connect(mapStateToProps, Actions)(ProfileLikes);