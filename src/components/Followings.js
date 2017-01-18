import { Followers, mapStateToProps } from './Followers';
import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import Firebase from 'firebase';
import * as Actions from '../actions';
import * as Constants from '../constants';
import FollowUserButton from './FollowUserButton';

class Followings extends Followers {
  componentWillMount() {
  	Firebase.database().ref(Constants.USERNAMES_TO_USERIDS_PATH + '/' + this.props.params.username + '/').once('value', snapshot => {
      if (snapshot.exists()) {
        let userId = snapshot.val().userId;
        this.props.getFollowers(userId, Constants.FOLLOWINGS_PATH);
      }
    });
  }

  componentWillUnmount() {
    Firebase.database().ref(Constants.USERNAMES_TO_USERIDS_PATH + '/' + this.props.params.username + '/').once('value', snapshot => {
      if (snapshot.exists()) {
        let userId = snapshot.val().userId;
        this.props.unloadFollowers(userId, Constants.FOLLOWINGS_PATH);
      }
    });
  }
}

export default connect(mapStateToProps, Actions)(Followings);
