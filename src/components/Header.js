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
      <div className="navigation-bar no-icons flx flx-row flx-align-center">
          <Link to="login" className="nav-module">
            Sign-in
          </Link>

          <Link to="register" className="nav-module">
            Sign-up
          </Link>

      </div>
    );
  }
  return null;
};

const LoggedInView = props => {
  if (props.currentUser && props.userInfo) {
    return (
      <div className="navigation-bar flx flx-row flx-align-center flx-just-end">
        
        

        <IndexLink to="/" activeClassName="active" className="nav-module nav-feed flx flx-center-all">
            <div className="nav-text">Explore</div>
        </IndexLink>

        <Link to="create" activeClassName="active" className="nav-module create nav-editor flx flx-center-all">  
            <div className="nav-text flx flx-row flx-align-center color--neon">
              <img className="mrgn-right-sm center-img" src="../img/icon.add--green.png"/> Create New Itinerary
            </div>
        </Link>

        {/*<Link to="about" activeClassName="active" className="nav-module nav-feed flx flx-center-all">
            <div className="nav-text">About</div>
        </Link>*/}

        <Link to={`@${props.userInfo.username}`} activeClassName="active" className="nav-module nav-profile flx flx-row flx-center-all">
          <div className="nav-text">My Views</div>
          {/*<div className="nav-icon"><img className="center-img" src={props.userInfo.image}/></div>*/}
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
          <Link to="/" className="logo-module flx flx-row flx-just-start flx-align-center">
            <div className="logo-graphic">  
              <img className="center-img" src="../img/logos/logo.nike.blue-yellow.png"/>
            </div>
            <div className="logo-main">
            VIEWS
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