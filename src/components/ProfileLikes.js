import { Profile, mapStateToProps } from './Profile';
import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import Firebase from 'firebase';
import * as Actions from '../actions';
import * as Constants from '../constants';
import FollowUserButton from './FollowUserButton'
import ProxyImage from './ProxyImage';
import ProfileInfo from './ProfileInfo';
import FeedList from './FeedList';

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
    this.props.sendMixpanelEvent('Likes page loaded');
  }

  componentWillUnmount() {
    if (this.props.profile) {
      this.props.unloadProfileUser(this.props.profile.userId);
      this.props.unloadProfileFollowing(this.props.profile.userId);
      this.props.unloadLikesByUser(this.props.authenticated, this.props.profile.userId);
    }
  }

  onSetPage(page) {
  	// const promise = agent.Articles.favoritedBy(this.props.profile.username, page);
  	// this.props.onSetPage(page, promise);
  }

  renderTabs() {
    return (
      <div className="feed-toggle flx flx-row flx-just-start w-100 w-max">
        <ul className="nav nav-pills outline-active">
            <li className="nav-item">
              <Link
                className="nav-link"
                to={`${this.props.profile.username}`}>
                Itineraries
              </Link>
            </li>

            <li className="nav-item">
              <Link
                className="nav-link active"
                to={`${this.props.profile.username}/likes`}>
                Likes
              </Link>
            </li>

            <li className="nav-item">
              <Link
                className="nav-link"
                to={`${this.props.profile.username}/followers`}>
                Followers
              </Link>
            </li>

            <li className="nav-item">
              <Link
                className="nav-link"
                to={`${this.props.profile.username}/isfollowing`}>
                Is Following
              </Link>
            </li>
         
          </ul>
      </div>
    );
  }

  render() {
    if (!this.props.profile) {
      return null;
    }
    if (this.props.profile.length === 0) {
      return (<div>User does not exist.</div>);
    }
    if (!this.props.feed) {
      return null;
    }
    if (this.props.feed.length === 0) {
      return (
        <div className="flx flx-col page-common profile-page flx-align-center">
          <ProfileInfo
            authenticated={this.props.authenticated}
            profile={this.props.profile}
            follow={this.props.followUser}
            unfollow={this.props.unfollowUser} />

          {this.renderTabs()}
          
          <div className="flx flx-row flx-just-center w-100">
            <div>{this.props.profile.username} has not liked anything yet.</div>
          </div>
        </div>
      )
    }

    const profile = this.props.profile;
    profile.isFollowing = this.props.isFollowing;
    const isUser = this.props.currentUser &&
      this.props.profile.userId === this.props.currentUser.uid;

    return (
      <div className="flx flx-col page-common profile-page flx-align-center">

        <ProfileInfo
          authenticated={this.props.authenticated}
          profile={profile}
          follow={this.props.followUser}
          unfollow={this.props.unfollowUser} />

        {this.renderTabs()}
        <div className="flx flx-row flx-just-center w-100 w-max">
     
          <FeedList
            feed={this.props.feed} 
            authenticated={this.props.authenticated} 
            userInfo={this.props.userInfo}
            like={this.props.likeReview} 
            unLike={this.props.unLikeReview}
            showModal={this.props.showModal}
            deleteItinerary={this.props.showDeleteModal}
            deleteComment={this.props.onDeleteComment}
          />
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, Actions)(ProfileLikes);