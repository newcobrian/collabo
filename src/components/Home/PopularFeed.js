import { Home, mapStateToProps } from '/';
import React from 'react';
import { connect } from 'react-redux';
import * as Actions from '../../actions';
import * as Constants from '../../constants';
import { Link } from 'react-router';
import MainView from './MainView';

class PopularFeed extends Home {
  componentWillMount() {
    this.props.watchPopularFeed(this.props.authenticated);
    this.props.sendMixpanelEvent('Popular feed loaded');
  }

  componentWillUnmount() {
    this.props.unwatchPopularFeed(this.props.authenticated);
  }

  renderHomepageFeatures() {
    return null;
  }
}

export default connect(mapStateToProps, Actions)(PopularFeed);