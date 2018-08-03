import React from 'react';
import { connect } from 'react-redux';
import { Link, browserHistory } from 'react-router';
import * as Actions from '../actions';
import * as Constants from '../constants';

const ThreadCountJewel = props => {
  if (props.threadCount > 0) {
    return (
      <div className="count-badge header-badge badge-on"> {props.threadCount}</div>
    );
  }
  return null;
    // <div className="count-badge header-badge opa-50">0</div>
}

const mapStateToProps = state => ({
  ...state.projectList,
  currentUser: state.common.currentUser,
  authenticated: state.common.authenticated,
  userInfo: state.common.userInfo
});

class ProjectList extends React.Component {
  constructor() {
    super();

    this.onOrgChange = ev => {
      ev.preventDefault();
      browserHistory.push('/' + ev.target.value)
    }
  }

  render() {
    let orgName = this.props.org ?  this.props.org.name : ''
    let threadCounts = this.props.threadCounts || {}
    if(!this.props.projectList) return null;
    return (
      <div className="project-sidebar flx-item-left">
        <div className="v2-type-h4 mrgn-bottom-md color--black DN">{orgName}</div>
        <select onChange={this.onOrgChange}>
          <option value={orgName}>{orgName}</option>
          {(this.props.orgList || []).map((orgItem, index) => {
            if (orgItem && orgItem.name && orgName && orgItem.name.toLowerCase() !== orgName.toLowerCase()) {
              return (
                <option key={index} value={orgItem.name}>{orgItem.name}</option>  
              )
            }
          })}
        </select> 
        <Link to={'/' + orgName + '/addProject'}>
          <div className="nav-text flx flx-row flx-align-center mrgn-bottom-sm mrgn-bottom-md">
            <i className="material-icons color--black md-18 opa-100 mrgn-right-sm">add</i>
            <div className="color--black label-big">New Project</div>
          </div>
        </Link>
        <div className="mrgn-bottom-md mrgn-top-md">
          <Link className="color--black label-big opa-80 flx flx-row flx-align-center" to={'/' + orgName}>
            <i className="material-icons color--black md-18 opa-100 mrgn-right-sm">fiber_manual_record</i>
              All
          </Link>
        </div>
        {
          (this.props.projectList || []).map((projectItem, index) => {
            return (
              <div className="mrgn-bottom-md mrgn-top-md" key={projectItem.id}>
                <Link className="color--black label-big opa-80 flx flx-row flx-align-center" to={'/' + orgName + '/' + projectItem.id}>
                <i className="material-icons color--black md-18 opa-100 mrgn-right-sm">fiber_manual_record
</i>

                {projectItem.name} {<ThreadCountJewel threadCount={threadCounts[projectItem.id]} />}
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