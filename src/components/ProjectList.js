import React from 'react';
import { connect } from 'react-redux';
import { Link, browserHistory } from 'react-router';
import * as Actions from '../actions';
import * as Constants from '../constants';
import ProfilePic from './ProfilePic';
import FirebaseSearchInput from './FirebaseSearchInput';


const DotJewel = props => {
  if (props.threadCount > 0) {
    return (
      <div className="sidebar-dot fill--tancho active">
      </div>
    );
  }
  return (

    <div className="sidebar-dot fill--tertiary--10">
      {/*<img className="center-img" src="/img/lock--pond.png"/>*/}

    </div>
  );
}

const PrivateIcon = props => {
  if (props.threadCount > 0) {
    return (
      <div className={'lock-wrapper flx flx-center-all mrgn-right-xs ' + (props.isPublic === true ? ' listname--public' : 'listname--private')}>
        <img className="center-img" src="/img/lock-icon.png"/>
      </div>
    );
  }
  return (
    <div className={'lock-wrapper flx flx-center-all mrgn-right-xs ' + (props.isPublic === true ? ' listname--public' : 'listname--private')}>
      <img className="center-img" src="/img/lock-icon.png"/>
    </div>
  );
}

const ThreadCountJewel = props => {
  if (props.threadCount > 0) {
    return (
      <div className="group-badge badge-on color--black flx-item-right koi-type-count ta-right">{props.threadCount}</div>
    );
  }
  return (
    <div className="group-badge badge-on color--black flx-item-right"></div>
  );
}
const InboxCounter = props => {
  if (props.inboxCount > 0) {
    return (
      <div className="group-badge fill--utsuri olor--black active koi-type-count">
        {props.inboxCount}
      </div>
    );
  }
  return (
    <div className="color--black group-badge koi-type-count">
      0
    </div>
  );
}

const mapStateToProps = state => ({
  ...state.projectList,
  currentUser: state.common.currentUser,
  authenticated: state.common.authenticated,
  orgUser: state.common.orgUser,
  unreadMessages: state.common.unreadMessages
});

class ProjectList extends React.Component {
  constructor() {
    super();

    this.onOrgChange = ev => {
      ev.preventDefault();
      browserHistory.push('/' + ev.target.value)
    }

    this.onAllClick = ev => {
      ev.preventDefault()
      this.props.onAllProjectsClick(this.props.org.url)
    }

    this.searchInputCallback = result => {
      if (result.value && result.projectId) {
        browserHistory.push('/' + this.props.org.url + '/' + result.projectId + '/' + result.objectId);
      }
    }

    this.onOrgInviteClick = ev => {
      ev.preventDefault()
      this.props.showOrgInviteModal(this.props.org)
    }
  }

  render() {
    if (!this.props.org || !this.props.projectList || !this.props.projectNames) {
      return null
    }

    let org = this.props.org
    let threadCounts = this.props.threadCounts || {}
    let inboxCount = this.props.unreadMessages && this.props.unreadMessages[this.props.org.id] ? this.props.unreadMessages[this.props.org.id] : 0

    return (
      <div className="co-sidebar flx-col flx-item-left h-100 fill--mist">

        <div className="org-row org-row-selector flx flx-row flx-align-center">
          {/*<Link to='/'  className="co-logo flx-hold">
            <img className="center-img" src="/img/icon24_orgsettings_color.png"/>
          </Link>*/}
          <select className="org-selector co-type-org color--utsuri opa-40" onChange={this.onOrgChange}>
            <option value={org.url}>{org.name}</option>
            {(this.props.orgList || []).map((orgItem, index) => {
              if (orgItem && orgItem.name && orgItem.url && org.url && orgItem.url.toLowerCase() !== org.url.toLowerCase()) {
                return (
                  <option key={index} value={orgItem.url}>{orgItem.name}</option>  
                )
              }
            })}
            <option value='newteam'>+ New Team</option>
          </select>
          <div className="org-arrow flx flx-center-all">
            <div className="koi-ico --24 ico--down"></div>
          </div>
        </div> 

        <div className="sidebar-groups-wrapper">
          <div className="sidebar-row group-row search-row flx flx-row flx-align-center color--black">
            <div className="sidebar-icon flx flx-center-all">
              <div className="koi-ico --24 ico--search opa-40"></div>
            </div>
            <FirebaseSearchInput 
              type={Constants.POSTS_SEARCH}
              callback={this.searchInputCallback}
              orgURL={org.url}
              className={"color--black koi-type-body"}
              placeholder="Search" />
          </div>

          <div className="group-title-wrapper flx flx-row flx-align-center mrgn-bottom-sm">
            <div className="koi-type-caption koi-type-bold opa-30 color--black">
              Groups
            </div>
            {/*<Link to={'/' + org.name + '/createGroup'} className="flx flx-row flx-align-center flx-item-right">
              <div className="co-type-label color--black"> 
                Add Group
              </div>
              <div className="mrgn-left-sm flx flx-center-all">
                <div className="koi-ico --24 ico--add--tertiary"></div>              
              </div>
            </Link>*/}
          </div>

          <Link className={"sidebar-row group-row flx flx-row flx-align-center " + (!this.props.projectId && this.props.source === Constants.PROJECT_PAGE ? 'active' : '')} onClick={this.onAllClick}>
            <div className="sidebar-icon flx flx-center-all">
              {/*<div className="koi-ico --24 ico--allupdates--primary"></div>*/}
              <div className="sidebar-dot fill--tertiary--10"></div>
            </div>
            <div className="lock-wrapper flx flx-center-all mrgn-right-xs">
            </div>
            <div className="sidebar-project-name color--black"> 
              All Threads
            </div>
          </Link>

            {
              (this.props.projectList || []).map((projectItem, index) => {
                let projectName = this.props.projectNames && this.props.projectNames[projectItem.id] ? this.props.projectNames[projectItem.id].name : ''
                return (

                    <Link className={"sidebar-row group-row flx flx-row flx-align-center " + (this.props.projectId === projectItem.id ? 'active' : '')} key={projectItem.id} to={'/' + org.url + '/' + projectItem.id}>
                      <div className="sidebar-icon flx flx-center-all">
                        <DotJewel threadCount={threadCounts[projectItem.id]} isPublic={projectItem.isPublic} />
                      </div>
                      {<PrivateIcon threadCount={threadCounts[projectItem.id]} isPublic={projectItem.isPublic} />}

                      <div className="sidebar-project-name color--black">
                        {projectName}
                      </div>
                      {<ThreadCountJewel threadCount={threadCounts[projectItem.id]} />}
                    </Link>

                );
              })
            }
            <Link to={'/' + org.url + '/createGroup'} className="sidebar-row group-row flx flx-row flx-align-center mrgn-top-sm">
              <div className="sidebar-icon flx flx-center-all">
                <div className="koi-ico --24 ico--add ico-color--seaweed"></div> 
              </div>
              <div className="lock-wrapper flx flx-center-all mrgn-right-xs">
              </div>
              <div className="sidebar-project-name color--seaweed co-type-bold"> 
                Add Group
              </div>
            </Link>
          </div>



          <div className="sidebar-footer flx flx-col">
            <div className="sidebar-row flx flx-row flx-center-all mrgn-bottom-sm">
              <Link onClick={this.onOrgInviteClick}
                className="flx flx-col flx-center-all koi-button-fancy-wrapper mrgn-right-lg mrgn-left-lg border--utsuri">
                  <div className="koi-button-fancy-outer">
                  </div>
                  <div className="koi-button-fancy-inner">
                  </div>
                  <div className="koi-button-fancy-text color--utsuri">
                    Invite Team Members
                  </div>
              </Link>
            </div>

           

            <div className="flx flx-row flx-align-center w-100">

              <Link className="sidebar-row group-triplet flx flx-col flx-align-center" to={`/${org.url}/user/${this.props.orgUser.username}`} activeClassName="active">
                <div className="mrgn-bottom-xs flx flx-center-all">
                  <ProfilePic className="center-img" src={this.props.orgUser.image}/>
                </div>
                <div className="koi-type-caption koi-type-bold color--black">{this.props.orgUser.username}</div>
              </Link>

              <Link to={'/' + org.url + '/inbox'} activeClassName="active" className="sidebar-row group-triplet flx flx-col flx-align-center">
                  <div className="sidebar-icon--large flx flx-center-all">
                    <div className="koi-type-count"><InboxCounter inboxCount={inboxCount} className=""/></div>
                  </div>
                  <div className="koi-type-caption color--black koi-type-bold">Activity</div>
              </Link>

              

              <Link activeClassName="active" className="sidebar-row group-triplet flx flx-col flx-align-center no-click DN">
                  <div className="sidebar-icon--large flx flx-center-all">
                    <div className="koi-ico ico--bookmark--tertiary opa-20"></div>
                  </div>
                  <div className="koi-type-label color--white opa-40 koi-type-bold">Saved</div>
              </Link>

              <Link to={'/' + org.url + '/admin'} activeClassName="active" className="sidebar-row group-triplet flx flx-col flx-align-center">
                  <div className="sidebar-icon--large flx flx-center-all">
                    <div className="koi-ico ico--orgsettings"></div>
                  </div>
                  <div className="koi-type-caption color--black koi-type-bold">Team</div>
              </Link>
            </div>

            

            <div className="DN sidebar-row koi-sidebar-footer flx flx-row flx-align-center fill--primary mrgn-top-sm">
              <Link to='/' className="co-type-logo color--white">KOI</Link>
            </div>
          </div>

        </div>
    );
  }
}

export default connect(mapStateToProps, Actions)(ProjectList);