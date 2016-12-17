'use strict';

import ArticleList from './ArticleList';
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
  if (props.user.following) {
  // if (props.isFollowing) {
    classes += ' btn-secondary';
  } else {
    classes += ' btn-outline-secondary';
  }

  const handleClick = ev => {
    ev.preventDefault();
    if (props.user.following) {
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
      {props.user.following ? 'Unfollow' : 'Follow'} {props.user.username}
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
      let userId = snapshot.val().userid;
      this.props.getUser(userId);
      // this.props.isFollowing(userId);
    });
    // this.props.getUser(userId);
  }

  componentWillUnmount() {
    this.props.onUnload();
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

        <li className="nav-item">
          <Link
            className="nav-link"
            to={`@${this.props.profile.username}/favorites`}>
            Favorited Articles
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
      <div className="profile-page">

        <div className="user-info">
          <div className="container">
            <div className="row">
              <div className="col-xs-12 col-md-10 offset-md-1">

                <img src={profile.image} className="user-img" />
                <h4>{profile.username}</h4>
                <p>{profile.bio}</p>

                <EditProfileSettings isUser={isUser} />
                <FollowUserButton
                  isUser={isUser}
                  user={profile}
                  follow={this.props.followUser}
                  unfollow={this.props.onUnfollow}
                  profileUserId={this.props.profile.userId}
                  isFollowing={this.props.isFollowing}
                  />

              </div>
            </div>
          </div>
        </div>

        <div className="container">
          <div className="row">

            <div className="col-xs-12 col-md-10 offset-md-1">

              <div className="articles-toggle">
                {this.renderTabs()}
              </div>

              <ArticleList
                articles={this.props.articles} 
                articlesCount={this.props.articlesCount}
                currentPage={this.props.currentPage}
                onSetPage={this.onSetPage} />
            </div>

          </div>
        </div>

      </div>
    );
  }
}

// export default connect(mapStateToProps, mapDispatchToProps)(Profile);
export default connect(mapStateToProps, Actions)(Profile);
export { Profile as Profile, mapStateToProps as mapStateToProps };