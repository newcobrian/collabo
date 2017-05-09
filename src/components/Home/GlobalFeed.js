import { Home, mapStateToProps } from '/';
import React from 'react';
import { connect } from 'react-redux';
import * as Actions from '../../actions';
import * as Constants from '../../constants';
import { Link } from 'react-router';

class GlobalFeed extends Home {
  componentWillMount() {
    this.props.getGlobalFeed(this.props.authenticated, this.props.tag);
    this.props.sendMixpanelEvent('Global feed loaded');
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
        <div className="page-title-container">
          <div className="page-title-wrapper center-text">
            <div className="v2-type-h2 subtitle">WELCOME TO TRIPOOPOO</div>
          </div>
          <ul className="nav nav-pills outline-active tag-bar">
            <li className="nav-item">
              <Link
                className="nav-link"
                to={``}>
                Friends
              </Link>
            </li>

            <li className="nav-item">
              <Link
                className="nav-link active"
                to={`global`}>
                Everyone
              </Link>
            </li>
            <li className="nav-item">
              <a href='#'
                className={"nav-link " + (this.props.tag ? '' : 'active')}
                onClick={this.selectTab(null)}>
                All
              </a>
            </li>
            {Constants.TAG_LIST.map(item => {
              return (
                    <li className="nav-item">
                      <a href='#'
                        className={"nav-link " + (this.props.tag === item ? 'active' : '')}
                        onClick={this.selectTab(item)}>
                        {item}
                      </a>
                    </li>
                );
            })}
          </ul>
        </div>
      );
    }
    else {
      return (
        <div className="page-title-container">
          <div className="page-title-wrapper center-text">
            <div className="v2-type-h2 subtitle">WELCOME TO TRIPOOPOO</div>
            <div className="v2-type-body1 opa-60">Get solid reviews from dope people you trust.</div>
          </div>
        </div>
      )
    }
  }
}

export default connect(mapStateToProps, Actions)(GlobalFeed);