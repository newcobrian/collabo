import Banner from './Banner';
import MainView from './MainView';
import React from 'react';
import Tags from './Tags';
import agent from '../../agent';
import { connect } from 'react-redux';
import Firebase from 'firebase';

const AUTH_ERROR = 'AUTH_ERROR';
const AUTH_USER = 'AUTH_USER';

const Promise = global.Promise;

const mapStateToProps = state => ({
  ...state.home,
  appName: state.common.appName,
  token: state.common.token
});

const mapDispatchToProps = dispatch => ({
  onClickTag: (tag, payload) =>
    dispatch({ type: 'APPLY_TAG_FILTER', tag, payload }),
  onLoad: (tab, payload) =>
    dispatch({ type: 'HOME_PAGE_LOADED', tab, payload }),
  onUnload: () =>
    dispatch({  type: 'HOME_PAGE_UNLOADED' })
});

class Home extends React.Component {
  componentWillMount() {
    // const tab = this.props.token ? 'feed' : 'all';
    // const articlesPromise = this.props.token ?
    //   agent.Articles.feed() :
    //   agent.Articles.all();

    // this.props.onLoad(tab, Promise.all([agent.Tags.getAll(), articlesPromise]));
  }

  componentWillUnmount() {
    this.props.onUnload();
  }

  render() {
    return (
      <div className="home-page">


        <div className="container page">
          <div className="reviews-wrapper row">
            <MainView />

            
          </div>
        </div>

      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);