import React from 'react';
import { Link } from 'react-router';
import OrgHeader from './OrgHeader';

const ProjectHeader = props => {
  if (props.projectId) {
    if (!props.project) return null
    else return (
      <div className={"project-header brdr-bottom b--primary--20 text-left flx flx-col flx-align-start w-100"}>
        <OrgHeader />
        <div className="project-bar-wrapper flx flx-row flx-align-center fill--white brdr-right b--primary--20">
          <div className="project-header-row co-type-h1 flx flx-row flx-align-center color--black">
            <div className="project-header-text">{props.project.name}</div>
          </div>

          <Link to={'/' + props.orgName + '/addthread/' + props.projectId}
            className="flx flx-align-center pdding-left-sm flx-item-right mrgn-right-md">
              <div className="color--primary co-type-label mrgn-right-sm mobile-hide">Compose Thread</div>
              <div className="icon-wrapper flx flx-center-all fill--white brdr-all b--primary--20">
                <div className="koi-ico --24 ico--add--primary"></div>
              </div>
          </Link>

        </div>


      </div>
    )
  }
  else return (
    <div className={"project-header brdr-bottom b--primary--20 text-left flx flx-col flx-align-start w-100"}>
        <OrgHeader />
        <div className="project-bar-wrapper flx flx-row flx-align-center fill--white brdr-right b--primary--20">
          <div className="project-header-row co-type-h1 flx flx-row flx-align-center color--black">
            <div className="project-header-text">All Threads</div>
          </div>

            <Link to={'/' + props.orgName + '/addthread/'}
              activeClassName="active"
              className="flx flx-align-center pdding-left-sm flx-item-right mrgn-right-md">
              <div className="color--primary co-type-label mrgn-right-sm mobile-hide">Compose Thread</div>
              <div className="icon-wrapper flx flx-center-all fill--white brdr-all b--primary--20">
                <div className="koi-ico --24 ico--add--primary"></div>
              </div>
            </Link>
            
          </div>
          
        </div>
  )
}

export default ProjectHeader;