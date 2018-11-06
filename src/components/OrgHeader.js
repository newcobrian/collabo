import { Link, browserHistory } from 'react-router';
import React from 'react';
import { connect } from 'react-redux';
import * as Actions from '../actions';
import * as Constants from '../constants';
import FirebaseSearchInput from './FirebaseSearchInput';

const mapStateToProps = state => ({
  authenticated: state.common.authenticated,
  org: state.projectList.org,
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
        browserHistory.push('/' + this.props.org.name + '/' + result.projectId + '/' + result.value);
      }
    }
    
  }

  render() {
    if (!this.props.org || !this.props.org.name) {
      return null
    }

    return (
      <div className="org-header flx flx-row w-100 flx-align-center">
          <Link onClick={this.onToggleSidebarClick} className="icon-wrapper flx flx-center-all">
            <div className="koi-ico ico--hamburger"></div>
          </Link>
          <div className="co-search-wrapper mrgn-left-sm flx flx-row DN">
            <div className="icon-wrapper flx flx-center-all opa-30">
              <i className="material-icons color--black md-18 opa-30">search</i>
            </div>
          <FirebaseSearchInput 
            type={Constants.POSTS_SEARCH}
            callback={this.searchInputCallback}
            orgName={this.props.org.url}
            className={""}
            placeholder="Type to search..." />
          </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, Actions)(OrgHeader);