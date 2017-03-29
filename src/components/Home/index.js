import MainView from './MainView';
import React from 'react';
import { connect } from 'react-redux';
import * as Actions from '../../actions';
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
  componentWillMount() {
    // const tab = this.props.authenticated ? 'feed' : 'all';
    // const articlesPromise = this.props.token ?
    //   agent.Articles.feed() :
    //   agent.Articles.all();

    // this.props.onLoad(tab, Promise.all([agent.Tags.getAll(), articlesPromise]));
    this.props.getUserFeed(this.props.authenticated);
    this.props.sendMixpanelEvent('Friend feed loaded');
  }

  componentWillUnmount() {
    this.props.unloadUserFeed(this.props.authenticated);
  }

  renderTabs() {
    return (
      <ul className="nav nav-pills outline-active">
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
      </ul>

    );
  }

  render() {
    return (
      <div className="home-page">
            <div className="roow">
              <div className="feed-wrapper">
                <div className="feed-toggle roow roow-row-center">
                  {this.renderTabs()}
                </div>
                <div className="feed-toggle tags-toggle roow roow-row-center">
                  <ul className="nav nav-pills outline-active">
                    <li className="nav-item">
                      <Link
                        className="nav-link active"
                        to={``}>
                        All
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link
                        className="nav-link"
                        to={`global`}>
                        Books
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link
                        className="nav-link"
                        to={`d`}>
                        Movies
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link
                        className="nav-link"
                        to={`global`}>
                        Places
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link
                        className="nav-link"
                        to={`d`}>
                        Food
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link
                        className="nav-link"
                        to={`global`}>
                        Music
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link
                        className="nav-link"
                        to={`d`}>
                        Health
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link
                        className="nav-link"
                        to={`global`}>
                        Electronics
                      </Link>
                    </li>
                  </ul>
                </div>

                
                <MainView />
              </div>

            </div>
      </div>


    );
  }
}

export default connect(mapStateToProps, Actions)(Home);
export { Home as Home, mapStateToProps as mapStateToProps };