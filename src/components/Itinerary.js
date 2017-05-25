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
      return (
        <div className="roow roow-row page-common roow-center">
          <div className="content-wrapper itinerary roow roow-row-top">

            <div className="itinerary__summary ta-left">

              <fieldset>
                <div className="roow roow-row mrgn-bottom-md">
                  <div className="itinerary__summary__author-photo">
                    <ProxyImage src={this.props.itinerary.createdBy.image} className="center-img" />
                  </div>
                  <div className="ta-left">
                    <div className="v2-type-mono">
                      {this.props.itinerary.geo}
                    </div>
                    <div className="v2-type-body1">
                      4 Tips by {this.props.itinerary.createdBy.username}
                    </div>
                    <div className="v2-type-caption">
                      Updated 2 hrs ago
                    </div>
                    <div>
                      <Link to={`@${this.props.itinerary.createdBy.username}`}>
                        <div className="reviewer-photo DN center-img mrgn-right-lg mrgn-top-sm"><ProxyImage src={this.props.itinerary.createdBy.image}/></div>
                      </Link>
                    </div>
                  </div>
                </div>

                <div className="v2-type-h1 subtitle">{this.props.itinerary.title}</div>

                <div className="v2-type-h6 mrgn-top-sm">
                  {this.props.itinerary.description}
                </div>
              </fieldset>

            </div>

            <div className="roow roow-col itinerary__tips">
              <div>
                <TipList
                  reviews={this.props.reviews} 
                  reviewsCount={this.props.itinerary.reviewsCount}
                  authenticated={this.props.authenticated}
                  like={this.props.likeReview} 
                  unLike={this.props.unLikeReview}

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