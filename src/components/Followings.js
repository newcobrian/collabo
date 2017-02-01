import { Followers, mapStateToProps } from './Followers';
import React from 'react';
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
      }
    });
  }

  componentWillUnmount() {
    Firebase.database().ref(Constants.USERNAMES_TO_USERIDS_PATH + '/' + this.props.params.username + '/').once('value', snapshot => {
      if (snapshot.exists()) {
        let userId = snapshot.val().userId;
        this.props.unloadFollowers(userId, Constants.IS_FOLLOWING_PATH);
      }
    });
  }
}

export default connect(mapStateToProps, Actions)(Followings);
