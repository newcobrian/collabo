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
        
        <Link to="editor" className="nav-module nav-editor">  
            <div className="nav-icon"><img src="../img/icon32_add.png"/></div>
            New
        </Link>

        <Link to="" className="nav-module">
            <div className="nav-icon"><img src="../img/icon32_feed.png"/></div>
            Feed
        </Link>
        
        <Link to="inbox" className="nav-module">
            <div className="nav-icon"><img src="../img/icon32_inbox.png"/></div>
            Inbox
        </Link>
        <Link to={`@${props.userInfo.username}`} className="nav-module">        
            <div className="nav-icon"><img src="../img/icon32_saved.png"/></div>
            Saved
        </Link>
        <Link to={`@${props.userInfo.username}`} className="nav-module">
            <div className="nav-icon"><img className="center-img" src={props.userInfo.image}/></div>
            Profile
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
              whatsgood?
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