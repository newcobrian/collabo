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
        <Link to={'/' + orgName + '/invite'}>
          <div className="nav-text flx flx-row flx-align-center mrgn-bottom-sm">
            <i className="material-icons color--success md-18 opa-100 mrgn-right-sm">child_care</i>
            <div className="color--white">Invite team members</div>
          </div>
        </Link>
        <div className="v2-type-h4 mrgn-bottom-md">Projects</div>
        <Link to={'/' + orgName + '/addProject'}>
          <div className="nav-text flx flx-row flx-align-center mrgn-bottom-sm">
            <i className="material-icons color--success md-18 opa-100 mrgn-right-sm">create_new_folder</i>
            <div className="color--white">New Project</div>
          </div>
        </Link>
        {
          this.props.projectList.map((projectItem, index) => {
            return (
              <div className="mrgn-bottom-sm" key={projectItem.projectId}>
                <Link className="color--white v2-type-body flx flx-row flx-align-center" to={'/' + orgName + '/' + projectItem.projectId}>
                <i className="material-icons color--yellow md-18 opa-100 mrgn-right-sm">folder</i>

                {projectItem.name}
                </Link>
              </div>
            );
          })
        }
      </div>
    );
  }
}

export default connect(mapStateToProps, Actions)(ProjectList);