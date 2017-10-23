import { Home, mapStateToProps } from '/';
import React from 'react';
import { connect } from 'react-redux';
import * as Actions from '../../actions';
import * as Constants from '../../constants';
import { Link } from 'react-router';
import MainView from './MainView';

class GlobalFeed extends Home {
  componentWillMount() {
    if (this.props.authenticated) {
      this.props.watchGlobalFeed(this.props.authenticated, null);
    }
    else {
      this.props.loadSampleGuides(this.props.authenticated);
    }

    this.props.sendMixpanelEvent('Global feed loaded');
  }

  componentWillUnmount() {
    if (this.props.authenticated) {
      this.props.unwatchGlobalFeed(this.props.authenticated);
    }
    else {
      this.props.unloadSampleGuides(this.props.authenticated);
    }
  }

  onPrevClick = ev => {
    this.props.unwatchGlobalFeed(this.props.authenticated, this.props.currentDateIndex)
    this.props.watchGlobalFeed(this.props.authenticated, this.props.previousDateIndex)
  }

  onNextClick = ev => {
    this.props.unwatchGlobalFeed(this.props.authenticated, this.props.currentDateIndex)
    this.props.watchGlobalFeedStartAt(this.props.authenticated, this.props.currentDateIndex)
  }

  // onSetPage(page) {
  // 	// const promise = agent.Articles.favoritedBy(this.props.profile.username, page);
  // 	// this.props.onSetPage(page, promise);
  // }

  renderTabs() {
    return (
      <div className="feed-toggle friend-popular-toggle flx flx-row flx-just-center w-100">
        <ul className="nav nav-pills outline-active flx flx-row">
          <li className="nav-item">
            <Link
              className="nav-link"
              to="/">
              Friends
            </Link>
          </li>
          <li className="nav-item">
            <Link
              className="nav-link active"
              to="/global">
              Everyone
            </Link>
          </li>
        </ul>
      </div>
    )
  }
}

export default connect(mapStateToProps, Actions)(GlobalFeed);