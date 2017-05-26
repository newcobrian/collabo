import { Profile, mapStateToProps } from './Profile';
import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import Firebase from 'firebase';
import * as Actions from '../actions';
import * as Constants from '../constants';
import FollowUserButton from './FollowUserButton'
import ProxyImage from './ProxyImage';

const EditProfileSettings = props => {
  if (props.isUser) {
    return (
      <Link
        to="settings"
        className="bttn-style bttn-mini bttn-subtle-gray">
         <i className="ion-gear-a"></i>&nbsp;Edit
      </Link>
    );
  }
  return null;
};

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
                to={`@${this.props.profile.username}/likes`}>
                Followers
              </Link>
            </li>

            <li className="nav-item">
              <Link
                className="nav-link"
                to={`@${this.props.profile.username}/likes`}>
                Is Following
              </Link>
            </li>
         
          </ul>
      </div>
    );
  }

  render() {
    const profile = this.props.profile;
    if (!profile) {
      return null;
    }
    
    const isUser = this.props.currentUser &&
      this.props.profile.userId === this.props.currentUser.uid;

    return (
      <div className="roow roow-row-top page-common profile-page">

        <div className="user-info bottom-divider">

          <div className="profile-info roow roow-col-left">

            <ProxyImage src={profile.image} className="user-img" />
            <div className="user-data roow roow-col-left">
              <div className="user-name">{profile.username}</div>
              <div className="user-bio">{profile.bio}</div>
              <div className="roow roow-row-left profile-followers-wrapper">
                <Link to={`followers/${profile.username}`}>
                  <div className="profile-data-module">{this.props.followerCount} followers</div>
                </Link>
                <Link to={`followings/${profile.username}`}>
                  <div className="profile-data-module">{this.props.followingCount} following</div>
                </Link>
              </div>
              <div className="user-action roow roow-row-top">
                <EditProfileSettings isUser={isUser} />
                
                
                <FollowUserButton
                authenticated={this.props.authenticated}
                isUser={isUser}
                user={profile}
                follow={this.props.followUser}
                unfollow={this.props.unfollowUser}
                isFollowing={this.props.profile.isFollowing}
                />
              </div>

              {this.renderTabs()}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, Actions)(ProfileLikes);