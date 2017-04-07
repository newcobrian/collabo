import { Home, mapStateToProps } from '/';
import React from 'react';
import { connect } from 'react-redux';
import * as Actions from '../../actions';
import * as Constants from '../../constants';
import { Link } from 'react-router';

class SavesFeed extends Home {
  componentWillMount() {
    this.props.getLikesOrSavesByUser(this.props.authenticated, this.props.authenticated, Constants.SAVES_BY_USER_PATH);
    this.props.sendMixpanelEvent('Saves feed loaded');
  }

  componentWillUnmount() {
    this.props.unloadLikesOrSavesByUser(this.props.authenticated, Constants.SAVES_BY_USER_PATH);
  }

  renderTabs() {
    if (this.props.authenticated) {
      return (
        <div>
          <div className="page-title-wrapper center-text">
            <div className="v2-type-h2 subtitle">Keep track of reviews for later 🐿</div>
          </div>
          <ul className="nav nav-pills outline-active tag-bar">
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
    }
  }
}

export default connect(mapStateToProps, Actions)(SavesFeed);