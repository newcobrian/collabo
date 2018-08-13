import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import Firebase from 'firebase';
import * as Actions from '../actions';
import * as Constants from '../constants';
// import FollowUserButton from './FollowUserButton';
import ProfileInfo from './ProfileInfo';
import ActivityList from './ActivityList';
import ProjectList from './ProjectList';
import InfiniteScroll from 'react-infinite-scroller';

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

    this.scrolledToBottom = () => {
      if (!this.props.isFeedLoading) {
        this.props.watchActivityFeed(this.props.authenticated, this.props.params.orgname, this.props.feedEndValue, Constants.PROFILE_PAGE)
      }
    }

    this.loadUser = username => {
      Firebase.database().ref(Constants.USERNAMES_TO_USERIDS_PATH + '/' + username).on('value', snapshot => {
        if (snapshot.exists()) {
          let userId = snapshot.val().userId;
          this.props.getProfileUser(userId);
          // this.props.watchActivityFeed(this.props.authenticated, this.props.params.orgname, this.props.feedEndValue, Constants.PROFILE_PAGE)
          
          // this.props.checkFollowing(this.props.authenticated, userId);
          // this.props.getItinerariesByUser(this.props.authenticated, userId);
          // this.props.getReviewsByUser(this.props.authenticated, userId);
          // this.props.getProfileCounts(userId);
          this.props.sendMixpanelEvent(Constants.MIXPANEL_PAGE_VIEWED, { 'page name' : 'profile'});
        }
        else {
          this.props.userDoesntExist();
        }
      });
    }
    
    this.unloadUser = (username, userId) => {
      if (this.props.profile) {
        this.props.unloadProfileUser(userId);
        this.props.watchActivityFeed(this.props.authenticated, this.props.params.orgname, Constants.PROFILE_PAGE)
        // this.props.unloadProfileFollowing(this.props.authenticated, userId);
        // this.props.unloadItinerariesByUser(this.props.authenticated, userId);
        // this.props.unloadReviewsByUser(this.props.authenticated, userId);
      }
      Firebase.database().ref(Constants.USERNAMES_TO_USERIDS_PATH + '/' + username).off();
    }
  }

  componentWillMount() {
    this.props.loadOrg(this.props.authenticated, this.props.params.orgname, Constants.PROFILE_PAGE);
    this.props.loadProjectList(this.props.authenticated, this.props.params.orgname, Constants.PROFILE_PAGE)
    this.props.loadThreadCounts(this.props.authenticated, this.props.params.orgname)
    this.props.loadOrgList(this.props.authenticated, Constants.PROFILE_PAGE)
    // look up userID from username and load profile
    this.loadUser(this.props.params.username)
  }

  componentWillUnmount() {
    this.unloadUser(this.props.params.username, this.props.profile.userId);
    this.props.unloadOrgList(this.props.authenticated, Constants.PROFILE_PAGE)
    this.props.unloadThreadCounts(this.props.authenticated, this.props.params.orgname)
    this.props.unloadProjectList(this.props.authenticated, this.props.params.orgname, Constants.PROFILE_PAGE)
    this.props.unloadOrg(Constants.PROFILE_PAGE);

    if (!this.props.authenticated) {
      this.props.setAuthRedirect(this.props.location.pathname);
    }
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
            {/*<li className="nav-item">
              <Link
                className="nav-link active flx flx-col flx-center-all ta-center"
                to={`/${this.props.profile.username}/`}>
                <div className="stats-number">
                  {this.props.numReviews || 0}
                </div>
                Reviews
              </Link>
            </li>*/}

            <li className="nav-item">
              <Link
                className="nav-link flx flx-col flx-center-all ta-center"
                to={`/${this.props.profile.username}/guides`}>
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
    if (this.props.invalidOrgUser) {
      return (
        <div className="error-module flx flx-col flx-center-all ta-center v2-type-body3 color--black">
          <div className="xiao-img-wrapper mrgn-bottom-sm">
            <img className="center-img" src="/img/xiaog.png"/>
          </div>
          <div className="mrgn-bottom-md">You don't have permission to view this org</div>

        </div>
        )
    }
    if (!this.props.profile) {
      return (
        <div className="loading-module flx flx-col flx-center-all v2-type-body3 fill--black">
          <div className="loader-wrapper flx flx-col flx-center-all fill--black">
            <div className="loader-bird"></div>
            <div className="loader">
              <div className="bar1"></div>
              <div className="bar2"></div>
              <div className="bar3"></div>
            </div>
            <div className="v2-type-body2 color--white">Loading user</div>
          </div>
        </div>
        )
    } 
    if (!this.props.profile.username) {
      return (
        <div className="error-module flx flx-col flx-center-all ta-center v2-type-body3 color--black">
          <div className="xiao-img-wrapper mrgn-bottom-sm">
            <img className="center-img" src="/img/xiaog.png"/>
          </div>
          <div className="mrgn-bottom-md">Sorry, we couldn't find this user.</div>
        </div>
        );
    }
    else {
      let profile = this.props.profile;
      profile.isFollowing = this.props.isFollowing;

      const isUser = this.props.currentUser &&
        this.props.profile.userId === this.props.currentUser.uid;

      return (
        <div className="flx flx-col page-common profile-page flx-align-center">
          <ProjectList 
            threadCounts={this.props.threadCounts}
            projectId={this.props.params.pid} />

          <div className="thread-area flx flx-col w-100">
            <ProfileInfo
              authenticated={this.props.authenticated}
              profile={profile}
              signOut={this.props.signOutUser}
              follow={this.props.followUser}
              unfollow={this.props.unfollowUser} />

            <div className="flx flx-row flx-just-center w-100">

            <InfiniteScroll
                  pageStart={0}
                  loadMore={this.scrolledToBottom}
                  hasMore={true}
                  loader={<div className="loader" key={0}>Loading ...</div>} >
            
              <ActivityList feed={this.props.feed} />

            </InfiniteScroll>
              
            </div>
          </div>
          
        </div>
      );
    }
  }
}

export default connect(mapStateToProps, Actions)(Profile);
export { Profile as Profile, mapStateToProps as mapStateToProps };