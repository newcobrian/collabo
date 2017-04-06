import { Profile, mapStateToProps } from './Profile';
import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import Firebase from 'firebase';
import * as Actions from '../actions';
import * as Constants from '../constants';

class ProfileSaves extends Profile {
  componentWillMount() {
    Firebase.database().ref(Constants.USERNAMES_TO_USERIDS_PATH + '/' + this.props.params.username + '/').once('value', snapshot => {
      if (snapshot.exists()) {
        let userId = snapshot.val().userId;
        this.props.getProfileUser(userId);
        this.props.checkFollowing(userId);
        this.props.getFollowingCount(userId);
        this.props.getFollowerCount(userId);
        this.props.getLikesOrSavesByUser(this.props.authenticated, userId, Constants.SAVES_BY_USER_PATH);
      }
    });
    this.props.sendMixpanelEvent('Saves page loaded');
  }

  componentWillUnmount() {
    if (this.props.profile) {
      this.props.unloadProfileUser(this.props.profile.userId);
      this.props.unloadProfileFollowing(this.props.profile.userId);
      this.props.unloadLikesOrSavesByUser(this.props.profile.userId, Constants.SAVES_BY_USER_PATH);
    }
  }

  renderTabs() {
    return (
      <div className="feed-toggle roow roow-row-center">
          <ul className="nav nav-pills outline-active">
            <li className="nav-item">
              <Link
                className="nav-link"
                to={`@${this.props.profile.username}`}>
                My Posts
              </Link>
            </li>

            <li className="nav-item">
              <Link
                className="nav-link"
                to={`@${this.props.profile.username}/likes`}>
                My Likes
              </Link>
            </li>

          </ul>
      </div>
    );
  }
}

export default connect(mapStateToProps, Actions)(ProfileSaves);