import { Followers, mapStateToProps } from './Followers';
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
}

export default connect(mapStateToProps, Actions)(Followings);
