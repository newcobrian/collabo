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
    props.onTabClick('all', props.globalFeed);
  };
  return (
    <li className="nav-item">
      <a
        href=""
        className={ props.tab === 'all' ? 'nav-link active' : 'nav-link' }
        onClick={clickHandler}>
        Discover New Stuff
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
  userFeed: state.home.userFeed,
  globalFeed: state.home.globalFeed
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
    <div className="feed-wrapper">
      <div className="feed-toggle roow roow-row-center">
        <ul className="nav nav-pills outline-active roow roow-row-left">

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
        onSetPage={onSetPage} 
        userId={props.authenticated} 
        like={props.likeReview} 
        unLike={props.unLikeReview} />
    </div>
  );
};

export default connect(mapStateToProps, Actions)(MainView);