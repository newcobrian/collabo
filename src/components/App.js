import Header from './Header';
import React from 'react';
import agent from '../agent';
import { connect } from 'react-redux';
import Firebase from 'firebase';
import * as Actions from '../actions';
import mixpanel from 'mixpanel-browser';
import RootModal from './Modal';
import SnackbarToaster from './SnackbarToaster';
import LightboxComponent from './LightboxComponent';

const mapStateToProps = state => ({
  appLoaded: state.common.appLoaded,
  appName: state.common.appName,
  currentUser: state.common.currentUser,
  userInfo: state.common.userInfo,
  unreadMessages: state.common.unreadMessages,
  redirectTo: state.common.redirectTo,
  snackbarToaster: state.common.snackbarToaster
});

// const mapDispatchToProps = dispatch => ({
//   onLoad: (payload, authenticated) =>
//     dispatch({ type: 'APP_LOAD', payload, authenticated }),
//   onRedirect: () =>
//     dispatch({ type: 'REDIRECT' })
// });


// const verifyAuth = () => {
//  return function (dispatch) {
//      Firebase.auth().onAuthStateChanged(user => {
//        if (user) {
//          dispatch({ type: 'LOGIN' });
//        } else {
//          dispatch({ type: 'LOGOUT' });
//        }
//      }); 
//   }
// };

class App extends React.Component {
  componentWillMount() {
    const token = window.localStorage.getItem('jwt');
    if (token) {
      agent.setToken(token);
    }

    Firebase.auth().onAuthStateChanged(user => {
      if (user) {
        // if (user.isAnonymous) {
        //   this.props.onLoad(user, false)
        // }
        // else {
        //   this.props.onLoad(user, user.uid);
        // }
        mixpanel.identify(user.uid);
        this.props.onLoad(user);
        this.props.getInboxCount(user.uid);
        this.props.sendMixpanelEvent('App loaded');
      } 
      else {
        // Firebase.auth().signInAnonymously().catch(function(error) {
        //   console.log('anonymous login failed with error.code = ' + error.code + ' and message ' + error.message);
        // })
        this.props.onLoad(null, false);
      }
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.redirectTo) {
      this.context.router.replace(nextProps.redirectTo);
      this.props.onRedirect();
    }
  }

  render() {
    if (this.props.appLoaded) {
      return (
        <div>
          <Header
            appName={this.props.appName}
            currentUser={this.props.currentUser}
            userInfo={this.props.userInfo} 
            unreadMessages={this.props.unreadMessages} />
          {this.props.children}
          <RootModal/>
          <SnackbarToaster 
            {...this.props.snackbarToaster}
            duration={4000} 
            onRequestClose={this.props.closeSnackbar} />
            <LightboxComponent/>
        </div>
      );
    }
    return (
      <div>
        <Header
          appName={this.props.appName}
          currentUser={this.props.currentUser}
          userInfo={this.props.userInfo} />
      </div>
    );
  }
}

App.contextTypes = {
  router: React.PropTypes.object.isRequired
};

export default connect(mapStateToProps, Actions)(App);