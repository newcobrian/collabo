import { Link, IndexLink } from 'react-router';
import React from 'react';

const InboxCounter = props => {
  if (props.unreadMessages > 0) {
    return (
      <div className="count-badge header-badge badge-on"> {props.unreadMessages}</div>
    );
  }
  return (
    <div className="count-badge header-badge">0</div>
  );
}

const LoggedOutView = props => {
  if (!props.currentUser || props.currentUser.isAnonymous) {
    return (
      <div className="navigation-bar no-icons flx flx-row flx-align-center pdding-right-md">
          <Link to="login" className="nav-module">
            <div className="">
              Log in
            </div>
          </Link>

          <Link to="register" className="nav-module">
            <div className="color--primary">
              Sign up
            </div>
          </Link>

      </div>
    );
  }
  return null;
};

const LoggedInView = props => {
  if (props.currentUser && props.userInfo) {
    return (
      <div className="navigation-bar flx flx-row flx-align-center flx-just-end pdding-right-md">
        
        

        <Link to="/" onlyActiveOnIndex activeClassName="active" className="nav-module nav-feed flx flx-center-all">
            <div className="nav-text">Explore</div>
        </Link>

        <Link to="explore" activeClassName="active" className="nav-module nav-feed flx flx-center-all">
            <div className="nav-text">Travelers</div>
        </Link>

        <Link to="create" activeClassName="active" className="nav-module create nav-editor flx flx-center-all">  
          <div className="nav-text flx flx-row flx-align-center">
            <img className="mrgn-right-sm center-img" src="../img/icon.add--blue.png"/> New Itinerary
          </div>
        </Link>

        <Link to="inbox" activeClassName="active" className="nav-module nav-notifs flx flx-center-all">
          <div className="nav-text">
            <InboxCounter unreadMessages={props.unreadMessages} />
          </div>
        </Link>

        <Link to={`${props.userInfo.username}`} activeClassName="active" className="nav-module nav-profile flx flx-row flx-center-all">
          {/*<div className="nav-text">Profile</div>*/}
          <div className="nav-icon mrgn-none"><img className="center-img" src={props.userInfo.image}/></div>
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
        <div className="header-wrapper w-max">
          <Link to="/" className="logo-module flx flx-row flx-just-start flx-align-center">
            <div className="logo-graphic">  
              <img className="center-img" src="../img/logos/logo.bird3.sea.png"/>
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