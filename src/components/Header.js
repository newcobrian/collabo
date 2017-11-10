import { Link, IndexLink, browserHistory } from 'react-router';
import React from 'react';
import ProfilePic from './ProfilePic';

const InboxCounter = props => {
  if (props.unreadMessages > 0) {
    return (
      <div className="count-badge header-badge badge-on"> {props.unreadMessages}</div>
    );
  }
  return (
    <div className="count-badge header-badge opa-50">0</div>
  );
}

const LoggedOutView = props => {
  // if on global homepage for logged out user, don't show the header
  if (browserHistory.getCurrentLocation().pathname === '/global' && (!props.currentUser || props.currentUser.isAnonymous)) {
    return null;
  }
  else if (!props.currentUser || props.currentUser.isAnonymous) {
    return (
     <div className="header-container logged-out">
      <div className="header-wrapper w-100">
        <Link to="/" className="logo-module flx flx-row flx-just-start flx-align-center">
          <div className="logo-graphic flx flx-row flx-center-all">  
            <img className="center-img" src="/img/logos/logo_stripes.png"/>
          </div>
            <div className="logo-main">
              VIEWS
            </div>
            <div className="DN v2-type-caption opa-60 w-100 mrgn-top-xs mrgn-left-xs">
              Alpha 1.2
            </div>
        </Link>
      </div>
      <div className="navigation-bar flx flx-row flx-align-center flx-just-end pdding-right-md">
          <Link to="/login" className="nav-module nav-feed flx flx-center-all fill--white color--black">
            <div className="nav-text">
              Log in
            </div>
          </Link>

          <Link to="/register" className="nav-module nav-feed flx flx-center-all vb vb--sm fill--primary color--white vb--sm ">
            <div className="nav-text">
              Sign up
            </div>
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


      <div className="header-container">
        <div className="header-wrapper w-100">
          <Link to="/" className="logo-module flx flx-row flx-just-start flx-align-center">
            <div className="logo-graphic flx flx-row flx-center-all">  
              <img className="center-img" src="/img/logos/logo_stripes.png"/>
            </div>
              <div className="logo-main">
                VIEWS
              </div>
              <div className="DN v2-type-caption opa-60 w-100 mrgn-top-xs mrgn-left-xs">
                Alpha 1.2
              </div>
          </Link>
        </div>


      <div className="navigation-bar flx flx-row flx-align-center flx-just-end pdding-right-md">
        
        

        <Link to="/" onlyActiveOnIndex activeClassName="active" className={"nav-module nav-feed flx flx-center-all " + (browserHistory.getCurrentLocation().pathname === '/popular' ? ' active' : '')}>
          <div className="nav-text flx flx-row flx-align-center">
            <i className="material-icons color--black md-24 mobile-show">language</i>
            <div className="nav-text mobile-hide mrgn-left-sm">Places</div>
          </div>
        </Link>

        <Link to="/explore" activeClassName="active" className="nav-module nav-feed flx flx-center-all">
          <div className="nav-text flx flx-row flx-align-center">
            <i className="material-icons color--black md-24 mobile-show">people</i>
            <div className="nav-text mobile-hide mrgn-left-sm">People</div>
          </div>
        </Link>

        <Link to="/create" activeClassName="active" className="nav-module create nav-editor flx flx-center-all">  
          <div className="nav-text flx flx-row flx-align-center">
            <i className="material-icons color--success md-24 opa-100">add</i>
            <div className="mobile-hide mrgn-left-sm">New Guide</div>
          </div>
        </Link>

        <Link to="/inbox" activeClassName="active" className="nav-module nav-notifs flx flx-center-all">
          <div className="nav-text flx flx-row flx-align-center">
            <InboxCounter className="" unreadMessages={props.unreadMessages} />
            <div className="mobile-hide mrgn-left-sm">Activity</div>
          </div>
        </Link>

        <Link to={`/${props.userInfo.username}`} activeClassName="active" className="nav-module nav-profile flx flx-row flx-center-all">
         <div className="nav-text flx flx-row flx-align-center">
          <div className="nav-icon"><ProfilePic className="center-img" src={props.userInfo.image}/></div>
          <div className="mobile-hide">My Views</div>
        </div>
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
      <div>
          <LoggedOutView currentUser={this.props.currentUser} />

          <LoggedInView currentUser={this.props.currentUser} userInfo={this.props.userInfo} unreadMessages={this.props.unreadMessages} />
      </div>
    );
  }
}

export default Header;