import { Home, mapStateToProps } from '/';
import React from 'react';
import { connect } from 'react-redux';
import * as Actions from '../../actions';
import * as Constants from '../../constants';
import { Link } from 'react-router';
import MainView from './MainView';


const RenderFriendEmpty = props => {
  return null;
}

class GlobalFeed extends Home {
  componentWillMount() {
    if (this.props.authenticated) {
      this.props.startLikesByUserWatch(this.props.authenticated);
      this.props.watchGlobalFeed(this.props.authenticated, null);
    }
    else {
      this.props.loadSampleGuides(this.props.authenticated);
    }

    this.props.sendMixpanelEvent(Constants.MIXPANEL_PAGE_VIEWED, { 'page name' : 'global feed'});
  }



  componentWillUnmount() {
    if (this.props.authenticated) {
      this.props.stopLikesByUserWatch(this.props.authenticated);
      this.props.unwatchGlobalFeed(this.props.authenticated, this.props.previousDateIndex);
    }
    else {
      this.props.unloadSampleGuides(this.props.authenticated);
    }
  }

  onPrevClick = ev => {
    ev.preventDefault()
    // this.props.unwatchGlobalFeed(this.props.authenticated, this.props.currentDateIndex)
    this.props.watchGlobalFeed(this.props.authenticated, this.props.previousDateIndex)
  }

  // onNextClick = ev => {
  //   ev.preventDefault()
  //   this.props.unwatchGlobalFeed(this.props.authenticated, this.props.currentDateIndex)
  //   this.props.watchGlobalFeedStartAt(this.props.authenticated, this.props.currentDateIndex)
  // }

  // onSetPage(page) {
  // 	// const promise = agent.Articles.favoritedBy(this.props.profile.username, page);
  // 	// this.props.onSetPage(page, promise);
  // }

  renderTabs() {
    return (
      <div className="v2-toolbar feed-toggle friend-popular-toggle flx flx-row flx-align-center">
        <div className="page-title-wrapper DN center-text country-color-">
          <div className="v2-type-page-header flx flx-col flx-center-all invert">
            Latest Travel Guides
          </div>
        </div>

        <ul className="nav nav-pills outline-active flx flx-row ta-center flx-center-all w-100">
          <li className="nav-item brdr-right">
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