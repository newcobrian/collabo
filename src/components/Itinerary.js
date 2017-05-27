import React from 'react';
import { connect } from 'react-redux';
import * as Actions from '../actions';
import * as Constants from '../constants';
import TipList from './TipList';
import ProxyImage from './ProxyImage';
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
      this.props.onItineraryLoad(this.props.authenticated, this.props.params.iid);
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
        <div>
          Loading...
        </div>
      );
    }
    else {
      const itinerary = this.props.itinerary;
      const isUser = this.props.authenticated &&
      this.props.itinerary.userId === this.props.authenticated;
      return (
        <div className="flx flx-row page-common flx-row-top">
          <div className="content-wrapper itinerary flx flx-row flx-row-start flx-col-start">

            <div className="itinerary__summary ta-left">

              <fieldset>
                <div className="flx flx-row mrgn-bottom-md">
                  <div className="itinerary__summary__author-photo">
                    <ProxyImage src={itinerary.createdBy.image} className="center-img" />
                  </div>
                  <div className="ta-left">
                    <div className="v2-type-mono">
                      {itinerary.geo}
                    </div>
                    <div className="v2-type-body1">
                      {itinerary.reviewsCount} Tips by {itinerary.createdBy.username}
                    </div>
                    <div className="v2-type-caption">
                      {(new Date(itinerary.lastModified)).toLocaleString()}
                    </div>
                    <div>
                      <Link to={`@${itinerary.createdBy.username}`}>
                        <div className="reviewer-photo DN center-img mrgn-right-lg mrgn-top-sm"><ProxyImage src={this.props.itinerary.createdBy.image}/></div>
                      </Link>
                    </div>
                  </div>
                  <div>
                    <EditItineraryLink isUser={isUser} itineraryId={this.props.itineraryId} />
                  </div>
                </div>

                <div className="v2-type-h1 subtitle">{itinerary.title}</div>

                <div className="v2-type-h6 mrgn-top-sm">
                  {itinerary.description}
                </div>
                <div className="flx flx-row-reverse v2-type-body2">
                  <div className="share">
                  </div>
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
                <div>
                  <CommentContainer
                  authenticated={this.props.authenticated}
                  userInfo={this.props.userInfo}
                  type={ITINERARY_TYPE}
                  comments={this.props.comments || []}
                  errors={this.props.commentErrors}
                  commentObject={this.props.itinerary}
                  delete={this.props.onDeleteComment} />
                </div>
              </fieldset>

            </div>

            <div className="flx flx-col itinerary__tips">
              <div>
                <TipList
                  reviewList={this.props.reviewList} 
                  reviewsCount={itinerary.reviewsCount}
                  authenticated={this.props.authenticated}
                  like={this.props.likeReview} 
                  unLike={this.props.unLikeReview}
                  userInfo={this.props.userInfo}

                  updateRating={this.props.onUpdateRating}
                  onSetPage={this.onSetPage}
                  deleteReview={this.props.onDeleteReview}
                  showModal={this.props.showModal} />
              </div>
            </div>


          </div>
        </div>
      )
    }
  }
}

export default connect(mapStateToProps, Actions)(Itinerary);