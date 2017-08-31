import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import Firebase from 'firebase';
import * as Actions from '../actions';
import * as Constants from '../constants';
import ItineraryList from './ItineraryList';
import FollowUserButton from './FollowUserButton'
import ProfileInfo from './ProfileInfo'

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
  ...state.profile,
  currentUser: state.common.currentUser,
  authenticated: state.common.authenticated,
  userInfo: state.common.userInfo
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
  constructor() {
    super();

    this.loadUser = username => {
      Firebase.database().ref(Constants.USERNAMES_TO_USERIDS_PATH + '/' + username).on('value', snapshot => {
        if (snapshot.exists()) {
          let userId = snapshot.val().userId;
          this.props.getProfileUser(userId);
          this.props.checkFollowing(this.props.authenticated, userId);
          this.props.getItinerariesByUser(this.props.authenticated, userId);
          this.props.getProfileCounts(userId);
          this.props.sendMixpanelEvent('Profile page loaded');
        }
        else {
          this.props.userDoesntExist();
        }
      });
    }
    
    this.unloadUser = (username, userId) => {
      if (this.props.profile) {
        this.props.unloadProfileUser(userId);
        this.props.unloadProfileFollowing(this.props.authenticated, userId);
        this.props.unloadItinerariesByUser(this.props.authenticated, userId);
      }
      Firebase.database().ref(Constants.USERNAMES_TO_USERIDS_PATH + '/' + username).off();
    }
  }

  componentWillMount() {
    // look up userID from username and load profile
    this.loadUser(this.props.params.username)
  }

  componentWillUnmount() {
    this.unloadUser(this.props.params.username, this.props.profile.userId);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.params.username !== this.props.params.username) {
      this.unloadUser(this.props.params.username, this.props.profile.userId);
      this.loadUser(nextProps.params.username);
    }
  }

  renderTabs() {
    return (
      <div className="feed-toggle">
          <ul className="nav nav-pills  flx flx-row flx-just-space-around flx-align-space-around outline-active">
            <li className="nav-item">
              <Link
                className="nav-link active flx flx-col flx-center-all ta-center"
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
                className="nav-link flx flx-col flx-center-all ta-center"
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
    if (!this.props.profile || this.props.profile.length === 0) {
      return (<div className="error-module flx flx-center-all v2-type-body3">This person does not exist.</div>);
    }
    if (!this.props.itineraries || this.props.itineraries.length === 0) {
      return (
        <div className="flx flx-col page-common profile-page flx-align-center">
          <div className="w-100 w-max mrgn-bottom-md flx flx-row flx-m-col">
            <ProfileInfo
              authenticated={this.props.authenticated}
              profile={this.props.profile}
              follow={this.props.followUser}
              unfollow={this.props.unfollowUser} />

            {this.renderTabs()}
          </div>
          <div className="status-module flx flx-row flx-just-center w-100 v2-type-body3">
            <div className="ta-center pdding-all-md">{this.props.profile.username} has not created any guides...yet.</div>
          </div>
        </div>
      )
    }
    else {
      let profile = this.props.profile;
      profile.isFollowing = this.props.isFollowing;

      const isUser = this.props.currentUser &&
        this.props.profile.userId === this.props.currentUser.uid;

      return (
        <div className="flx flx-col page-common profile-page flx-align-center">
          <div className="w-100 w-max mrgn-bottom-md flx flx-row flx-m-col">
          <ProfileInfo
            authenticated={this.props.authenticated}
            profile={profile}
            signOut={this.props.signOutUser}
            follow={this.props.followUser}
            unfollow={this.props.unfollowUser} />


          {this.renderTabs()}
          </div>
          <div className="flx flx-row flx-just-center w-100">
       
            <ItineraryList
              itineraries={this.props.itineraries} 
              authenticated={this.props.authenticated} 
              like={this.props.likeReview} 
              unLike={this.props.unLikeReview}
              deleteItinerary={this.props.showDeleteModal}

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
}

export default connect(mapStateToProps, Actions)(Profile);
export { Profile as Profile, mapStateToProps as mapStateToProps };