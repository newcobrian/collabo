import React from 'react';
import { connect } from 'react-redux';
import * as Actions from '../actions';
import * as Constants from '../constants';
import TipList from './TipList';
import ProxyImage from './ProxyImage';
import { Link } from 'react-router';

const mapStateToProps = state => ({
  ...state.itinerary,
  authenticated: state.common.authenticated
});

class Itinerary extends React.Component {
  constructor() {
    super();
  }

  componentWillMount() {
    if (this.props.params.iid) {
      return this.props.onItineraryLoad(this.props.params.iid);
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
      return (
        <div className="roow roow-col roow-center-all page-common editor-page create-page">
          <div className="page-title-wrapper center-text">
            <div className="v2-type-h1 subtitle">{this.props.itinerary.title}</div>
            <fieldset>
              <div className="v2-type-body1">
                {this.props.itinerary.geo}
              </div>
              <div className="v2-type-body1">
                4 Tips by {this.props.itinerary.createdBy.username}
              </div>
              <div className="v2-type-time">
                Updated 2 hrs ago
              </div>
              <div>
                <Link to={`@${this.props.itinerary.createdBy.username}`}>
                  <div className="reviewer-photo DN center-img mrgn-right-lg mrgn-top-sm"><ProxyImage src={this.props.itinerary.createdBy.image}/></div>
                </Link>
              </div>
              <div className="v2-type-h6">
                {this.props.itinerary.description}
              </div>
            </fieldset>
          </div>
          <div className="roow roow-col roow-center-all page-common editor-page">


                <div>
                  <TipList
                    reviews={this.props.reviews} 
                    reviewsCount={this.props.itinerary.reviewsCount}
                    authenticated={this.props.authenticated}

                    like={this.props.likeReview} 
                    unLike={this.props.unLikeReview}
                    save={this.props.saveReview} 
                    unSave={this.props.unSaveReview}
                    currentPage={this.props.currentPage}
                    updateRating={this.props.onUpdateRating}
                    onSetPage={this.onSetPage}
                    deleteReview={this.props.onDeleteReview}
                    showModal={this.props.showModal} />
                </div>
          </div>
        </div>
      )
    }
  }
}

export default connect(mapStateToProps, Actions)(Itinerary);