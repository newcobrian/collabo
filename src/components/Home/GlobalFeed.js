import { Home, mapStateToProps } from '/';
import React from 'react';
import { connect } from 'react-redux';
import * as Actions from '../../actions';
import { Link } from 'react-router';

class GlobalFeed extends Home {
  componentWillMount() {
    this.props.getGlobalFeed(this.props.authenticated);
  }

  componentWillUnmount() {
    this.props.unloadGlobalFeed(this.props.authenticated);
  }

  // onSetPage(page) {
  // 	// const promise = agent.Articles.favoritedBy(this.props.profile.username, page);
  // 	// this.props.onSetPage(page, promise);
  // }

  renderTabs() {
    if (this.props.authenticated) {
      return (
        <ul className="nav nav-pills outline-active">
          <li className="nav-item">
            <Link
              className="nav-link"
              to={``}>
              My Feed
            </Link>
          </li>

          <li className="nav-item">
            <Link
              className="nav-link active"
              to={`global`}>
              Global Feed
            </Link>
          </li>
        </ul>
      );
    }
    else {
      return (
        <ul className="nav nav-pills outline-active">
            <li className="nav-item">
              <Link
                className="nav-link active"
                to={`global`}>
                Global Feed
              </Link>
            </li>
          </ul>
      )
    };
  }
}

export default connect(mapStateToProps, Actions)(GlobalFeed);