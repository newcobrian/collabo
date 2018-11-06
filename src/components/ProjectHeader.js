import React from 'react';
import { Link } from 'react-router';
import OrgHeader from './OrgHeader';
import ProfilePic from './ProfilePic';
import * as Constants from '../constants';

const ProjectHeader = props => {
  let membersList = props.projectId ? props.projectMembers : props.orgMembers

  if (props.projectId) {
    if (!props.project) return null
    else return (
      <div className={"project-header with-shadow text-left flx flx-col flx-align-start w-100"}>
        <OrgHeader />
        <div className="project-bar-wrapper flx flx-row flx-align-center">
          
            <div className="project-header-row co-type-h1 flx flx-row flx-align-center color--black">
              <div className="group-icon flx flx-col flx-center-all">
                <Link to='/'  className="co-logo flx-hold">
                  <img className="center-img" src="/img/logo_a.png"/>
                </Link>
              </div>
              <div className="flx flx-col flx-just-start">
                <div className="project-header-text">{props.project.name}</div>
                <div className="flx flx-row flx-align-center">
                  <div className="co-type-label color--black opa-70 mrgn-right-sm"> 
                    {(membersList || []).length + ' Members'}
                  </div>
                  <Link onClick={props.onProjectInviteClick} className="co-type-label color--black opa-70"> 
                      Add Member
                  </Link>
                </div>
              </div>
            </div>

            

          <Link to={'/' + props.orgName + '/addthread/' + props.projectId}
            className="flx flx-col flx-center-all koi-button-fancy-wrapper flx-item-right mrgn-right-md border--seaweed">
              <div className="koi-button-fancy-outer">
              </div>
              <div className="koi-button-fancy-inner">
              </div>
              <div className="koi-button-fancy-text color--seaweed">
                Compose Thread
              </div>
          </Link>

        </div>


      </div>
    )
  }
  else return (
    <div className={"project-header with-shadow text-left flx flx-col flx-align-start w-100"}>
        <OrgHeader />
        <div className="project-bar-wrapper flx flx-row flx-align-center">
          <div className="project-header-row co-type-h1 flx flx-row flx-align-center color--black">
            <div className="group-icon flx flx-col flx-center-all">
              <div className="co-logo flx-hold">
                <img className="center-img" src="/img/logo_a.png"/>
              </div>
            </div>
            <div className="project-header-text">All Threads</div>
          </div>

          <Link to={'/' + props.orgName + '/addthread/'}
            activeClassName="active"
            className="flx flx-col flx-center-all koi-button-fancy-wrapper flx-item-right mrgn-right-md border--seaweed">
              <div className="koi-button-fancy-outer">
              </div>
              <div className="koi-button-fancy-inner">
              </div>
              <div className="koi-button-fancy-text color--seaweed">
                Compose Thread
              </div>
          </Link>
          
        </div>
        
      </div>
  )
}

export default ProjectHeader;