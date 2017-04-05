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
    // const tab = this.props.authenticated ? 'feed' : 'all';
    // const articlesPromise = this.props.token ?
    //   agent.Articles.feed() :
    //   agent.Articles.all();

    // this.props.onLoad(tab, Promise.all([agent.Tags.getAll(), articlesPromise]));
    this.props.getUserFeed(this.props.authenticated, this.props.tag);
    this.props.sendMixpanelEvent('Friend feed loaded');
  }

  componentWillUnmount() {
    this.props.unloadUserFeed(this.props.authenticated);
  }

  renderTabs() {
    return (
      <div className="page-title-container">
        <div className="page-title-wrapper center-text">
          <div className="v2-type-h2 subtitle">The latest reviews from around the globe</div>
        </div>

        <ul className="nav nav-pills outline-active tag-bar">
          <li className="nav-item">
            <Link
              className="nav-link active"
              to={``}>
              Friends
            </Link>
          </li>

          <li className="nav-item">
            <Link
              className="nav-link"
              to={`global`}>
              Everyone
            </Link>
          </li>
          <li className="nav-divider">
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

  render() {
    return (
      <div className="home-page">
            <div className="roow">
              <div className="feed-toggle roow roow-row-center">
                {this.renderTabs()}
              </div>
              <div className="feed-wrapper">
                <MainView />
              </div>

            </div>
      </div>


    );
  }
}

export default connect(mapStateToProps, Actions)(Home);
export { Home as Home, mapStateToProps as mapStateToProps };