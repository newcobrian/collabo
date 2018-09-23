import React from 'react';
import * as Constants from '../constants';
import ProfilePic from './ProfilePic'

const ProjectInfo = props => {
  return (
    <div className="project-info flx flx-col flx-align-start">
      {/*<h1>{props.project ? props.project.name : props.orgName}</h1>*/}
      <h3 className="mrgn-bottom-sm">List Members</h3>
      <div className="info-row flx flx-row co-type-sub mrgn-bottom-sm w-100 opa-50">
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
              <div className="flx flx-row flx-align-center mrgn-bottom-sm" key={member.userId}>
                <ProfilePic src={member.image} className="user-img" /> 
                <div className="mrgn-left-sm co-type-body">{member.firstName} {member.lastName}</div>
              </div>
            );
          })
        }

      </div>
    </div>
  );
};

export default ProjectInfo; 