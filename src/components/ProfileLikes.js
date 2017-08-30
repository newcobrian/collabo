import { Profile, mapStateToProps } from './Profile';
import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import Firebase from 'firebase';
import * as Actions from '../actions';
import * as Constants from '../constants';
import FollowUserButton from './FollowUserButton'
import ProfileInfo from './ProfileInfo';
import FeedList from './FeedList';
import ItineraryList from './ItineraryList';
import TipList from './TipList';

class ProfileLikes extends Profile {
  componentWillMount() {
    Firebase.database().ref(Constants.USERNAMES_TO_USERIDS_PATH + '/' + this.props.params.username + '/').on('value', snapshot => {
      if (snapshot.exists()) {
        let userId = snapshot.val().userId;
        this.props.getProfileUser(userId);
        this.props.checkFollowing(userId);
        this.props.getProfileCounts(userId);
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
    Firebase.database().ref(Constants.USERNAMES_TO_USERIDS_PATH + '/' + this.props.params.username + '/').off();
  }

  onSetPage(page) {
  	// const promise = agent.Articles.favoritedBy(this.props.profile.username, page);
  	// this.props.onSetPage(page, promise);
  }

  renderTabs() {
    return (
      <div className="feed-toggle flx flx-row flx-just-center w-100 w-max">
        <ul className="nav nav-pills outline-active">
            <li className="nav-item">
              <Link
                className="nav-link"
                to={`/${this.props.profile.username}`}>
                {this.props.numGuides} Guides
              </Link>
            </li>

            <li className="nav-item">
              <Link
                className="nav-link active"
                to={`/${this.props.profile.username}/likes`}>
                {this.props.numLikes} Likes
              </Link>
            </li>

            <li className="nav-item">
              <Link
                className="nav-link"
                to={`/${this.props.profile.username}/followers`}>
                {this.props.numFollowers} Followers
              </Link>
            </li>

            <li className="nav-item">
              <Link
                className="nav-link"
                to={`/${this.props.profile.username}/isfollowing`}>
                Following {this.props.numFollowing}
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
      return (<div className="error-module flx flx-center-all v2-type-body3">User does not exist.</div>);
    }
    // if (!this.props.feed) {
    //   return null;
    // }
    // if (!this.props.guideFeed) {
    //   return null;
    // }
    // if (this.props.guideFeed.length === 0) {
    //   return (
    //     <div className="flx flx-col page-common profile-page flx-align-center">
    //       <ProfileInfo
    //         authenticated={this.props.authenticated}
    //         profile={this.props.profile}
    //         follow={this.props.followUser}
    //         unfollow={this.props.unfollowUser} />

    //       {this.renderTabs()}
          
    //       <div className="status-module flx flx-row flx-just-center w-100 v2-type-body3">
    //         <div>{this.props.profile.username} has not liked anything yet.</div>
    //       </div>
    //     </div>
    //   )
    // }

    const profile = this.props.profile;
    profile.isFollowing = this.props.isFollowing;
    const isUser = this.props.currentUser &&
      this.props.profile.userId === this.props.currentUser.uid;

    const handleGuidesClick = ev => {
      ev.preventDefault();
      this.props.onLikesTabClick('guide')
    }

    const handleTipsClick = ev => {
      ev.preventDefault(); 
      this.props.onLikesTabClick('tip')
    }

    const renderLikesTabs = () => {
      return (
        <div className="feed-toggle flx flx-row flx-just-center w-100 w-max">
          <ul className="nav nav-pills outline-active">
            <li className="nav-item">
              <Link
                className="nav-link"
                onClick={handleGuidesClick}>
                Guides
              </Link>
            </li>

            <li className="nav-item">
              <Link
                className="nav-link"
                onClick={handleTipsClick}>
                Tips
              </Link>
            </li>
          </ul>
      </div>
      )
    }

    const renderLikes = () => {
      if (!this.props.tipTabActive) {
        return (
          <div className="flx flx-row flx-just-center w-100">
            <ItineraryList
              itineraries={this.props.guideFeed} 
              authenticated={this.props.authenticated} 
              like={this.props.likeReview} 
              unLike={this.props.unLikeReview}
              deleteItinerary={this.props.showDeleteModal} />
          </div>
        )
      }
      else {
        return (
          <div className="flx flx-row flx-just-center w-100">
            <TipList
              tipList={this.props.tipFeed} 
              authenticated={this.props.authenticated}
              like={this.props.likeReview} 
              unLike={this.props.unLikeReview}
              userInfo={this.props.userInfo}
              showModal={this.props.showModal}
              deleteComment={this.props.onDeleteComment}
              itineraryId={this.props.itineraryId}
              itinerary={this.props.itinerary} />
          </div>
        )
      }
    }

    return (
      <div className="flx flx-col page-common profile-page flx-align-center">

        <ProfileInfo
          authenticated={this.props.authenticated}
          profile={profile}
          follow={this.props.followUser}
          unfollow={this.props.unfollowUser} />

        {this.renderTabs()}
        {renderLikesTabs()}
        <div className="flx flx-row flx-just-center w-100 w-max">
     
          {renderLikes()}
          {/*<FeedList
            feed={this.props.feed} 
            authenticated={this.props.authenticated} 
            userInfo={this.props.userInfo}
            like={this.props.likeReview} 
            unLike={this.props.unLikeReview}
            showModal={this.props.showModal}
            deleteItinerary={this.props.showDeleteModal}
            deleteComment={this.props.onDeleteComment}
          />*/}
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, Actions)(ProfileLikes);