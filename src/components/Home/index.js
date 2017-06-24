import MainView from './MainView';
import React from 'react';
import { connect } from 'react-redux';
import * as Actions from '../../actions';
import * as Constants from '../../constants';
import { Link } from 'react-router';

const mapStateToProps = state => ({
  ...state.home,
  appName: state.common.appName,
  authenticated: state.common.authenticated
});

// const mapDispatchToProps = dispatch => ({
//   onClickTag: (tag, payload) =>
//     dispatch({ type: 'APPLY_TAG_FILTER', tag, payload }),
//   onLoad: (tab, payload) =>
//     dispatch({ type: 'HOME_PAGE_LOADED', tab, payload }),
//   onUnload: () =>
//     dispatch({  type: 'HOME_PAGE_UNLOADED' })
// });

class Home extends React.Component {
  constructor() {
    super();

    this.selectTab = tag => ev => {
      ev.preventDefault();
      this.props.applyTag(tag);
    }
  }

  componentWillMount() {
    this.props.getUserFeed(this.props.authenticated);
    this.props.sendMixpanelEvent('Friend feed loaded');
  }

  componentWillUnmount() {
    this.props.unloadUserFeed(this.props.authenticated);
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
          <MainView />
        </div>

      </div>


    );
  }
}

export default connect(mapStateToProps, Actions)(Home);
export { Home as Home, mapStateToProps as mapStateToProps };