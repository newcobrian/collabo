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
  // if on global ORGSpage for logged out user, don't show the header
  if (browserHistory.getCurrentLocation().pathname === '/global' && (!props.currentUser || props.currentUser.isAnonymous)) {
    return null;
  }
  else if (!props.currentUser || props.currentUser.isAnonymous) {
    return (
     <div className="header-container logged-out">
      <div className="header-wrapper w-100">
        <Link to="/" className="logo-module flx flx-row flx-just-start flx-align-center">
          <div className="logo-graphic flx flx-row flx-center-all DN">  
            <img className="center-img" src="/img/colab-logo-temp.png"/>
          </div>
          <div className="flx flx-row flx-align-center flx-just-start">
            <div className="logo-main color--black">
                  <i className="material-icons color--black md-36 opa-70">view_module</i>
            </div>
            <div className="v2-type-body2 opa-60 w-100 color--white mobile-hide DN">
              Travel Guides by Friends
            </div>
          </div>
        </Link>
      </div>
      <div className="navigation-bar flx flx-row flx-align-center flx-just-end">
          <Link to="/login" className="nav-module nav-feed flx vb vb--xs flx-center-all fill--black color--primary">
            <div className="nav-text">
              Log in
            </div>
          </Link>

          <Link to="/register" className="nav-module nav-feed flx flx-center-all vb vb--xs fill--black color--primary vb--sm vb--radius--none mrgn-right-sm">
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
            <div className="logo-graphic flx flx-row flx-center-all DN">  
              <img className="center-img" src="/img/colab-logo-temp.png"/>
            </div>
            <div className="flx flx-row flx-align-center flx-just-start">
              <div className="logo-main color--black">
                  <i className="material-icons color--black md-36 opa-70">view_module</i>

              </div>
              <Link to={'/invite/'} activeClassName="active" className="nav-module create nav-editor flx flx-center-all DN">  
                <div className="nav-text flx flx-row flx-align-center">
                  <i className="material-icons color--success md-24 opa-100 mrgn-right-xs">add</i>
                  <div className="mobile-hide mrgn-left-xs">Invite new team members</div>
                </div>
              </Link>
              <Link to='/' className="v2-type-body2 opa-60 w-100 color--white mobile-hide DN">
                Invite new team members
              </Link>
            </div>
          </Link>
        </div>


      <div className="navigation-bar flx flx-row flx-align-center flx-just-end">
        
        <Link to="/addProject" activeClassName="active" className="nav-module create nav-editor flx flx-center-all DN">  
          <div className="nav-text flx flx-row flx-align-center">
            <i className="material-icons color--success md-24 opa-100 mrgn-right-xs">add</i>
            <div className="mobile-hide mrgn-left-xs">New Project</div>
          </div>
        </Link>

        <Link to="/" onlyActiveOnIndex activeClassName="active" className={"DN nav-module nav-feed flx flx-center-all " + (browserHistory.getCurrentLocation().pathname === '/popular' ? ' active' : '')}>
          <div className="nav-text flx flx-row flx-align-center">
            <i className="material-icons color--black md-24 mobile-show opa-60">public</i>
            <div className="nav-text mobile-hide">Lists</div>
          </div>
        </Link>

        <Link to="/explore" activeClassName="active" className="DN nav-module nav-feed flx flx-center-all">
          <div className="nav-text flx flx-row flx-align-center">
            <i className="material-icons color--black md-24 mobile-show opa-60">people</i>
            <div className="nav-text mobile-hide">People</div>
          </div>
        </Link>

        <Link to="/inbox" activeClassName="active" className="nav-module nav-notifs flx flx-center-all">
          <div className="nav-text flx flx-row flx-align-center">
            <InboxCounter className="" unreadMessages={props.unreadMessages} />
            <div className="DN">Activity</div>
          </div>
        </Link>

        <Link to={`/${props.orgName}/user/${props.userInfo.username}`} activeClassName="active" className="nav-module nav-profile flx flx-row flx-center-all">
         <div className="nav-text flx flx-row flx-align-center">
          <div className="nav-icon"><ProfilePic className="center-img" src={props.userInfo.image}/></div>
          <div className="DN">My Views</div>
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

          <LoggedInView currentUser={this.props.currentUser} userInfo={this.props.userInfo} unreadMessages={this.props.unreadMessages} orgName={this.props.orgName} />
      </div>
    );
  }
}

export default Header;