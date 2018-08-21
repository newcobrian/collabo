import { Link, browserHistory } from 'react-router';
import React from 'react';
import { connect } from 'react-redux';
import * as Actions from '../actions';
import * as Constants from '../constants';
import FirebaseSearchInput from './FirebaseSearchInput';

const mapStateToProps = state => ({
  authenticated: state.common.authenticated,
  orgName: state.organization.orgName,
  projectName: state.common.projectName,
  invalidOrgUser: state.common.invalidOrgUser,
  sidebarOpen: state.common.sidebarOpen
});

class OrgHeader extends React.Component {
  constructor() {
    super()

    this.onToggleSidebarClick = () => {
      this.props.setSidebar(!this.props.sidebarOpen)
    }

    this.searchInputCallback = result => {
      if (result.value && result.projectName) {
        browserHistory.push('/' + this.props.orgName + '/' + result.projectId + '/' + result.value);
      }
    }
  }

  render() {
    if (!this.props.orgName) {
      return null
    }

    return (
      <div className="flx flx-row w-100">
          <button onClick={this.onToggleSidebarClick}>
              Toggle sidebar
          </button>

          <FirebaseSearchInput 
            type={Constants.POSTS_SEARCH}
            callback={this.searchInputCallback}
            orgName={this.props.orgName}
            className={"flx-item-right"}
            placeholder="Type to search..." />
      </div>
    );
  }
}

export default connect(mapStateToProps, Actions)(OrgHeader);