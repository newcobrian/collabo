import React from 'react';
import * as Constants from '../constants';
import ProfilePic from './ProfilePic'

const ProjectInfo = props => {
  return (
    <div className="project-info">
      <h1>{props.project ? props.project.name : props.orgName}</h1>

      <div>
        {(props.projectMembers || []).length + ' Members'}
      </div>

      <div>
        {props.project ? (props.project.isPublic ? 'Public' : 'Private') : ''}
      </div>

      <ul>
        {
          (props.projectMembers || []).map((member, index) => {
            return (
              <li key={member.userId}>
                <ProfilePic src={member.image} className="user-img" /> {member.firstName} {member.lastName}
              </li>
            );
          })
        }

      </ul>
    </div>
  );
};

export default ProjectInfo; 