import React from 'react';
import { connect } from 'react-redux';
import * as Actions from '../actions';
import * as Constants from '../constants';
import { Link } from 'react-router';

const mapStateToProps = state => ({
  ...state.location,
  authenticated: state.common.authenticated
});

class Location extends React.Component {
  constructor() {
    super();
  }

  componentWillMount() {
    this.props.sendMixpanelEvent('Location page loaded');
  }

  componentWillUnmount() {
    
  }

  renderTabs() {
    return (         
      <div className="feed-toggle w-max flx flx-row flx-just-start w-100 w-max">
        <ul className="nav nav-pills outline-active flx flx-row">
          <li className="nav-item">
            <Link
              className="nav-link active"
              to="">
              Global
            </Link>
          </li>
        </ul>
      </div>
    );
  }

  render() {
    return (
      <div className="home-page">
        <div className="page-title-wrapper center-text">
          <div className="v2-type-page-header">Explore</div>
          <div className="v2-type-body2 opa-60 mrgn-top-sm">All the latest itineries and travel lists</div>
        </div>
        <div className="toggle-wrapper DN">
          {/*this.renderTabs()*/}
        </div>
        <div className="feed-wrapper">
          
        </div>

      </div>


    );
  }
}

export default connect(mapStateToProps, Actions)(Location);