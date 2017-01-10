'use strict';

import { Link } from 'react-router';
import React from 'react';

const LoggedOutView = props => {
  if (!props.currentUser) {
    return (
      <div className="navigation-bar roow roow-row-right">
        <div className="nav-module">
          <Link to="/" className="nav-link">
            Feed
          </Link>
        </div>

        <div className="nav-module">
          <Link to="login" className="nav-link">
            Sign-in
          </Link>
        </div>

        <div className="nav-module">
          <Link to="register" className="nav-link">
            Sign up
          </Link>
        </div>

      </div>
    );
  }
  return null;
};

const LoggedInView = props => {
  if (props.currentUser) {
    return (
      <div className="navigation-bar roow roow-row-right">

        <div className="nav-module">
          <Link to="" className="nav-link">
            Feed
          </Link>
        </div>
        <div className="nav-module">
          <Link to="" className="nav-link">
            Inbox
          </Link>
        </div>
        <div className="nav-module">
          <Link to={`@${props.currentUser.username}`} className="nav-link">
            {props.currentUser.username} Bookmarks
          </Link>
        </div>
        <div className="nav-module">
          <Link to={`@${props.currentUser.username}`} className="nav-link">
            {props.currentUser.username} Profile
          </Link>
        </div>
        <div className="nav-module create-review">
          <Link to="editor" className="nav-link">
            <i className="ion-plus"></i>&nbsp;New Review
          </Link>
        </div>

        <div className="nav-module nav-user-image">
          <Link to="settings" className="nav-link">
            <img src={props.currentUser.image} className="user-pic" />
            {props.currentUser.username}
          </Link>
        </div>

      </div>
    );
  }

  return null;
};

class Header extends React.Component {
  render() {
    return (
        <div className="container">

          <Link to="/" className="logo-module roow">
            {this.props.appName.toLowerCase()}
          </Link>

          <LoggedOutView currentUser={this.props.currentUser} />

          <LoggedInView currentUser={this.props.currentUser} />
        </div>
    );
  }
}

export default Header;