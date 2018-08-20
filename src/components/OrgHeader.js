import { Link, browserHistory } from 'react-router';
import React from 'react';

const mapStateToProps = state => ({
  authenticated: state.common.authenticated,
  orgName: state.common.orgName,
  invalidOrgUser: state.common.invalidOrgUser
});

class OrgHeader extends React.Component {
  constructor() {
    super()
    
    this.onToggleSidebarClick = () => {
      this.props.setSidebar(!this.props.sidebarOpen)
    }
  }

  render() {
    if (!this.props.orgName) {
      return null
    }

    return (
      <div>
          <button onClick={this.onToggleSidebarClick}>
              Toggle sidebar
          </button>
      </div>
    );
  }
}

export default OrgHeader;