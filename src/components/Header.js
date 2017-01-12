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
  if (props.currentUser && props.userInfo) {
    return (
      <div className="navigation-bar roow roow-row-right">
        <Link to="" className="nav-link">
        <div className="nav-module">
            <div className="nav-icon"><img src="../img/icon32_nav-feed.png"/></div>
            Feed
        </div>
        </Link>
        
        <Link to="" className="nav-link">
        <div className="nav-module">
            <div className="nav-icon"><img src="../img/icon32_nav-inbox.png"/></div>
            Inbox
        </div>
        </Link>
        <Link to={`@${props.userInfo.username}`} className="nav-link">        
        <div className="nav-module">
            <div className="nav-icon"><img src="../img/icon32_nav-saved.png"/></div>
            Saved
        </div>
        </Link>
        <Link to={`@${props.userInfo.username}`} className="nav-link">
        <div className="nav-module">
            <div className="nav-icon"><img src={props.userInfo.image}/></div>
            Profile
        </div>
        </Link>
        <Link to="editor" className="nav-link create-review">  
        <div className="nav-module create-review bttn-style roow roow-row-center">
            <div className="icon-wrapper new"><img src="../img/icon32_add.png"/></div>&nbsp;New Review
        </div>
        </Link>


      </div>
    );
  }

  return null;
};

class Header extends React.Component {
  render() {
    return (
        <div className="roow">

          <Link to="/" className="logo-module roow roow-col-left">
            <div className="logo-main">
              recc
              <div className="logo-circle"></div>
              <div className="logo-circle"></div>
              <div className="logo-circle"></div>
              <div className="logo-circle"></div>
              <div className="logo-circle"></div>
              n
            </div>
            <div className="logo-tagline">Reviews by people you trust</div>
          </Link>

          <LoggedOutView currentUser={this.props.currentUser} />

          <LoggedInView currentUser={this.props.currentUser} userInfo={this.props.userInfo} />
        </div>
    );
  }
}

export default Header;