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
                    <div className="koi-ico --24 ico--user color--utsuri opa-30"></div>
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
          { !props.threadId && 
            <div className="flx-item-right flx flx-row flx-center-all">
              
              {/* Toggle Wrapper */}
              <div className="flx flx-row flx-center-all mrgn-right-lg">

                {/* Full View Icon Wrapper */}
                <Link className="flx flx-col flx-center-all mrgn-right-sm" onClick={props.onToggleList(false)}>
                  <div className={"koi-ico ico--toggle-full" + (props.showListView ? '' : ' active')}></div>
                  <div className="koi-type-body--sm text-hover color--utsuri opa-50 mobile-hide">
                    Full View
                  </div>
                </Link>

                {/* List View Icon Wrapper */}
                <Link className="flx flx-col flx-center-all" onClick={props.onToggleList(true)}>
                  <div className={"koi-ico ico--toggle-list" + (props.showListView ? ' active' : '')}></div>
                  <div className="koi-type-body--sm text-hover color--utsuri opa-50 mobile-hide">
                    List View
                  </div>
                </Link>


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
          }
        </div>


      </div>
    )
  }
  else return (
    <div className={"project-header with-shadow text-left flx flx-col flx-align-start w-100"}>
        <OrgHeader />
        <div className="project-bar-wrapper flx flx-row flx-align-center">
          <div className="project-header-row co-type-h1 flx flx-row flx-align-center color--black">
            <div className="project-header-text">All Threads</div>
          </div>

          {/* View Toggle and Compose Button Wrapper */}
          <div className="flx-item-right flx flx-row flx-center-all">
            
            {/* Toggle Wrapper */}
            <div className="flx flx-row flx-center-all mrgn-right-lg">

              {/* Full View Icon Wrapper */}
              <Link className="flx flx-col flx-center-all mrgn-right-sm" onClick={props.onToggleList(false)}>
                <div className={"koi-ico ico--toggle-full" + (props.showListView ? '' : ' active')}></div>
                <div className="koi-type-body--sm text-hover color--utsuri opa-50 mobile-hide">
                  Full View
                </div>
              </Link>

              {/* List View Icon Wrapper */}
              <Link className="flx flx-col flx-center-all" onClick={props.onToggleList(true)}>
                <div className={"koi-ico ico--toggle-list" + (props.showListView ? ' active' : '')}></div>
                <div className="koi-type-body--sm text-hover color--utsuri opa-50 mobile-hide">
                  List View
                </div>
              </Link>

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
          {/* END: View Toggle and Compose Button Wrapper */}


          
          
        </div>
        
      </div>
  )
}

export default ProjectHeader;