import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import * as Actions from '../actions';
import * as Constants from '../constants';



const mapStateToProps = state => ({
  ...state.projectList,
  currentUser: state.common.currentUser,
  authenticated: state.common.authenticated,
  userInfo: state.common.userInfo
});

class ProjectList extends React.Component {
  constructor() {
    super();
  }

  render() {
    let orgName = this.props.org ?  this.props.org.name : ''
    if(!this.props.projectList) return null;
    return (
      <div className="project-sidebar flx-item-left">
        <div className="v2-type-h4 mrgn-bottom-md color--black">Org Name</div>
        <Link to={'/' + orgName + '/addProject'}>
          <div className="nav-text flx flx-row flx-align-center mrgn-bottom-sm mrgn-bottom-md">
            <i className="material-icons color--black md-18 opa-100 mrgn-right-sm">add</i>
            <div className="color--black label-big">New Project</div>
          </div>
        </Link>
        {
          this.props.projectList.map((projectItem, index) => {
            return (
              <div className="mrgn-bottom-md mrgn-top-md" key={projectItem.projectId}>
                <Link className="color--black label-big opa-80 flx flx-row flx-align-center" to={'/' + orgName + '/' + projectItem.projectId}>
                <i className="material-icons color--black md-18 opa-100 mrgn-right-sm">fiber_manual_record
</i>

                {projectItem.name}
                </Link>
              </div>
            );
          })
        }
        <Link to={'/' + orgName + '/invite'}>
          <div className="nav-text flx flx-row flx-align-center mrgn-bottom-sm">
            <i className="material-icons color--black md-18 opa-100 mrgn-right-sm">child_care</i>
            <div className="color--black label-big">Invite team members</div>
          </div>
        </Link>
      </div>
    );
  }
}

export default connect(mapStateToProps, Actions)(ProjectList);