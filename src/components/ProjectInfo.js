import React from 'react';
import * as Constants from '../constants';
import ProfilePic from './ProfilePic'
import { Link } from 'react-router'

const ProjectInfo = props => {
  if (!props.project) {
    return null
  }
  else {
    return (
      <div className="project-info b--primary--10 flx flx-col flx-align-start">
        {/*<h1>{props.project ? props.project.name : props.orgName}</h1>*/}
        <div className="co-type-h3 mrgn-bottom-sm">List Members</div>
        <div className="info-row flx flx-row thread-timestamp mrgn-bottom-sm w-100">
          <div>
            {(props.projectMembers || []).length + ' Members'}
          </div>

          <div className="flx-item-right">
            {props.project ? (props.project.isPublic ? 'Public' : 'Private') : ''}
          </div>
        </div>
        <div className="flx flx-col flx-align-start w-100">
          {
            (props.projectMembers || []).map((member, index) => {
              return (
                <Link className="info-row flx flx-row flx-align-center mrgn-bottom-sm" 
                  key={member.userId} 
                  to={'/' + props.orgName + '/user/' + member.username}>
                  <ProfilePic src={member.image} className="user-img center-img" /> 
                  <div className="mrgn-left-md co-type-label">{member.username} {/*({member.fullName})*/}</div>
                </Link>
              );
            })
          }
          <Link to={'/' + props.orgName + '/' + props.projectId + '/invite'} className="info-row flx flx-row flx-align-center brdr-top pdding-top-md mrgn-top-md">
            <div className="sidebar-icon flx flx-center-all mrgn-left-xs">
              <div className="koi-ico --24 ico--add--secondary"></div>              
            </div>
            <div className="co-type-label color--secondary"> 
              Add Member
            </div>
          </Link>

        </div>
      </div>
    );
  }
};

export default ProjectInfo; 