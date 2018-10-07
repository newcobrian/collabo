import React from 'react';
import { Link } from 'react-router';
import OrgHeader from './OrgHeader';

const ProjectHeader = props => {
  if (props.projectId) {
    if (!props.project) return null
    else return (
      <div className={"project-header brdr-bottom brdr-color--primary--10 text-left flx flx-col flx-align-start w-100"}>
        <OrgHeader />
        <div className="project-bar-wrapper flx flx-row flx-align-center fill--white">
          <div className="project-header-row co-type-h1 flx flx-row flx-align-center color--black">
            <div className="project-header-text">{props.project.name}</div>
          </div>

          <Link to={'/' + props.orgName + '/' + props.projectId + '/addthread'}
            className="flx flx-align-center pdding-left-sm flx-item-right mrgn-right-md">
              <div className="color--secondary co-type-label mrgn-right-sm">Compose Thread</div>
              <div className="icon-wrapper flx flx-center-all">
                <div className="koi-ico --36 ico--add--primary"></div>
              </div>
          </Link>

        </div>


      </div>
    )
  }
  else return (
    <div className={"project-header brdr-bottom brdr-color--primary--10 text-left flx flx-col flx-align-start w-100"}>
        <OrgHeader />
        <div className="project-bar-wrapper flx flx-row flx-align-center fill--white">
          <div className="project-header-row co-type-h1 flx flx-row flx-align-center color--black">
            <div className="project-header-text">All Updates</div>
          </div>

            <Link to={'/' + props.orgName + '/' + props.projectId + '/addthread'}
              activeClassName="active"
              className="flx flx-align-center pdding-left-sm flx-item-right mrgn-right-md">
              <div className="color--secondary co-type-label mrgn-right-sm">Compose Thread</div>
              <div className="icon-wrapper flx flx-center-all">
                <div className="koi-ico --36 ico--add--primary"></div>
              </div>
            </Link>
            
          </div>
          
        </div>
  )
}

export default ProjectHeader;