'use strict';

import ReviewList from './ReviewList';
import React from 'react';
import { Link } from 'react-router';
import agent from '../agent';
import { connect } from 'react-redux';
import Firebase from 'firebase';
import * as Actions from '../actions';
import * as Constants from '../constants';

const EditProfileSettings = props => {
  if (props.isUser) {
    return (
      <Link
        to="settings"
        className="btn btn-sm btn-outline-secondary action-btn">
        <i className="ion-gear-a"></i> Edit Profile Settings
      </Link>
    );
  }
  return null;
};

const FollowUserButton = props => {
  if (props.isUser) {
    return null;
  }
  let classes = 'btn btn-sm action-btn';
  // if (props.user.following) {
  if (props.user.isFollowing) {
    classes += ' btn-secondary';
  } else {
    classes += ' btn-outline-secondary';
  }

  const handleClick = ev => {
    ev.preventDefault();
    // if (props.user.following) {
    if (props.user.isFollowing) {
      // props.unfollow(props.user.username)
      props.unfollow(props.user.userId);
    } else {
      // props.follow(props.user.username)
      props.follow(props.user.userId);
    }
  };

  return (
    <button
      className={classes}
      onClick={handleClick}>
      <i className="ion-plus-round"></i>
      &nbsp;
      {props.user.isFollowing ? 'Unfollow' : 'Follow'} {props.user.username}
    </button>
  );
};

const mapStateToProps = state => ({
  ...state.articleList,
  currentUser: state.common.currentUser,
  profile: state.profile
});

// const mapDispatchToProps = dispatch => ({
//   onFollow: username => dispatch({
//     type: 'FOLLOW_USER',
//     payload: agent.Profile.follow(username)
//   }),
//   onLoad: payload => dispatch({ type: 'PROFILE_PAGE_LOADED', payload }),
//   onSetPage: (page, payload) => dispatch({ type: 'SET_PAGE', page, payload }),
//   onUnfollow: username => dispatch({
//     type: 'UNFOLLOW_USER',
//     payload: agent.Profile.unfollow(username)
//   }),
//   onUnload: () => dispatch({ type: 'PROFILE_PAGE_UNLOADED' }),
//   onGetUser: (userid, payload) => dispatch({ type: 'GET_USER', userid, payload })
// });

class Profile extends React.Component {
  componentWillMount() {
    // this.props.onLoad(Promise.all([
    //   agent.Profile.get(this.props.params.username),
    //   agent.Articles.byAuthor(this.props.params.username)
    // ]));

    // look up userID from username and load profile
    Firebase.database().ref(Constants.USERNAMES_TO_USERIDS_PATH + '/' + this.props.params.username + '/').once('value', snapshot => {
      let userId = snapshot.val().userId;
      this.props.getProfileUser(userId);
      this.props.checkFollowing(userId);
      this.props.getReviewsByUser(userId);
      this.props.getFollowingCount(userId);
      this.props.getFollowerCount(userId);
    });
    // this.props.getUser(userId);
  }

  componentWillUnmount() {
    this.props.unloadProfileUser(this.props.profile.userId);
    this.props.unloadProfileFollowing(this.props.profile.userId);
    this.props.unloadReviewsByUser(this.props.profile.userId);
  }

  onSetPage(page) {
    const promise = agent.Articles.byAuthor(this.props.profile.username, page);
    this.props.onSetPage(page, promise);
  }

  renderTabs() {
    return (
      <ul className="nav nav-pills outline-active">
        <li className="nav-item">
          <Link
            className="nav-link active"
            to={`@${this.props.profile.username}`}>
            My Articles
          </Link>
        </li>
      </ul>
    );
  }

  render() {
    const profile = this.props.profile;
    if (!profile) {
      return null;
    }
    // const isUser = this.props.currentUser &&
    //   this.props.profile.username === this.props.currentUser.username;

    const isUser = this.props.currentUser &&
      this.props.profile.userId === this.props.currentUser.uid;

    return (
      <div className="roow roow-col-left page-common profile-page">

        <div className="user-info roow roow-row-left">
          <div className="profile-info roow roow-row-left">

            <img src={profile.image} className="user-img" />
            <div className="user-data roow roow-col-left">
              <div className="user-name">{profile.username}</div>
              <div className="user-bio">{profile.bio}</div>
              <div>{profile.followerCount} followers</div>
              <div>{profile.followingCount} following</div>
              <div>Link to Likes</div>
              <div className="user-action">
                <EditProfileSettings isUser={isUser} />
                <FollowUserButton
                isUser={isUser}
                user={profile}
                follow={this.props.followUser}
                unfollow={this.props.unfollowUser}
                profileUserId={this.props.profile.userId}
                isFollowing={this.props.profile.isFollowing}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="roow roow-col-left">

          <div className="page-title-wrapper">
            <div className="text-page-title">
              {this.renderTabs()}
            </div>
          </div>






          <ReviewList
            reviews={profile.reviews} 
            reviewsCount={this.props.reviewsCount}
            currentPage={this.props.currentPage}
            onSetPage={this.onSetPage} />
        </div>
      </div>
    );
  }
}

// export default connect(mapStateToProps, mapDispatchToProps)(Profile);
export default connect(mapStateToProps, Actions)(Profile);
export { Profile as Profile, mapStateToProps as mapStateToProps };