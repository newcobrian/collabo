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
import ProjectList from './ProjectList';
import Sidebar from 'react-sidebar';

const mql = window.matchMedia(`(min-width: 800px)`);

const mapStateToProps = state => ({
  appLoaded: state.common.appLoaded,
  appName: state.common.appName,
  currentUser: state.common.currentUser,
  userInfo: state.common.userInfo,
  unreadMessages: state.common.unreadMessages,
  redirectTo: state.common.redirectTo,
  snackbarToaster: state.common.snackbarToaster,
  orgName: state.organization.orgName,
  sidebarDocked: state.common.sidebarDocked,
  sidebarOpen: state.common.sidebarOpen
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
  constructor() {
    super()

    this.mediaQueryChanged = this.mediaQueryChanged.bind(this);

    this.onToggleSidebarClick = () => {
      this.props.setSidebar(!this.props.sidebarOpen)
    }
  }

  componentWillMount() {
    const token = window.localStorage.getItem('jwt');
    if (token) {
      agent.setToken(token);
    }

    this.props.loadSidebar(mql);
    mql.addListener(this.mediaQueryChanged);

    Firebase.auth().onAuthStateChanged(user => {
      if (user) {
        // if (user.isAnonymous) {
        //   this.props.onLoad(user, false)
        // }
        // else {
        //   this.props.onLoad(user, user.uid);
        // }
        mixpanel.identify(user.uid);
        mixpanel.register({"User ID": user.uid});
        this.props.onLoad(user);
        this.props.loadOrganizationList(user.uid)
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

  componetWillUnmount() {
    this.props.mql.removeListener(this.mediaQueryChanged)
  }

  mediaQueryChanged() {
    this.props.setSidebar(mql.matches);
  }

  render() {
    if (this.props.appLoaded) {
      return (
        <div>
           <Sidebar
            sidebar={<ProjectList />}
            open={this.props.sidebarOpen}
            onSetOpen={this.props.setSidebarOpen}
            styles={{ overlay:
                         {
                           backgroundColor: "rgba(255,255,255,1)"
                         },
                       }}
            >
            <div className={this.props.sidebarOpen ? 'open-style' : 'closed-style'}>
              {this.props.children}
            </div>

            <button onClick={this.onToggleSidebarClick}>
              Toggle sidebar
            </button>

            <SnackbarToaster 
              {...this.props.snackbarToaster}
              duration={4000} 
              onRequestClose={this.props.closeSnackbar} />
              <LightboxComponent/>
            <RootModal/>
          </Sidebar>
        </div>
      );
    }
    return (
      <div>
        
      </div>
    );
  }
}

App.contextTypes = {
  router: React.PropTypes.object.isRequired
};

export default connect(mapStateToProps, Actions)(App);