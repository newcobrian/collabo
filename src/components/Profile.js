import ReviewList from './ReviewList';
import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import Firebase from 'firebase';
import * as Actions from '../actions';
import * as Constants from '../constants';
import FollowUserButton from './FollowUserButton'

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

const LogoutButton = props => {
  if (props.isUser && props.authenticated) {
    return (
      <div>
        <button
          className="bttn-style bttn-mini bttn-subtle-gray"
          onClick={props.onLogoutClick}>
          Logout
        </button>
      </div>
    )
  }
  return null;
}

const mapStateToProps = state => ({
  ...state.reviewList,
  currentUser: state.common.currentUser,
  authenticated: state.common.authenticated,
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
      if (snapshot.exists()) {
        let userId = snapshot.val().userId;
        this.props.getProfileUser(userId);
        this.props.checkFollowing(userId);
        this.props.getReviewsByUser(this.props.authenticated, userId);
        this.props.getFollowingCount(userId);
        this.props.getFollowerCount(userId);
      }
    });
    // this.props.getUser(userId);
  }

  componentWillUnmount() {
    if (this.props.profile) {
      this.props.unloadProfileUser(this.props.profile.userId);
      this.props.unloadProfileFollowing(this.props.profile.userId);
      this.props.unloadReviewsByUser(this.props.profile.userId);
    }
  }

  // onSetPage(page) {
  //   // const promise = agent.Articles.byAuthor(this.props.profile.username, page);
  //   this.props.onSetPage(page, promise);
  // }

  renderTabs(isUser) {
    if (isUser) {
      return (
        <div className="feed-toggle roow roow-row-center">
          <ul className="nav nav-pills outline-active">
            <li className="nav-item">
              <Link
                className="nav-link active"
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

            <li className="nav-item">
              <Link
                className="nav-link"
                to={`@${this.props.profile.username}/saves`}>
                My Saves
              </Link>
            </li>
          </ul>
        </div>
      );
    }
  }

  render() {
    const profile = this.props.profile;
    if (!profile.userId) {
      return (
        <div> User does not exist </div>
      );
    }

    const isUser = this.props.currentUser &&
      this.props.profile.userId === this.props.currentUser.uid;

    return (
      <div className="roow roow-row-top page-common profile-page">

        <div className="user-info bottom-divider">

          <div className="profile-info roow roow-col-left">

            <img src={profile.image} className="user-img" />
            <div className="user-data roow roow-col-left">
              <div className="user-name">{profile.username}</div>
              <div className="user-bio">{profile.bio}</div>
              <div className="roow roow-row-left profile-followers-wrapper">
                <Link to={`followers/${profile.username}`}>
                  <div className="profile-data-module">{profile.followerCount} followers</div>
                </Link>
                <Link to={`followings/${profile.username}`}>
                  <div className="profile-data-module">{profile.followingCount} following</div>
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
            </div>
          </div>
        </div>


        {this.renderTabs(isUser)}
        
        <div className="profile-feed">
     
          <ReviewList
            reviews={profile.reviews} 
            reviewsCount={this.props.reviewsCount}
            authenticated={this.props.authenticated} 
            like={this.props.likeReview} 
            unLike={this.props.unLikeReview}
            save={this.props.saveReview} 
            unSave={this.props.unSaveReview}
            currentPage={this.props.currentPage}
            updateRating={this.props.onUpdateRating}
            onSetPage={this.onSetPage} />
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, Actions)(Profile);
export { Profile as Profile, mapStateToProps as mapStateToProps };