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
      <div className="sidebar-dot fill--secondary active">
      </div>
    );
  }
  return (
    <div className="sidebar-dot fill--tertiary--10"></div>
  );
}
const ThreadCountJewel = props => {
  if (props.threadCount > 0) {
    return (
      <div className="group-badge badge-on color--black flx-item-right thread-timestamp"> {props.threadCount}</div>
    );
  }
  return (
    <div className="group-badge badge-on color--black flx-item-right"></div>
  );
}
const InboxCounter = props => {
  if (props.inboxCount > 0) {
    return (
      <div className="group-badge color--black active">
        {props.inboxCount}
      </div>
    );
  }
  return (
    <div className="color--black group-badge">
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
      this.props.onAllProjectsClick(this.props.orgName)
    }

    this.searchInputCallback = result => {
      if (result.value && result.projectId) {
        browserHistory.push('/' + this.props.orgName + '/' + result.projectId + '/' + result.objectId);
      }
    }
  }

  render() {
    if (!this.props.orgName || !this.props.projectList || !this.props.projectNames) {
      return null
    }

    // let orgName = this.props.org ?  this.props.org.name : ''
    let orgName = this.props.orgName
    let threadCounts = this.props.threadCounts || {}
    let inboxCount = this.props.unreadMessages && this.props.unreadMessages[this.props.orgId] ? this.props.unreadMessages[this.props.orgId] : 0

    return (
      <div className="co-sidebar flx-col flx-item-left h-100">

        <div className="org-row org-row-selector flx flx-row flx-align-center">
          {/*<Link to='/'  className="co-logo flx-hold">
            <img className="center-img" src="/img/icon24_orgsettings_color.png"/>
          </Link>*/}
          <select className="org-selector co-type-org color--black" onChange={this.onOrgChange}>
            <option value={orgName}>{orgName}</option>
            {(this.props.orgList || []).map((orgItem, index) => {
              if (orgItem && orgItem.name && orgName && orgItem.name.toLowerCase() !== orgName.toLowerCase()) {
                return (
                  <option key={index} value={orgItem.name}>{orgItem.name}</option>  
                )
              }
            })}
            <option value='newteam'>+ New Team</option>
          </select>
          <div className="org-arrow flx flx-center-all">
            <div className="koi-ico --24 ico--down--white"></div>
          </div>
        </div> 

        <div className="sidebar-row group-row search-row flx flx-row flx-align-center color--black">
          <div className="sidebar-icon flx flx-center-all">
            <div className="koi-ico --24 ico--search opa-40"></div>
          </div>
          <FirebaseSearchInput 
            type={Constants.POSTS_SEARCH}
            callback={this.searchInputCallback}
            orgName={orgName}
            className={"color--black"}
            placeholder="Search" />
        </div>

        

        <div className="sidebar-row flx flx-row flx-align-center mrgn-bottom-sm mrgn-top-md">
          <div className="co-type-h3 color--black">
            Groups
          </div>
          {/*<Link to={'/' + orgName + '/createList'} className="flx flx-row flx-align-center flx-item-right">
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
          <div className="sidebar-project-name color--black"> 
            All Threads
          </div>
        </Link>

          {
            (this.props.projectList || []).map((projectItem, index) => {
              let projectName = this.props.projectNames && this.props.projectNames[projectItem.id] ? this.props.projectNames[projectItem.id].name : ''
              return (

                  <Link className={"sidebar-row group-row flx flx-row flx-align-center " + (this.props.projectId === projectItem.id ? 'active' : '')} key={projectItem.id} to={'/' + orgName + '/' + projectItem.id}>
                    <div className="sidebar-icon flx flx-center-all">
                      {<DotJewel threadCount={threadCounts[projectItem.id]} />}
                    </div> 
                    <div className="sidebar-project-name color--black">
                      {projectName}
                    </div>
                    {<ThreadCountJewel threadCount={threadCounts[projectItem.id]} />}
                  </Link>

              );
            })
          }
          <Link to={'/' + orgName + '/createList'} className="sidebar-row group-row flx flx-row flx-align-center">
            <div className="sidebar-icon flx flx-center-all">
              <div className="koi-ico --24 ico--add"></div> 
            </div>
            <div className="sidebar-project-name color--black"> 
              Add Group
            </div>
          </Link>

          <div className="sidebar-footer flx flx-col">

            <Link className="DN sidebar-row flx flx-row flx-align-center" to={'/' + orgName + '/invite'}>
                <div className="sidebar-icon flx flx-center-all">
                  <i className="material-icons color--primary md-24 opa-70">accessibility_new
                  </i>
                </div>
                <div className="co-type-label color--white">Invite team members</div>

            </Link>

           

            <div className="flx flx-row flx-align-center w-100">

              <Link className="sidebar-row group-triplet flx flx-col flx-align-center" to={`/${this.props.orgName}/user/${this.props.orgUser.username}`} activeClassName="active">
                <div className="mrgn-bottom-xs flx flx-center-all">
                  <ProfilePic className="center-img" src={this.props.orgUser.image}/>
                </div>
                <div className="co-type-label color--black">{this.props.orgUser.username}</div>
              </Link>

              <Link to={'/' + this.props.orgName + '/inbox'} activeClassName="active" className="sidebar-row group-triplet flx flx-col flx-align-center">
                  <div className="sidebar-icon--large flx flx-center-all">
                    <div className=""><InboxCounter inboxCount={inboxCount} className=""/></div>
                  </div>
                  <div className="co-type-label color--black">Activity</div>
              </Link>

              

              <Link activeClassName="active" className="sidebar-row group-triplet flx flx-col flx-align-center no-click DN">
                  <div className="sidebar-icon--large flx flx-center-all">
                    <div className="koi-ico ico--bookmark--tertiary opa-20"></div>
                  </div>
                  <div className="co-type-label color--white opa-40">Saved</div>
              </Link>

              <Link to={'/' + this.props.orgName + '/admin'} activeClassName="active" className="sidebar-row group-triplet flx flx-col flx-align-center">
                  <div className="sidebar-icon--large flx flx-center-all">
                    <div className="koi-ico ico--orgsettings--tertiary"></div>
                  </div>
                  <div className="co-type-label color--black">Team</div>
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