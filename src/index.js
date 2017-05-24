import { Provider } from 'react-redux';
import ReactDOM from 'react-dom';
import React from 'react';
import { Router, Route, IndexRoute, hashHistory } from 'react-router';

import App from './components/App';
import Review from './components/Review';
import Home from './components/Home';
import GlobalFeed from './components/Home/GlobalFeed';
import SavesFeed from './components/Home/SavesFeed';
import Login from './components/Login';
import Profile from './components/Profile';
import ProfileLikes from './components/ProfileLikes';
import ProfileSaves from './components/ProfileSaves';
import Register from './components/Register';
import Settings from './components/Settings';
import Editor from './components/Editor';
import Create from './components/Create';
import Followers from './components/Followers';
import Followings from './components/Followings';
import Inbox from './components/Inbox';
import FriendSelector from './components/FriendSelector';
import RootModal from './components/Modal';
import Itinerary from './components/Itinerary';
import store from './store';
import injectTapEventPlugin from 'react-tap-event-plugin';

injectTapEventPlugin();

ReactDOM.render((
  <Provider store={store}>
    <Router history={hashHistory}>
      <Route path="/" component={App}>
        <IndexRoute component={Home} />
        <Route path="global" component={GlobalFeed} />
        <Route path="saved" component={SavesFeed} />
        <Route path="login" component={Login} />
        <Route path="register" component={Register} />
        <Route path="settings" component={Settings} />
        <Route path="review/:sid(/:rid)" component={Review} />
        <Route path="followers/:username" component={Followers} />
        <Route path="followings/:username" component={Followings} />
        <Route path=":username" component={Profile} />
        <Route path=":username/likes" component={ProfileLikes} />
        <Route path=":username/saves" component={ProfileSaves} />
        <Route path="edit/:iid" component={Editor} />
        <Route path="create" component={Create} />
        <Route path="inbox" component={Inbox} />
        <Route path="select" component={FriendSelector} />
        <Route path="itinerary/:iid" component={Itinerary} />
      </Route>
    </Router>
  </Provider>
), document.getElementById('root'));