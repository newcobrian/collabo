import React from 'react';
import { connect } from 'react-redux';
import * as Actions from '../actions';
import * as Constants from '../constants';
import TipList from './TipList';
import ProxyImage from './ProxyImage';
import ImagePicker from './ImagePicker';
import { Link } from 'react-router';
import LikeReviewButton from './LikeReviewButton';
import CommentContainer from './Review/CommentContainer'
import { ITINERARY_TYPE } from '../constants';

const EditItineraryLink = props => {
  if (props.isUser) {
    return (
      <Link
        to={'edit/' + props.itineraryId}
        className="v-button v-button--light">
         {/*<i className="ion-gear-a"></i>*/}Edit Itinerary
      </Link>
    );
  }
  return null;
};

const mapStateToProps = state => ({
  ...state.itinerary,
  currentUser: state.common.currentUser,
  authenticated: state.common.authenticated,
  userInfo: state.common.userInfo
});

class Itinerary extends React.Component {
  constructor() {
    super();
  }

  componentWillMount() {
    if (this.props.params.iid) {
      this.props.getItinerary(this.props.authenticated, this.props.params.iid);
      this.props.getItineraryComments(this.props.params.iid);
    }
    this.props.sendMixpanelEvent('Itinerary page loaded');
  }

  componentWillUnmount() {
    this.props.onItineraryUnload(this.props.itineraryId);
    this.props.unloadItineraryComments(this.props.itineraryId);
  }

  render() {
    if (!this.props.itinerary) {
      return (
        <div className="loading-module flx flx-center-all v2-type-body3">
          Loading Itinerary...
        </div>
      );
    }
    else {
      const itinerary = this.props.itinerary;
      const isUser = this.props.authenticated &&
      this.props.itinerary.userId === this.props.authenticated;
      return (
        <div className="flx flx-col flx-align-center page-common">
          <div className="content-wrapper itinerary flx flx-col flx-align-center">

            <div className="itinerary__summary option-stack mrgn-bottom-lg">

              <fieldset>
                <div className="flx flx-col flx-align-center mrgn-bottom-md">

                  {/*<div className="subject-image">
                    <ImagePicker images={this.props.itinerary.images} />
                  </div>*/}

                  {/* Authoer Photo */}
                  <div className="itinerary__summary__author-photo mrgn-bottom-sm">
                    <ProxyImage src={itinerary.createdBy.image} className="center-img" />
                  </div>
                  {/* Location */}
                  <div className="itinerary__summary__location v2-type-mono">
                    {itinerary.geo}
                  </div>

                  {/* Title */}
                  <div className="itinerary__summary__title v2-type-h1">
                    {itinerary.title}
                  </div>

                  {/* Description */}
                  <div className="itinerary__summary__description ta-center v2-type-h6 mrgn-top-sm mrgn-bottom-sm">
                    {itinerary.description}
                  </div>

                  {/* Like */}
                  <div className="flx flx-row-reverse v2-type-body2 mrgn-bottom-sm">
                    <div className="cta-wrapper cta-align-left">
                      <LikeReviewButton
                        authenticated={this.props.authenticated}
                        isLiked={itinerary.isLiked}
                        likesCount={itinerary.likesCount}
                        unLike={this.props.unLikeReview}
                        like={this.props.likeReview} 
                        likeObject={itinerary}
                        type={ITINERARY_TYPE} />
                    </div>
                  </div>

                  {/* Tips by Author */}
                  <div className="itinerary__summary__tip-count v2-type-body1 opa-40">
                    {itinerary.reviewsCount} Tips by {itinerary.createdBy.username}
                  </div>

                  {/* Last Modified Date */}
                  <div className="itinerary__summary__timestamp v2-type-caption opa-20">
                    {(new Date(itinerary.lastModified)).toLocaleString()}
                  </div>

                  <div>
                    <EditItineraryLink isUser={isUser} itineraryId={this.props.itineraryId} />
                  </div>
                </div>
               
                
              
              </fieldset>

            </div>

            <div className="itinerary__tipslist flx flx-col flx-align-center">
              <div>
                <TipList
                  reviewList={this.props.reviewList} 
                  reviewsCount={itinerary.reviewsCount}
                  authenticated={this.props.authenticated}
                  like={this.props.likeReview} 
                  unLike={this.props.unLikeReview}
                  userInfo={this.props.userInfo}
                  showModal={this.props.showModal}

                  updateRating={this.props.onUpdateRating}
                  onSetPage={this.onSetPage}
                  deleteReview={this.props.onDeleteReview} />
              </div>
            </div>

            <div className="itinerary__comments-module flx flx-col flx-align-center flx-just-start">
              <div className="v2-type-h3 mrgn-top-md ta-left w-100">
                Comments
              </div>
              <div className="v2-type-body2 mrgn-bottom-sm ta-left w-100 opa-40">
                What do you think about {itinerary.createdBy.username}'s View?
              </div>
              <CommentContainer
              authenticated={this.props.authenticated}
              userInfo={this.props.userInfo}
              type={ITINERARY_TYPE}
              comments={this.props.comments || []}
              errors={this.props.commentErrors}
              commentObject={this.props.itinerary}
              delete={this.props.onDeleteComment} />
            </div>


          </div>
        </div>
      )
    }
  }
}

export default connect(mapStateToProps, Actions)(Itinerary);