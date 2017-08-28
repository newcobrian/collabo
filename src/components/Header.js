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
     <div className="header-container logged-out">
      <div className="header-wrapper w-100">
        <Link to="/" className="logo-module flx flx-row flx-just-start flx-align-center">
          <div className="logo-graphic">  
            <img className="center-img" src="/img/logos/logo.horizon.png"/>
          </div>
            <div className="logo-main DN">
              VIEWS
            </div>
            <div className="DN v2-type-caption opa-60 w-100 mrgn-top-xs mrgn-left-xs">
              Alpha 1.2
            </div>
        </Link>
      </div>
      <div className="navigation-bar flx flx-row flx-align-center flx-just-end pdding-right-md">
          <Link to="/login" className="nav-module nav-feed flx flx-center-all">
            <div className="nav-text">
              Log in
            </div>
          </Link>

          <Link to="/register" className="nav-module nav-feed flx flx-center-all">
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
            <div className="logo-graphic">  
              <img className="center-img" src="/img/logos/logo.horizon.png"/>
            </div>
              <div className="logo-main DN">
                VIEWS
              </div>
              <div className="DN v2-type-caption opa-60 w-100 mrgn-top-xs mrgn-left-xs">
                Alpha 1.2
              </div>
          </Link>
        </div>


      <div className="navigation-bar flx flx-row flx-align-center flx-just-end pdding-right-md">
        
        

        <Link to="/" onlyActiveOnIndex activeClassName="active" className="nav-module nav-feed flx flx-center-all">
          <div className="nav-text flx flx-row flx-align-center">
            <i className="material-icons mrgn-right-sm color--black md-24 mobile-show">language</i>
            <div className="nav-text">Explore</div>
          </div>
        </Link>

        <Link to="/explore" activeClassName="active" className="nav-module nav-feed flx flx-center-all">
          <div className="nav-text flx flx-row flx-align-center">
            <i className="material-icons mrgn-right-sm color--black md-24 mobile-show">people</i>
            <div className="nav-text">Travelers</div>
          </div>
        </Link>

        <Link to="/create" activeClassName="active" className="nav-module create nav-editor flx flx-center-all">  
          <div className="nav-text flx flx-row flx-align-center">
            <i className="material-icons mrgn-right-sm color--success md-24 opa-100">add</i>
            <div>New Guide</div>
          </div>
        </Link>

        <Link to="/inbox" activeClassName="active" className="nav-module nav-notifs flx flx-center-all">
          <div className="nav-text flx flx-row flx-align-center">
            <InboxCounter className="mrgn-right-sm" unreadMessages={props.unreadMessages} />
            <div className="mobile-show">Activity</div>
          </div>
        </Link>

        <Link to={`/${props.userInfo.username}`} activeClassName="active" className="nav-module nav-profile flx flx-row flx-center-all">
         <div className="nav-text flx flx-row flx-align-center">
          <div className="nav-icon"><img className="center-img" src={props.userInfo.image}/></div>
          <div className="mobile-show">My Views</div>
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