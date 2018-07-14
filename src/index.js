import { Provider } from 'react-redux';
import ReactDOM from 'react-dom';
import React from 'react';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';

import App from './components/App';
import Review from './components/Review';
import Home from './components/Home';
import GlobalFeed from './components/Home/GlobalFeed';
import PopularFeed from './components/Home/PopularFeed';
import SavesFeed from './components/Home/SavesFeed';
import Login from './components/Login';
import Profile from './components/Profile';
import ProfileLikes from './components/ProfileLikes';
import ProfileSaves from './components/ProfileSaves';
import ProfileGuides from './components/ProfileGuides';
import Register from './components/Register';
import Settings from './components/Settings';
import Editor from './components/Editor';
import Create from './components/Create';
import AddProject from './components/AddProject';
import AddThread from './components/AddThread';
import Thread from './components/Thread';
import AddReview from './components/AddReview';
import Followers from './components/Followers';
import Followings from './components/Followings';
import Inbox from './components/Inbox';
import FriendSelector from './components/FriendSelector';
import Itinerary from './components/Itinerary';
import Explore from './components/Explore';
import Places from './components/Places';
import Project from './components/Project';
import ForgotPassword from './components/ForgotPassword';
import Recommend from './components/Recommend';
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
        <Route path="settings" component={Settings} />
        <Route path="forgotPassword" component={ForgotPassword} />
        <Route path="addproject" component={AddProject} />
        <Route path="addthread/:pid" component={AddThread} />
        <Route path="inbox" component={Inbox} />
        <Route path="seo" component={SEO} />
        <Route path="project/:pid" component={Project} />
        <Route path="thread/:tid" component={Thread} />
        <Route path=":username/followers" component={Followers} />
        <Route path=":username/isfollowing" component={Followings} />
        <Route path=":username" component={ProfileGuides} />
        <Route path=":username/likes" component={ProfileLikes} />
      </Route>
    </Router>
  </Provider>
), document.getElementById('root'));