import ReviewList from '../ReviewList';
import React from 'react';
import { connect } from 'react-redux';
import * as Actions from '../../actions';
import * as Constants from '../../constants';
import ItineraryList from './../ItineraryList';
import ItineraryPreview from './../ItineraryPreview';
import PopularPreview from './PopularPreview';

const mapStateToProps = state => ({
  ...state.home,
  authenticated: state.common.authenticated
});

const RenderFeaturedPreview = props => {
  if (props.featuredPreview) {
    return (
      <ItineraryPreview itinerary={props.featuredPreview}
        authenticated={props.authenticated} 
        like={props.like} 
        unLike={props.unLike}
        deleteItinerary={props.deleteItinerary}
        type={Constants.LARGE_GUIDE_PREVIEW} />
    )
  }
  return null;
}
 
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
      <div className="feed-wrapper fill--light-gray pdding-top-sm">
        <RenderFeaturedPreview
          featuredPreview={props.featuredPreview}
          authenticated={props.authenticated} 
          like={props.like} 
          unLike={props.unLike}
          deleteItinerary={props.deleteItinerary} />

        <PopularPreview 
          popularList={props.popularPreview}
          authenticated={props.authenticated} 
          like={props.like} 
          unLike={props.unLike}
          deleteItinerary={props.deleteItinerary} />

        <ItineraryList
          itineraries={props.itineraries} 
          authenticated={props.authenticated} 
          like={props.likeReview} 
          unLike={props.unLikeReview}
          deleteItinerary={props.showDeleteModal} />
        </div>
    </div>
  );
};

export default connect(mapStateToProps, Actions)(MainView);