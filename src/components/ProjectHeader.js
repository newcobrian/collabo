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
          
            {/* Project Name and Member Full Left Wrapper */}
            <div className="project-header-row co-type-h1 flx flx-row flx-align-center color--black">
              
              {/* Stacked Wrapper */}
              <div className="flx flx-col flx-just-start">
                {/* Project Name */}
                <div className="project-header-text">{props.project.name}</div>
                {/* Members Info Wrapper */}
                <div className="flx flx-row flx-align-center">
                  <Link onClick={props.openProjectSettings} className="flx flx-row flx-center-all mrgn-right-xs"> 
                    <div className="koi-type-body--sm color--utsuri opa-100 mrgn-right-xs text-hover">{(membersList || []).length}</div>
                    <div className="koi-ico --24 ico--user color--utsuri opa-50"></div>
                  </Link>
                  {
                    props.orgUser && props.orgUser.role !== Constants.GUEST_ROLE && 
                      <Link onClick={props.onProjectInviteClick} className="koi-ico --24 ico--add--primary color--utsuri opa-50"> 
                      </Link>
                  }
                </div>
              </div>
            </div>

          {/* View Toggle and Compose Button Wrapper */}
          <div className="flx-item-right flx flx-row flx-center-all">
            
            {/* Toggle Wrapper */}
            <div className="flx flx-row flx-center-all mrgn-right-lg">

              {/* Full View Icon Wrapper */}
              <div className="flx flx-col flx-center-all mrgn-right-sm">
                <div className="koi-ico ico--toggle-full active"></div>
                <div className="koi-type-body--sm text-hover color--utsuri opa-50 mobile-hide">
                  Full View
                </div>
              </div>

              {/* List View Icon Wrapper */}
              <div className="flx flx-col flx-center-all">
                <div className="koi-ico ico--toggle-list"></div>
                <div className="koi-type-body--sm text-hover color--utsuri opa-50 mobile-hide">
                  List View
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


      </div>
    )
  }
  else return (
    <div className={"project-header with-shadow text-left flx flx-col flx-align-start w-100"}>
        <OrgHeader />
        <div className="project-bar-wrapper flx flx-row flx-align-center">
          <div className="project-header-row co-type-h1 flx flx-row flx-align-center color--black">
            <div className="group-icon flx flx-col flx-center-all flx-hold">
              <div className="co-logo flx-hold flx flx-col flx-center-all">
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