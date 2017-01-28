import Header from './Header';
import React from 'react';
import agent from '../agent';
import { connect } from 'react-redux';
import Firebase from 'firebase';
import * as Actions from '../actions';

const mapStateToProps = state => ({
  appLoaded: state.common.appLoaded,
  appName: state.common.appName,
  currentUser: state.common.currentUser,
  userInfo: state.common.userInfo,
  unreadMessages: state.common.unreadMessages,
  redirectTo: state.common.redirectTo
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
        // console.log('user = ' + JSON.stringify(user));
        // console.log('app.js: agent auth current = ' + JSON.stringify(agent.Auth.current()));
        this.props.onLoad(user, user.uid);
        this.props.getAppUser(user.uid);
        this.props.getInboxCount(user.uid);
      } else {
        this.props.onLoad(null, false);
      }
    });
    // this.props.onLoad(token ? agent.Auth.current() : null, token);
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