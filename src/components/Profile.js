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
import OrgHeader from './OrgHeader';
import Sidebar from 'react-sidebar';
import InvalidOrg from './InvalidOrg';

const mql = window.matchMedia(`(min-width: 800px)`);

const EditProfileSettings = props => {
  if (props.isUser) {
    return (
      <Link
        to={'/' + props.orgName + '/user/' + props.username + '/settings'}
        className="flx flx-align-center mrgn-right-sm">
        <div className="color--black co-type-label">Edit Profile</div>
      </Link>
    );
  }
  return null;
};

const SignOutButton = props => {
  if (props.isUser) {
    return (
      <Link
        className="flx flx-align-center mrgn-left-sm"
        onClick={props.signOut}>
        <div className="color--black co-type-label">Log out</div>
      </Link>
    )
  }
  return null;
}

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
  sidebarOpen: state.common.sidebarOpen,
  invalidOrgUser: state.common.invalidOrgUser
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
        let userId = this.props.profile ? this.props.profile.userId : null
        this.props.watchActivityFeed(userId, this.props.orgId, this.props.feedEndValue, Constants.PROFILE_PAGE)
      }
    }

    this.loadUser = (username, orgName) => {
      let lowerCaseOrgName = orgName ? orgName.toLowerCase() : ''
      Firebase.database().ref(Constants.ORGS_BY_NAME_PATH + '/' + lowerCaseOrgName).once('value', orgSnap => {
        if (orgSnap.exists()) {
          let lowerCaseUserName = username ? username.toLowerCase() : ''
          Firebase.database().ref(Constants.USERNAMES_BY_ORG_PATH + '/' + orgSnap.val().orgId + '/' + lowerCaseUserName).on('value', snapshot => {
            if (snapshot.exists()) {
              let userId = snapshot.val();
              this.props.getProfileUser(userId, orgSnap.val().orgId);
              this.props.watchActivityFeed(this.props.authenticated, orgSnap.val().orgId, this.props.feedEndValue, Constants.PROFILE_PAGE)
            }
            else {
              console.log('else')
              this.props.userDoesntExist();
            }
          })
        }
      });
    }
    
    this.unloadUser = (username, userId, orgId) => {
      if (this.props.profile && userId) {
        this.props.unloadProfileUser(userId, orgId);
        this.props.unwatchActivityFeed(this.props.authenticated, orgId, Constants.PROFILE_PAGE)
        // this.props.unloadProfileFollowing(this.props.authenticated, userId);
        // this.props.unloadItinerariesByUser(this.props.authenticated, userId);
        // this.props.unloadReviewsByUser(this.props.authenticated, userId);
      }
      Firebase.database().ref(Constants.USERNAMES_TO_USERIDS_PATH + '/' + username).off();
    }

    this.mediaQueryChanged = () => {
      this.props.setSidebar(mql.matches);
    }
  }

  componentDidMount() {
    this.props.loadSidebar(mql);
    mql.addListener(this.mediaQueryChanged);

    let lowerCaseOrgName = this.props.params.orgname ? this.props.params.orgname.toLowerCase() : ''
    Firebase.database().ref(Constants.ORGS_BY_NAME_PATH + '/' + lowerCaseOrgName).once('value', orgSnap => {
      if (!orgSnap.exists()) {
        this.props.notAnOrgUserError(Constants.PROFILE_PAGE)
      }
      else {
        let orgId = orgSnap.val().orgId
        this.props.loadOrg(this.props.authenticated, orgId, this.props.params.orgname, Constants.PROFILE_PAGE);
        this.props.loadOrgUser(this.props.authenticated, orgId, Constants.PROFILE_PAGE)
        this.props.loadProjectList(this.props.authenticated, orgId, Constants.PROFILE_PAGE)
        this.props.loadThreadCounts(this.props.authenticated, orgId)
        this.props.loadProjectNames(orgId, Constants.PROFILE_PAGE)
        this.props.loadOrgList(this.props.authenticated, Constants.PROFILE_PAGE)
      }
    })
    // look up userID from username and load profile
    this.loadUser(this.props.params.username, this.props.params.orgname)

    this.props.sendMixpanelEvent(Constants.MIXPANEL_PAGE_VIEWED, { 'page name' : 'profile'});
  }

  componentWillUnmount() {
    if (this.props.userId) {
      this.unloadUser(this.props.params.username, this.props.profile.userId, this.props.orgId);
    }
    if (this.props.orgId) {
      this.props.unloadProjectNames(this.props.orgId, Constants.PROFILE_PAGE)
      this.props.unloadOrgList(this.props.authenticated, Constants.PROFILE_PAGE)
      this.props.unloadThreadCounts(this.props.authenticated, this.props.orgId)
      this.props.unloadProjectList(this.props.authenticated, this.props.orgId, Constants.PROFILE_PAGE)
      this.props.unloadOrgUser(this.props.authenticated, this.props.orgId, Constants.PROFILE_PAGE)
      this.props.unloadOrg(Constants.PROFILE_PAGE);
    }

    if (!this.props.authenticated) {
      this.props.setAuthRedirect(this.props.location.pathname);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.params.username !== this.props.params.username) {
      let orgName = nextProps.params.orgname ? nextProps.params.orgname : this.props.params.orgname
      this.unloadUser(this.props.params.username, this.props.profile.userId, this.props.orgId);
      this.loadUser(nextProps.params.username, orgName);
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
        <div className="error-page flx flx-col flx-center-all ta-center co-type-body">
          <div className="co-logo mrgn-top-md mrgn-bottom-md">
              <img className="center-img" src="/img/logomark.png"/>
            </div>
          <div className="mrgn-bottom-md co-type-body color--white">Sorry, we couldn't find this user.</div>
        </div>
      );
    }
    if (this.props.invalidOrgUser) {
      return (
        <InvalidOrg/>
        )
    }
    if (!this.props.profile) {
      return (
        <div className="threadlist threadlist-loading header-push w-100 flx flx-col flx-center-all ta-center h-100 fill--white color--primary">
        <div className="loading-koi mrgn-bottom-md">
          <img className="center-img" src="/img/logomark.png"/>
        </div>
        <div className="w-100 ta-center co-type-body">Loading user profile...</div>
      </div>
        )
    } 
    if (!this.props.profile.username) {
      return (
        <div className="error-page flx flx-col flx-center-all ta-center co-type-body">
          <div className="co-logo mrgn-top-md mrgn-bottom-md">
              <img className="center-img" src="/img/logomark.png"/>
            </div>
          <div className="mrgn-bottom-md co-type-body color--white">Sorry, we couldn't find this user.</div>
        </div>
        );
    }
    else {
      let profile = this.props.profile;
      profile.isFollowing = this.props.isFollowing;

      const isUser = this.props.currentUser &&
        this.props.profile.userId === this.props.currentUser.uid;

      return (
        <div>
          <Sidebar
            sidebar={<ProjectList />}
            open={this.props.sidebarOpen}
            onSetOpen={mql.matches ? this.props.setSidebarOpen : () => this.props.setSidebar(!this.props.sidebarOpen)}
            styles={{ sidebar: {
                  borderRight: "1px solid rgba(0,0,0,.1)",
                  boxShadow: "none",
                  zIndex: "100"
                },
                overlay: mql.matches ? {
                  backgroundColor: "rgba(255,255,255,1)"
                } : {
                  zIndex: 12,
                  backgroundColor: "rgba(0, 0, 0, 0.5)"
                },
              }}
            >
              <div className={this.props.sidebarOpen ? 'open-style' : 'closed-style'}>
                <div className="page-common page-profile flx flx-col flx-align-center profile-page">
                
                  <div className="project-header text-left flx flx-col flx-align-start w-100">
                    <OrgHeader />
                  </div>

                  <div className="koi-view threadlist header-push ta-left flx flx-col w-100">

                    


                    <ProfileInfo
                      authenticated={this.props.authenticated}
                      profile={profile}
                      signOut={this.props.signOutUser}
                      follow={this.props.followUser}
                      unfollow={this.props.unfollowUser} />


                    <div className="flx flx-row flx-center-all w-100 brdr-bottom mrgn-bottom-lg pdding-bottom-lg">
                      
                        <EditProfileSettings 
                          isUser={isUser} 
                          orgName={this.props.params.orgname} 
                          username={this.props.params.username}/>
                        <SignOutButton isUser={isUser} signOut={this.props.signOutUser}/>

                    </div>

                    <div className="flx flx-row flx-just-center w-100">

                    <InfiniteScroll
                          pageStart={0}
                          className="w-100"
                          loadMore={this.scrolledToBottom}
                          hasMore={true}
                          loader={<div className="loader" key={0}>Loading ...</div>} >
                    
                      <ActivityList feed={this.props.feed} orgName={this.props.params.orgname} emptyActivityFeed={this.props.emptyActivityFeed} profile={this.props.profile} />

                    </InfiniteScroll>
                      
                    </div>
                  </div>
                  
                </div>
              </div>
          </Sidebar>
        </div>
      );
    }
  }
}

export default connect(mapStateToProps, Actions)(Profile);
export { Profile as Profile, mapStateToProps as mapStateToProps };