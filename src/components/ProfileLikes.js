import { Profile, mapStateToProps } from './Profile';
import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import Firebase from 'firebase';
import * as Actions from '../actions';
import * as Constants from '../constants';
import FollowUserButton from './FollowUserButton'

// const mapDispatchToProps = dispatch => ({
//   onFollow: username => dispatch({
//     type: 'FOLLOW_USER',
//     payload: agent.Profile.follow(username)
//   }),
//   onLoad: (payload) =>
//     dispatch({ type: 'PROFILE_FAVORITES_PAGE_LOADED', payload }),
//   onSetPage: (page, payload) => dispatch({ type: 'SET_PAGE', page, payload }),
//   onUnfollow: username => dispatch({
//     type: 'UNFOLLOW_USER',
//     payload: agent.Profile.unfollow(username)
//   }),
//   onUnload: () =>
//     dispatch({ type: 'PROFILE_FAVORITES_PAGE_UNLOADED' })
// });

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
  }

  componentWillUnmount() {
    if (this.props.profile) {
      this.props.unloadProfileUser(this.props.profile.userId);
      this.props.unloadProfileFollowing(this.props.profile.userId);
      this.props.unloadReviewsByUser(this.props.profile.userId);
    }
  }

  onSetPage(page) {
  	// const promise = agent.Articles.favoritedBy(this.props.profile.username, page);
  	// this.props.onSetPage(page, promise);
  }

  renderTabs() {
    return (
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
            className="nav-link active"
            to={`@${this.props.profile.username}/favorites`}>
            My Likes
          </Link>
        </li>
      </ul>
    );
  }
}

export default connect(mapStateToProps, Actions)(ProfileLikes);