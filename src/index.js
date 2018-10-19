import { Provider } from 'react-redux';
import ReactDOM from 'react-dom';
import React from 'react';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';

import App from './components/App';
import Home from './components/Home';
import Login from './components/Login';
import Profile from './components/Profile';
import ProfileLikes from './components/ProfileLikes';
import ProfileSaves from './components/ProfileSaves';
import ProfileGuides from './components/ProfileGuides';
import Register from './components/Register';
import Settings from './components/Settings';
import AddProject from './components/AddProject';
import AddThread from './components/AddThread';
import Thread from './components/Thread';
import AddReview from './components/AddReview';
import Followers from './components/Followers';
import Followings from './components/Followings';
import Inbox from './components/Inbox';
import ProjectInvite from './components/ProjectInvite';
import Explore from './components/Explore';
import Project from './components/Project';
import ForgotPassword from './components/ForgotPassword';
import CreateOrg from './components/CreateOrg';
import OrgInvite from './components/OrgInvite';
// import Organization from './components/Organization';
import AcceptInvite from './components/AcceptInvite';
import OrgSettings from './components/OrgSettings';
import ProjectSettings from './components/ProjectSettings';
import VerifyEmail from './components/VerifyEmail';
import EnterEmail from './components/EnterEmail';
import SEO from './components/SEO';
import store from './store';
import injectTapEventPlugin from 'react-tap-event-plugin';

injectTapEventPlugin();

function hashLinkScroll() {
  const { hash } = window.location;
  if (hash !== '') {
    // Push onto callback queue so it runs after the DOM is updated,
    // this is required when navigating from a different page so that
    // the element is rendered on the page before trying to getElementById.
    setTimeout(() => {
      const id = hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) element.scrollIntoView();
    }, 0);
  }
}

ReactDOM.render((
  <Provider store={store}>
    <Router history={browserHistory} onUpdate={hashLinkScroll}>
      <Route path="/" component={App}>
        <IndexRoute component={Home} />
        <Route path="login" component={Login} />
        <Route path="register" component={Register} />
        <Route path="whatsyouremail" component={EnterEmail} />
        <Route path="forgotPassword" component={ForgotPassword} />
        <Route path="newteam" component={CreateOrg} />
        <Route path="seo" component={SEO} />
        <Route path ="invitation/:iid" component={AcceptInvite} />
        <Route path ="verify/(:vid)" component={VerifyEmail} />
        {/*<Route path="user/:username/followers" component={Followers} />
        <Route path="user/:username/isfollowing" component={Followings} />
        <Route path="user/:username/likes" component={ProfileLikes} />*/}
        <Route path =":orgname/invitation/:iid" component={AcceptInvite} />
        <Route path=":orgname/inbox" component={Inbox} />
        <Route path=":orgname/admin" component={OrgSettings} />
        <Route path=":orgname/addthread" component={AddThread} />
        <Route path=":orgname/user/:username" component={Profile} />
        <Route path=":orgname/user/:username/settings" component={Settings} />
        <Route path=":orgname/createlist" component={AddProject} />
        <Route path=":orgname/invite" component={OrgInvite} />
        <Route path=":orgname(/:pid)" component={Project} />
        <Route path=":orgname/addthread/(:pid)" component={AddThread} />
        <Route path=":orgname/:pid/invite" component={ProjectInvite} />
        <Route path=":orgname/:pid/admin" component={ProjectSettings} />
        <Route path=":orgname/:pid/:tid" component={Thread} />
      </Route>
    </Router>
  </Provider>
), document.getElementById('root'));