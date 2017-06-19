import { Followers, mapStateToProps } from './Followers';
import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import Firebase from 'firebase';
import * as Actions from '../actions';
import * as Constants from '../constants';

class Followings extends Followers {
  componentWillMount() {
  	Firebase.database().ref(Constants.USERNAMES_TO_USERIDS_PATH + '/' + this.props.params.username + '/').once('value', snapshot => {
      if (snapshot.exists()) {
        let userId = snapshot.val().userId;
        this.props.getFollowers(userId, Constants.IS_FOLLOWING_PATH);
        this.props.getProfileUser(userId);
        this.props.checkFollowing(userId);
      }
    });
    this.props.sendMixpanelEvent('Followings page loaded');
  }

  componentWillUnmount() {
    Firebase.database().ref(Constants.USERNAMES_TO_USERIDS_PATH + '/' + this.props.params.username + '/').once('value', snapshot => {
      if (snapshot.exists()) {
        let userId = snapshot.val().userId;
        this.props.unloadFollowers(userId, Constants.IS_FOLLOWING_PATH);
        this.props.unloadProfileUser(userId);
        this.props.unloadProfileFollowing(userId);
      }
    });
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
              className="nav-link"
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
              className="nav-link active"
              to={`${this.props.profile.username}/isfollowing`}>
              Is Following
            </Link>
          </li>

        </ul>
      </div>
    );
  }
}

export default connect(mapStateToProps, Actions)(Followings);
