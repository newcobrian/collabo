import React from "react";
import {IndexRoute, Route} from "react-router";

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
import Register from './components/Register';
import Settings from './components/Settings';
import Editor from './components/Editor';
import Create from './components/Create';
import Followers from './components/Followers';
import Followings from './components/Followings';
import Inbox from './components/Inbox';
import FriendSelector from './components/FriendSelector';
import Itinerary from './components/Itinerary';
import Explore from './components/Explore';
import Places from './components/Places';
import ForgotPassword from './components/ForgotPassword';
import SEO from './components/SEO';

export default function(history) {
  return (
    <Route path="/" component={App}>
      <IndexRoute component={Home} />
      <Route path="global" component={GlobalFeed} />
      <Route path="popular" component={PopularFeed} />
      <Route path="saved" component={SavesFeed} />
      <Route path="login" component={Login} />
      <Route path="register" component={Register} />
      <Route path="settings" component={Settings} />
      <Route path="forgotPassword" component={ForgotPassword} />
      <Route path="review/:sid(/:rid)" component={Review} />
      <Route path="create" component={Create} />
      <Route path="inbox" component={Inbox} />
      <Route path="select" component={FriendSelector} />
      <Route path="explore" component={Explore} />
      <Route path="seo" component={SEO} />
      <Route path="places/:pid" component={Places} />
      <Route path="guide/:iid" component={Itinerary} />
      <Route path=":username/followers" component={Followers} />
      <Route path=":username/isfollowing" component={Followings} />
      <Route path=":username" component={Profile} />
      <Route path=":username/likes" component={ProfileLikes} />
      <Route path=":username/saves" component={ProfileSaves} />
    </Route>
  );
}

