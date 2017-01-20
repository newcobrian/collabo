import { Provider } from 'react-redux';
import ReactDOM from 'react-dom';
import React from 'react';
import { Router, Route, IndexRoute, hashHistory } from 'react-router';

import App from './components/App';
import Review from './components/Review';
import Home from './components/Home';
import GlobalFeed from './components/Home/GlobalFeed';
import Login from './components/Login';
import Profile from './components/Profile';
import ProfileLikes from './components/ProfileLikes';
import Register from './components/Register';
import Settings from './components/Settings';
import Editor from './components/Editor';
import Followers from './components/Followers';
import Followings from './components/Followings';
import Inbox from './components/Inbox';
import store from './store';

ReactDOM.render((
  <Provider store={store}>
    <Router history={hashHistory}>
      <Route path="/" component={App}>
        <IndexRoute component={Home} />
        <Route path="global" component={GlobalFeed} />
        <Route path="login" component={Login} />
        <Route path="register" component={Register} />
        <Route path="settings" component={Settings} />
        <Route path="review/:sid(/:rid)" component={Review} />
        <Route path="followers/:username" component={Followers} />
        <Route path="followings/:username" component={Followings} />
        <Route path="@:username" component={Profile} />
        <Route path="@:username/likes" component={ProfileLikes} />
        <Route path="editor" component={Editor} />
        <Route path="editor/:slug" component={Editor} />
        <Route path="inbox" component={Inbox} />
      </Route>
    </Router>
  </Provider>
), document.getElementById('root'));