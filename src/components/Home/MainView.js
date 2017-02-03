import ReviewList from '../ReviewList';
import React from 'react';
import { connect } from 'react-redux';
import * as Actions from '../../actions';

const mapStateToProps = state => ({
  ...state.home,
  authenticated: state.common.authenticated
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
    <div>
      <ReviewList
        reviews={props.feed}
        reviewsCount={props.reviewsCount}
        currentPage={props.currentPage}
        onSetPage={onSetPage} 
        authenticated={props.authenticated} 
        like={props.likeReview} 
        unLike={props.unLikeReview} 
        save={props.saveReview} 
        unSave={props.unSaveReview}
        updateRating={props.onUpdateRating} />
    </div>
  );
};

export default connect(mapStateToProps, Actions)(MainView);