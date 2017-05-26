import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import Firebase from 'firebase';
import * as Actions from '../actions';
import * as Constants from '../constants';
import ItineraryList from './ItineraryList';
import FollowUserButton from './FollowUserButton'
import ProxyImage from './ProxyImage';

const EditProfileSettings = props => {
  if (props.isUser) {
    return (
      <Link
        to="settings"
        className="v-button v-button--light">
         {/*<i className="ion-gear-a"></i>*/}Edit Profile
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
  // ...state.reviewList,
  ...state.profile,
  currentUser: state.common.currentUser,
  authenticated: state.common.authenticated,
  // profile: state.profile
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
    // look up userID from username and load profile
    Firebase.database().ref(Constants.USERNAMES_TO_USERIDS_PATH + '/' + this.props.params.username + '/').once('value', snapshot => {
      if (snapshot.exists()) {
        let userId = snapshot.val().userId;
        this.props.getProfileUser(userId);
        this.props.checkFollowing(userId);
        // this.props.getReviewsByUser(this.props.authenticated, userId);
        this.props.getItinerariesByUser(this.props.authenticated, userId);
        this.props.getFollowingCount(userId);
        this.props.getFollowerCount(userId);
        this.props.sendMixpanelEvent('Profile page loaded');
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

  renderTabs(isUser) {
    if (isUser) {
      return (
        <div className="feed-toggle flx flx-row flx-just-center">
          <ul className="nav nav-pills outline-active">
            <li className="nav-item">
              <Link
                className="nav-link active"
                to={`${this.props.profile.username}`}>
                Itineraries
              </Link>
            </li>

            <li className="nav-item">
              <Link
                className="nav-link"
                to={`${this.props.profile.username}/likes`}>
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
  }

  render() {

    if (!this.props.profile) {
      return null;
    }
    if (!this.props.itineraries) {
      return null;
    }
    if (this.props.itineraries.length === 0) {
      return 'No itineraries created.'
    }

    let profile = this.props.profile;
    profile.isFollowing = this.props.isFollowing;

    const isUser = this.props.currentUser &&
      this.props.profile.userId === this.props.currentUser.uid;

    return (
      <div className="flx flx-col page-common profile-page">

        <div className="user-info bottom-divider">

          <div className="profile-info flx flx-col flx-align-center flx-just-center">

            <ProxyImage src={profile.image} className="user-img" />
            <div className="user-data flx flx-col flx-align-center">
              <div className="user-name">{profile.username}</div>
              <div className="user-bio">{profile.bio}</div>
              {/*}
              <div className="flx flx-row-left profile-followers-wrapper">
                <Link to={`followers/${profile.username}`}>
                  <div className="profile-data-module">{this.props.followerCount} followers</div>
                </Link>
                <Link to={`followings/${profile.username}`}>
                  <div className="profile-data-module">{this.props.followingCount} following</div>
                </Link>
              </div>
            */}
              <div className="user-action flx flx-row-top">
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
        
        <div className="">
     
          <ItineraryList
            itineraries={this.props.itineraries} 
            reviewsCount={this.props.reviewsCount}
            authenticated={this.props.authenticated} 
            like={this.props.likeReview} 
            unLike={this.props.unLikeReview}

            currentPage={this.props.currentPage}
            updateRating={this.props.onUpdateRating}
            onSetPage={this.onSetPage}
            deleteReview={this.props.onDeleteReview}
            showModal={this.props.showModal} />
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, Actions)(Profile);
export { Profile as Profile, mapStateToProps as mapStateToProps };