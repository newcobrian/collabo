import React from 'react';
import { connect } from 'react-redux';
import * as Actions from '../actions';
import * as Constants from '../constants';
import TipList from './TipList';
import ProxyImage from './ProxyImage';
import { Link } from 'react-router';
import LikeReviewButton from './LikeReviewButton';
import { ITINERARY_TYPE } from '../constants';

const mapStateToProps = state => ({
  ...state.itinerary,
  currentUser: state.common.currentUser,
  authenticated: state.common.authenticated
});

class Itinerary extends React.Component {
  constructor() {
    super();
  }

  componentWillMount() {
    if (this.props.params.iid) {
      return this.props.onItineraryLoad(this.props.authenticated, this.props.params.iid);
    }
    this.props.sendMixpanelEvent('Itinerary page loaded');
  }

  componentWillUnmount() {
    this.props.onItineraryUnload(this.props.itineraryId);
  }

  render() {
    if (!this.props.itinerary) {
      return (
        <div>
          Itinerary doesn't exist!
        </div>
      );
    }
    else {
      const itinerary = this.props.itinerary;
      return (
        <div className="roow roow-row page-common roow-center">
          <div className="content-wrapper itinerary roow roow-row-top">

            <div className="itinerary__summary ta-left">

              <fieldset>
                <div className="roow roow-row mrgn-bottom-md">
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
                </div>

                <div className="v2-type-h1 subtitle">{itinerary.title}</div>

                <div className="cta-wrapper">
                  <div className="cta-icon cta-like">
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

                <div className="v2-type-h6 mrgn-top-sm">
                  {itinerary.description}
                </div>
              </fieldset>

            </div>

            <div className="roow roow-col itinerary__tips">
              <div>
                <TipList
                  reviewList={this.props.reviewList} 
                  reviewsCount={itinerary.reviewsCount}
                  authenticated={this.props.authenticated}
                  like={this.props.likeReview} 
                  unLike={this.props.unLikeReview}
                  currentUser={this.props.currentUser}

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