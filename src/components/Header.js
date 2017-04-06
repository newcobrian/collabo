import { Link, IndexLink } from 'react-router';
import React from 'react';

const InboxCounter = props => {
  if (props.unreadMessages > 0) {
    return (
      <div className="count-badge header-badge">{props.unreadMessages}</div>
    );
  }
  return null;
}

const LoggedOutView = props => {
  if (!props.currentUser || props.currentUser.isAnonymous) {
    return (
      <div className="navigation-bar no-icons roow roow-row-right">
          <Link to="login" className="nav-module">
            Sign-in
          </Link>

          <Link to="register" className="nav-module">
            Sign up
          </Link>

      </div>
    );
  }
  return null;
};

const LoggedInView = props => {
  if (props.currentUser && props.userInfo) {
    return (
      <div className="navigation-bar roow roow-row-right">
        
        

        <IndexLink to="/" activeClassName="active" className="nav-module nav-feed">
            <div className="nav-icon"><img src="../img/icon32_feed.png"/></div>
            <div className="nav-text">Feed</div>
        </IndexLink>

        <Link to="inbox" activeClassName="active" className="nav-module nav-inbox">
            <div className="nav-icon"><img src="../img/icon32_inbox.png"/></div>
            <div className="nav-text">Inbox</div> <InboxCounter unreadMessages={props.unreadMessages} />
        </Link>

        <Link to="create" activeClassName="active" className="nav-module nav-editor">  
            <div className="nav-icon"><img src="../img/icon32_add.png"/></div>
            <div className="nav-text">New</div>
        </Link>

        <Link to="saved" activeClassName="active" className="nav-module nav-saved">
            <div className="nav-icon"><img src="../img/icon32_saved.png"/></div>
            <div className="nav-text">Saved</div>
        </Link>
        
        <Link to={`@${props.userInfo.username}`} activeClassName="active" className="nav-module nav-profile">
            <div className="nav-icon"><img className="center-img" src={props.userInfo.image}/></div>
            <div className="nav-text">Profile</div>
        </Link>


      </div>
    );
  }

  return null;
};

class Header extends React.Component {
  render() {
    return (
      <div className="header-container">
        <div className="header-wrapper">
          <Link to="/" className="logo-module roow roow-row">
            <div className="logo-graphic">  
              <img className="center-img" src="../img/logo_5dots.png"/>
            </div>
            <div className="logo-main">
            </div>
            <div className="logo-tagline">Reviews by people you trust</div>
          </Link>

          <LoggedOutView currentUser={this.props.currentUser} />

          <LoggedInView currentUser={this.props.currentUser} userInfo={this.props.userInfo} unreadMessages={this.props.unreadMessages} />
        </div>
      </div>
    );
  }
}

export default Header;