import React from 'react';
import { connect } from 'react-redux';
import { Link, browserHistory } from 'react-router';
import * as Actions from '../actions';
import * as Constants from '../constants';
import ProfilePic from './ProfilePic';

const ThreadCountJewel = props => {
  if (props.threadCount > 0) {
    return (
      <div className="group-badge badge-on color--red"> {props.threadCount}</div>
    );
  }
  return (
    <i className="material-icons color--black md-14 opa-10">fiber_manual_record

    </i>
  );
}
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

const mapStateToProps = state => ({
  ...state.projectList,
  currentUser: state.common.currentUser,
  authenticated: state.common.authenticated,
  userInfo: state.common.userInfo,
  orgName: state.organization.orgName,
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
  }

  render() {
    if (!this.props.orgName) {
      return null
    }

    // let orgName = this.props.org ?  this.props.org.name : ''
    let orgName = this.props.orgName
    let threadCounts = this.props.threadCounts || {}

    if(!this.props.projectList) {
      return null;
    }

    return (
      <div className="co-sidebar flx-col flx-item-left h-100">


        <div className="org-row flx flx-row flx-align-center">
          <Link to='/'  className="co-logo flx-hold">
            <img className="center-img" src="/img/logo_temp.png"/>
          </Link>
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
          <i className="material-icons org-arrow color--black md-18 flx-item-right">expand_more</i>
        </div> 

        
        <div className="sidebar-row sidebar-header flx flx-row flx-align-center DN">
          <div className="co-type-h5 color--black">Groups</div>
          <Link to={'/' + orgName + '/addProject'} className="label-big color--primary flx-item-right">
            Add Group
          </Link>
        </div>

          <Link className={"sidebar-row group-row flx flx-row mrgn-top-lg flx-align-center " + (!this.props.projectId && this.props.source === Constants.PROJECT_PAGE ? 'active' : '')} onClick={this.onAllClick}>
            <div className="sidebar-icon flx flx-center-all">
              <i className="material-icons color--black md-14 opa-10">fiber_manual_record
              </i>
            </div>
            <div className="co-type-project-name color--black opa-40 "> 
              All
            </div>
          </Link>

          {
            (this.props.projectList || []).map((projectItem, index) => {
              return (

                  <Link className={"sidebar-row group-row flx flx-row flx-align-center " + (this.props.projectId === projectItem.id ? 'active' : '')} key={projectItem.id} to={'/' + orgName + '/' + projectItem.id}>
                    <div className="sidebar-icon flx flx-center-all">
                      {<ThreadCountJewel threadCount={threadCounts[projectItem.id]} />}
                    </div> 
                    <div className="co-type-project-name color--black opa-40">
                    {projectItem.name}
                    </div>
                  </Link>

              );
            })
          }

          <Link to={'/' + orgName + '/addProject'} className="sidebar-row group-row mrgn-top-sm flx flx-row flx-align-center">
            <div className="sidebar-icon flx flx-center-all">
              <i className="material-icons color--black md-14">add
              </i>
            </div>
            <div className="co-type-project-name color--black opa-40 "> 
              Add Group
            </div>
          </Link>

          <div className="sidebar-footer flx flx-col">
            <Link className="sidebar-row flx flx-row flx-align-center" to={'/' + orgName + '/invite'}>
                <div className="sidebar-icon flx flx-center-all">
                  <i className="material-icons color--primary md-24 opa-70">accessibility_new
                  </i>
                </div>
                <div className="co-type-label color--black">Invite team members</div>

            </Link>


            <Link to={'/' + this.props.orgName + '/inbox'} activeClassName="active" className="sidebar-row flx flx-row flx-align-center">
                <div className="sidebar-icon flx flx-center-all"><InboxCounter unreadMessages={this.props.unreadMessages} /></div>
                <div className="co-type-label color--black">Activity</div>
            </Link>

            <Link className="sidebar-row flx flx-row flx-align-center" to={`/${this.props.orgName}/user/${this.props.userInfo.username}`} activeClassName="active">
              <div className="sidebar-icon"><ProfilePic className="center-img" src={this.props.userInfo.image}/></div>
              <div className="co-type-label color--black">{this.props.userInfo.username}</div>
            </Link>
          </div>

        </div>
    );
  }
}

export default connect(mapStateToProps, Actions)(ProjectList);