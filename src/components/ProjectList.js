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
    <div className="sidebar-dot fill--primary"></div>
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
  if (props.unreadMessages > 0) {
    return (
      <div className="sidebar-dot fill--secondary active"></div>
    );
  }
  return (
    <div className="sidebar-dot fill--primary"></div>
  );
}

const mapStateToProps = state => ({
  ...state.projectList,
  currentUser: state.common.currentUser,
  authenticated: state.common.authenticated,
  userInfo: state.common.userInfo,
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
        browserHistory.push('/' + this.props.orgName + '/' + result.projectId + '/' + result.value);
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

    return (
      <div className="co-sidebar flx-col flx-item-left h-100">


        <div className="org-row flx flx-row flx-align-center DN">
          <Link to='/'  className="co-logo flx-hold">
            <img className="center-img" src="/img/logo_koi01.png"/>
          </Link>

          <Link className="flx flx-row flx-align-center flx-item-right" to={`/${this.props.orgName}/user/${this.props.userInfo.username}`} activeClassName="active">
            <div className="co-type-label color--black mrgn-right-sm">{this.props.userInfo.username}</div>
            <div className=""><ProfilePic className="center-img" src={this.props.userInfo.image}/></div>
          </Link>

        </div>
        <div className="org-row org-row-selector flx flx-row flx-align-center">

          <select className="org-selector co-type-org color--black" onChange={this.onOrgChange}>
            <option value={orgName}>{orgName}</option>
            {(this.props.orgList || []).map((orgItem, index) => {
              if (orgItem && orgItem.name && orgName && orgItem.name.toLowerCase() !== orgName.toLowerCase()) {
                return (
                  <option key={index} value={orgItem.name}>{orgItem.name}</option>  
                )
              }
            })}

          </select>
          <div className="org-arrow flx flx-center-all">
            <div className="koi-ico --24 ico--down opa-30"></div>
          </div>
        </div> 

        <div className="sidebar-row group-row flx flx-row mrgn-top-md flx-align-center">
          <div className="sidebar-icon flx flx-center-all">
            <div className="koi-ico --24 ico--search--primary"></div>
          </div>
          <FirebaseSearchInput 
            type={Constants.POSTS_SEARCH}
            callback={this.searchInputCallback}
            orgName={orgName}
            className={""}
            placeholder="Search" />
        </div>

        <Link className={"sidebar-row group-row flx flx-row mrgn-bottom-md flx-align-center " + (!this.props.projectId && this.props.source === Constants.PROJECT_PAGE ? 'active' : '')} onClick={this.onAllClick}>
          <div className="sidebar-icon flx flx-center-all">
            <div className="koi-ico --24 ico--allupdates--primary"></div>
          </div>
          <div className="co-type-project-name color--black"> 
            All Threads
          </div>
        </Link>

        <div className="sidebar-row mrgn-bottom-md mrgn-top-lg">
          <div className="co-type-h3 color--black w-100 pdding-bottom-sm brdr-bottom-thick">
            Lists
          </div>
        </div>
          {
            (this.props.projectList || []).map((projectItem, index) => {
              return (

                  <Link className={"sidebar-row group-row flx flx-row flx-align-center " + (this.props.projectId === projectItem.id ? 'active' : '')} key={projectItem.id} to={'/' + orgName + '/' + projectItem.id}>
                    <div className="sidebar-icon flx flx-center-all">
                      {<DotJewel threadCount={threadCounts[projectItem.id]} />}
                    </div> 
                    <div className="co-type-project-name color--black">
                      {this.props.projectNames[projectItem.id]}
                    </div>
                    {<ThreadCountJewel threadCount={threadCounts[projectItem.id]} />}
                  </Link>

              );
            })
          }

          <Link to={'/' + orgName + '/createList'} className="sidebar-row group-row flx flx-row flx-align-center">
            <div className="sidebar-icon flx flx-center-all">
              <div className="koi-ico --24 ico--add--secondary"></div>              
            </div>
            <div className="co-type-project-name color--secondary"> 
              Add List
            </div>
          </Link>

          <div className="sidebar-footer brdr-top brdr-color--primary flx flx-col">

            <Link className="DN sidebar-row flx flx-row flx-align-center" to={'/' + orgName + '/invite'}>
                <div className="sidebar-icon flx flx-center-all">
                  <i className="material-icons color--primary md-24 opa-70">accessibility_new
                  </i>
                </div>
                <div className="co-type-label color--black">Invite team members</div>

            </Link>


            <Link to={'/' + this.props.orgName + '/inbox'} activeClassName="active" className="sidebar-row group-row flx flx-row flx-align-center">
                <div className="sidebar-icon flx flx-center-all">
                  <InboxCounter unreadMessages={this.props.unreadMessages} />
                </div>
                <div className="co-type-label color--black">Activity</div>
                <div className="group-badge badge-on color--black flx-item-right thread-timestamp">{this.props.unreadMessages}</div>
            </Link>

            

            <Link activeClassName="active" className="sidebar-row group-row flx flx-row flx-align-center">
                <div className="sidebar-icon flx flx-center-all">
                  <div className="koi-ico --24 ico--bookmark--primary"></div>
                </div>
                <div className="co-type-label color--black">Saved Posts</div>
                <div className="group-badge badge-on color--black flx-item-right">
                </div>
            </Link>

            <Link to={'/' + this.props.orgName + '/admin'} activeClassName="active" className="sidebar-row group-row flx flx-row flx-align-center">
                <div className="sidebar-icon flx flx-center-all">
                  <div className="koi-ico --24 ico--orgsettings--primary"></div>
                </div>
                <div className="co-type-label color--black">Org Settings</div>
                <div className="group-badge badge-on color--black flx-item-right">
                </div>
            </Link>

            <Link className="sidebar-row group-row flx flx-row flx-align-center" to={`/${this.props.orgName}/user/${this.props.userInfo.username}`} activeClassName="active">
              <div className="sidebar-icon flx flx-center-all">
                <ProfilePic className="center-img" src={this.props.userInfo.image}/>
              </div>
              <div className="co-type-label color--black">{this.props.userInfo.username}</div>
            </Link>

            <div className="sidebar-row koi-sidebar-footer flx flx-row flx-align-center fill--primary mrgn-top-sm">
              <Link to='/' className="co-type-logo color--white">KOI</Link>
            </div>
          </div>

        </div>
    );
  }
}

export default connect(mapStateToProps, Actions)(ProjectList);