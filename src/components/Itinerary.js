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
import ItineraryActions from './ItineraryActions';

import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';

import Timestamp from 'react-timestamp';


const EditItineraryLink = props => {
  if (props.isUser) {
    return (
      <Link
        to={'edit/' + props.itineraryId}
        className="vb vb--light vb--no-outline mrgn-right-md">
         {/*<i className="ion-gear-a"></i>*/}Edit
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

    this.loadItinerary = iid => {
      if (iid) {
        this.props.getItinerary(this.props.authenticated, iid);
        this.props.getItineraryComments(iid);
      }
      this.props.sendMixpanelEvent('Itinerary page loaded');
    }

    this.unloadItinerary = itineraryId => {
      this.props.onItineraryUnload(itineraryId);
      this.props.unloadItineraryComments(itineraryId);
    }
  }

  componentWillMount() {
    this.loadItinerary(this.props.params.iid);
  }

  componentWillUnmount() {
    this.unloadItinerary(this.props.itineraryId);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.params.iid !== this.props.params.iid) {
      this.unloadItinerary(this.props.itineraryId);
      this.loadItinerary(nextProps.params.iid);
    }
  }

  render() {
    if (!this.props.itinerary) {
      return (
        <div className="loading-module flx flx-center-all v2-type-body3">
          <div>Loading Itinerary...</div>
        </div>
      );
    }
    else if (this.props.itinerary.length === 0) {
      return (
        <div className="flx flx-center-all state--not-exist">
           <div>Itinerary doesn't exist</div>
        </div>
      )
    }
    else {
      const itinerary = this.props.itinerary;
      const isUser = this.props.authenticated &&
      this.props.itinerary.userId === this.props.authenticated;

      const canModify = this.props.authenticated && 
      this.props.authenticated === this.props.itinerary.userId;
      
      return (
        <div className="flx flx-col flx-align-center page-common page-itinerary">
          <div className="content-wrapper w-max itinerary flx flx-col flx-align-center">

            <div className="itinerary__summary option-stack">

              <fieldset>
                <div className="flx flx-col flx-just-start">
                  
                  <div className="flx flx-row flx-align-center mrgn-right-lg mrgn-bottom-md w-100 v2-type-body1">
                    {/* Author Photo */}
                    <div className="itinerary__summary__author-photo mrgn-right-md">
                      <ProxyImage src={itinerary.createdBy.image} className="center-img" />
                    </div>
                    <div className="itinerary__author-name ta-left v2-type-body1 mrgn-right-md">
                      {itinerary.createdBy.username}
                    </div>
                    {/* Flag */}
                    <div className="itinerary__summary__flag mrgn-right-md">
                    </div>
                    {/* Location */}
                    <div className="itinerary__summary__location opa-50 geo-type mrgn-right-lg">
                      {itinerary.geo.label}
                    </div>

                    {/* Tips by Author */}
                    <div className="itinerary__summary__tip-count opa-50 mrgn-right-sm">
                      {itinerary.reviewsCount} Tips
                    </div>

                    {/* Like */}
                    <div className="itinerary__summary__like flx flx-row flx-item-right v2-type-body2 mrgn-bottom-sm">
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
                  </div>
                  
                  {/* Right Module */}
                  <div className="itinerary__summary__wrapper flx flx-col flx-align-start flx-just-start ta-left w-100">

                    {/*<div className="subject-image">
                      <ImagePicker images={this.props.itinerary.images} />
                    </div>*/}

                    {/* Title */}
                    <div className="itinerary__summary__title v2-type-h1">
                      {itinerary.title}
                    </div>

                    {/* Description */}
                    <div className="itinerary__summary__description ta-left v2-type-body2 opa-60">
                      {itinerary.description}
                    </div>

                    {/* Date and Edit Module*/}
                    <div className="flx flx-row w-100 flx-just-start">
                      {/* Last Modified Date */}
                      <div className="itinerary__summary__timestamp v2-type-caption opa-20 mrgn-right-md">
                        {(new Date(itinerary.lastModified)).toLocaleString()}
                        {/*<Timestamp time={itinerary.lastModified} precision={1} format='ago' />*/}
                      </div>

                      <EditItineraryLink isUser={isUser} itineraryId={this.props.itineraryId} />

                      <ItineraryActions 
                        itinerary={itinerary} 
                        authenticated={this.props.authenticated} 
                        canModify={canModify} 
                        deleteItinerary={this.props.showDeleteModal} 
                        redirectPath="/" />
                    </div>

                    {/* Hidden edit itinerary dropdown */}
                    <div className="edit-itinerary-link DN">             
                      <MuiThemeProvider muiTheme={getMuiTheme()}>
                        <IconMenu
                           iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}
                           anchorOrigin={{horizontal: 'left', vertical: 'top'}}
                           targetOrigin={{horizontal: 'left', vertical: 'top'}}
                         >

                           <EditItineraryLink isUser={isUser} itineraryId={this.props.itineraryId} />

                           <ItineraryActions 
                             itinerary={itinerary} 
                             authenticated={this.props.authenticated} 
                             canModify={canModify} 
                             deleteItinerary={this.props.showDeleteModal} 
                             redirectPath="/" />

                         </IconMenu>

                       </MuiThemeProvider>
                    </div>

                  </div> {/* End right module */}
               </div>
                
              
              </fieldset>

            </div>

            <div className="itinerary__tipslist flx flx-col flx-align-center w-100">
              <div className="w-100">
                <TipList
                  reviewList={this.props.reviewList} 
                  reviewsCount={itinerary.reviewsCount}
                  authenticated={this.props.authenticated}
                  like={this.props.likeReview} 
                  unLike={this.props.unLikeReview}
                  userInfo={this.props.userInfo}
                  showModal={this.props.showModal}
                  deleteComment={this.props.onDeleteComment}

                  updateRating={this.props.onUpdateRating}
                  onSetPage={this.onSetPage}
                  deleteReview={this.props.onDeleteReview} />
              </div>
            </div>

            <div className="itinerary__comments-module flx flx-col flx-align-start flx-just-start">
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
              deleteComment={this.props.onDeleteComment} />
            </div>


          </div>
        </div>
      )
    }
  }
}

export default connect(mapStateToProps, Actions)(Itinerary);