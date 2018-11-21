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
              <div className="group-icon flx flx-col flx-center-all flx-hold">
                <Link to='/'  className="co-logo flx-hold">
                  <img className="center-img" src="/img/logo_a.png"/>
                </Link>
              </div>
              <div className="flx flx-col flx-just-start">
                <div className="project-header-text">{props.project.name}</div>
                <div className="flx flx-row flx-align-center">
                  <Link onClick={props.openProjectSettings} className="koi-type-body--sm color--utsuri opa-100 mrgn-right-sm text-hover"> 
                    {(membersList || []).length + ' Members'}
                  </Link>
                  <Link onClick={props.onProjectInviteClick} className="koi-type-body--sm text-hover color--utsuri opa-100"> 
                      Add Member
                  </Link>
                </div>
              </div>
            </div>

            

          <Link to={'/' + props.orgURL + '/addthread/' + props.projectId}
            className="flx flx-col flx-center-all koi-button-fancy-wrapper flx-item-right mrgn-right-md border--seaweed">
              <div className="koi-button-fancy-outer">
              </div>
              <div className="koi-button-fancy-inner">
              </div>
              <div className="koi-button-fancy-text color--seaweed">
                <div className="mobile-hide">Compose Thread</div>
                <div className="mobile-show">New</div>
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
            <div className="group-icon flx flx-col flx-center-all flx-hold">
              <div className="co-logo flx-hold">
                <img className="center-img" src="/img/logo_a.png"/>
              </div>
            </div>
            <div className="project-header-text">All Threads</div>
          </div>

          <Link to={'/' + props.orgURL + '/addthread/'}
            activeClassName="active"
            className="flx flx-col flx-center-all koi-button-fancy-wrapper flx-item-right mrgn-right-md border--seaweed">
              <div className="koi-button-fancy-outer">
              </div>
              <div className="koi-button-fancy-inner">
              </div>
              <div className="koi-button-fancy-text color--seaweed">
                <div className="mobile-hide">Compose Thread</div>
                <div className="mobile-show">New</div>
              </div>
          </Link>
          
        </div>
        
      </div>
  )
}

export default ProjectHeader;