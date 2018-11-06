import React from 'react';
import * as Constants from '../constants';
import ProfilePic from './ProfilePic'
import { Link } from 'react-router'

const InviteLink = props => {
  // if this is a project, launch project invite
  if (props.projectId) {
    return (
      <Link onClick={props.onProjectInviteClick} className="info-row flx flx-row flx-align-center brdr-top pdding-top-md mrgn-top-md">
        <div className="sidebar-icon flx flx-center-all mrgn-left-xs">
          <div className="koi-ico --24 ico--add--secondary"></div>              
        </div>
        <div className="co-type-label color--primary"> 
          Add List Member
        </div>
      </Link>
    )
  }
  // if no project, then send to invite org
  else {
    return (
      <Link onClick={props.onOrgInviteClick} className="info-row flx flx-row flx-align-center brdr-top pdding-top-md mrgn-top-md"> 
        <div className="sidebar-icon flx flx-center-all mrgn-left-xs">
          <div className="koi-ico --24 ico--add--secondary"></div>              
        </div>
        <div className="co-type-label color--primary"> 
          Add Team Member
        </div>
      </Link>
      )
  }
}

const ProjectInfo = props => {
  let membersList = props.projectId ? props.projectMembers : props.orgMembers
  let orgName = props.org && props.org.name ? props.org.name : ''
  let orgURL = props.org && props.org.url ? props.org.url : ''
  return (
    <div className="project-info b--primary--10 flx flx-col flx-align-start">
      <div className="co-type-h3 mrgn-bottom-sm">{props.project ? props.project.name + ' Members' : orgName + ' Members'}</div>
      <div className="info-row flx flx-row thread-timestamp mrgn-bottom-sm w-100">
        <div>
          {(membersList || []).length + ' Members'}
        </div>

        <div className="flx-item-right">
          {props.project ? (props.project.isPublic ? 'Public' : 'Private') : ''}
        </div>
      </div>
      <div className="flx flx-col flx-align-start w-100">
        {
          (membersList || []).map((member, index) => {
            return (
              <Link className="info-row flx flx-row flx-align-center mrgn-bottom-sm" 
                key={member.userId} 
                to={'/' + orgURL + '/user/' + member.username}>
                <ProfilePic src={member.image} className="user-img center-img" /> 
                <div className="mrgn-left-md co-type-label">{member.username} {/*({member.fullName})*/}</div>
              </Link>
            );
          })
        }
        
        <InviteLink projectId={props.projectId} onProjectInviteClick={props.onProjectInviteClick} onOrgInviteClick={props.onOrgInviteClick} />

      </div>
    </div>
  );
};

export default ProjectInfo; 