import ReviewList from '../ReviewList';
import React from 'react';
import agent from '../../agent';
import { connect } from 'react-redux';
import * as Actions from '../../actions';

const YourFeedTab = props => {
  if (props.authenticated) {
    const clickHandler = ev => {
      ev.preventDefault();
      // props.onTabClick('feed', agent.Articles.feed());
      props.onTabClick('feed', props.userFeed);
    }

    return (
      <li className="nav-item">
        <a  href=""
            className={ props.tab === 'feed' ? 'nav-link active' : 'nav-link' }
            onClick={clickHandler}>
          Your Feed
        </a>
      </li>
    );
  }
  return null;
};

const GlobalFeedTab = props => {
  const clickHandler = ev => {
    ev.preventDefault();
    props.onTabClick('all', []);
  };
  return (
    <li className="page-title">
      <a
        href=""
        className={ props.tab === 'all' ? 'nav-link active' : 'nav-link' }
        onClick={clickHandler}>
        Recent
      </a>
    </li>
  );
};

const TagFilterTab = props => {
  if (!props.tag) {
    return null;
  }

  return (
    <li className="nav-item">
      <a href="" className="nav-link active">
        <i className="ion-pound"></i> {props.tag}
      </a>
    </li>
  );
};

const mapStateToProps = state => ({
  ...state.reviewList,
  authenticated: state.common.authenticated,
  tab: state.home.tab,
  userFeed: state.home.userFeed
});

// const mapDispatchToProps = dispatch => ({
//   onSetPage: (tab, p) => dispatch({
//     type: 'SET_PAGE',
//     page: p,
//     payload: tab === 'feed' ? agent.Articles.feed(p) : agent.Articles.all(p)
//   }),
//   onTabClick: (tab, payload) => dispatch({ type: 'CHANGE_TAB', tab, payload })
// });

const MainView = props => {
  const onSetPage = page => props.onSetPage(props.tab, page);
  return (
    <div className="col-md-12">
      <div className="feed-toggle">
        <ul className="nav nav-pills outline-active">

          <YourFeedTab
            authenticated={props.authenticated}
            tab={props.tab}
            onTabClick={props.onMainViewTabClick} />

          <GlobalFeedTab tab={props.tab} onTabClick={props.onMainViewTabClick} />

          <TagFilterTab tag={props.tag} />

        </ul>
      </div>

      <ReviewList
        reviews={props.userFeed}
        reviewsCount={props.reviewsCount}
        currentPage={props.currentPage}
        onSetPage={onSetPage} />
    </div>
  );
};

export default connect(mapStateToProps, Actions)(MainView);