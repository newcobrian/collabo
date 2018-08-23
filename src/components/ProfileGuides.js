import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import Firebase from 'firebase';
import { Profile, mapStateToProps } from './Profile';
import * as Actions from '../actions';
import * as Constants from '../constants';
import FollowUserButton from './FollowUserButton'
import ProfileInfo from './ProfileInfo'

class ProfileGuides extends Profile {
  componentWillMount() {
    Firebase.database().ref(Constants.USERNAMES_TO_USERIDS_PATH + '/' + this.props.params.username + '/').on('value', snapshot => {
      if (snapshot.exists()) {
        let userId = snapshot.val().userId;
        this.props.getProfileUser(userId);
        this.props.checkFollowing(this.props.authenticated, userId);
        this.props.getProfileCounts(userId);
        this.props.getItinerariesByUser(this.props.authenticated, userId);
      }
      else {
        this.props.userDoesntExist();
      }
    });
    this.props.sendMixpanelEvent(Constants.MIXPANEL_PAGE_VIEWED, { 'page name' : 'likes'});
  }

  componentWillUnmount() {
    if (this.props.profile) {
      this.props.unloadProfileUser(this.props.profile.userId);
      this.props.unloadProfileFollowing(this.props.authenticated, this.props.profile.userId);
      this.props.unloadItinerariesByUser(this.props.authenticated, this.props.profile.userId);

      if (!this.props.authenticated) {
        this.props.setAuthRedirect(this.props.location.pathname);
      }
    }
    Firebase.database().ref(Constants.USERNAMES_TO_USERIDS_PATH + '/' + this.props.params.username + '/').off();
  }

  renderTabs() {
    return (
      <div className="feed-toggle">
          <ul className="nav nav-pills  flx flx-row flx-just-space-around flx-align-space-around outline-active">
            {/*<li className="nav-item">
              <Link
                className="nav-link flx flx-col flx-center-all ta-center"
                to={`/${this.props.profile.username}/`}>
                <div className="stats-number">
                  {this.props.numReviews || 0}
                </div>
                Reviews
              </Link>
            </li>*/}

            <li className="nav-item">
              <Link
                className="nav-link active flx flx-col flx-center-all ta-center"
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
    if (!this.props.itineraries) {
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
    if (this.props.itineraries.length === 0) {
      return (
        <div className="flx flx-col page-common profile-page flx-align-center">
          <div className="w-100 w-max flx flx-row flx-m-col">
            <ProfileInfo
              authenticated={this.props.authenticated}
              profile={this.props.profile}
              follow={this.props.followUser}
              signOut={this.props.signOutUser}
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
          <div className="w-100 w-max flx flx-row flx-m-col">
          <ProfileInfo
            authenticated={this.props.authenticated}
            profile={profile}
            signOut={this.props.signOutUser}
            follow={this.props.followUser}
            unfollow={this.props.unfollowUser} />

            {/**console.log(this.props.currentUser)**/}

          {this.renderTabs()}
          </div>
          <div className="flx flx-row flx-just-center w-100">
       
            
          </div>
        </div>
      );
    }
  }
}

export default connect(mapStateToProps, Actions)(ProfileGuides);