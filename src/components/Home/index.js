import Banner from './Banner';
import MainView from './MainView';
import React from 'react';
import Tags from './Tags';
import agent from '../../agent';
import { connect } from 'react-redux';
import Firebase from 'firebase';
import * as Actions from '../../actions';

const AUTH_ERROR = 'AUTH_ERROR';
const AUTH_USER = 'AUTH_USER';

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
    const tab = this.props.authenticated ? 'feed' : 'all';
    // const articlesPromise = this.props.token ?
    //   agent.Articles.feed() :
    //   agent.Articles.all();

    // this.props.onLoad(tab, Promise.all([agent.Tags.getAll(), articlesPromise]));
    this.props.onHomePageLoad(tab);
    this.props.getUserFeed(this.props.authenticated);
    // this.props.getGlobalFeed(this.props.authenticated);
  }

  componentWillUnmount() {
    this.props.unloadUserFeed(this.props.authenticated);
  }

  render() {
    return (
      <div className="home-page">


        <div className="roow">
            <MainView />
        </div>

      </div>


    );
  }
}

export default connect(mapStateToProps, Actions)(Home);