import React from 'react';
import { connect } from 'react-redux';
import * as Actions from '../actions';
import * as Constants from '../constants';
import TipList from './TipList';
import ProfilePic from './ProfilePic';
import ImagePicker from './ImagePicker';
import { Link } from 'react-router';
import LikeReviewButton from './LikeReviewButton';
import CommentContainer from './Review/CommentContainer'
import { ITINERARY_TYPE } from '../constants';
import ItineraryActions from './ItineraryActions';
import DisplayTimestamp from './DisplayTimestamp';
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
        className="vb vb--light vb--outline--white color--white mrgn-right-md">
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
      this.props.onItineraryUnload(this.props.authenticated, itineraryId);
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
        <div className="loading-module flx flx-col flx-center-all v2-type-body3">
          <div className="logo-graphic w-100">  
            <img className="center-img" src="../img/logos/logo.earth.temp.png"/>
          </div>
          <div>Loading Itinerary...</div>
        </div>
      );
    }
    else if (this.props.itinerary.length === 0) {
      return (
        <div className="error-module flx flx-center-all v2-type-body3">
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

            <div className="itinerary__cover flx flx-row flx-center-all header-height">
              
              {/** Cover Image **/}
              <div className="itinerary__cover__image header-height">
                <ImagePicker images={(itinerary.images && itinerary.images.url ? [itinerary.images.url] : null)} />
              </div>
              {/** Cover Overlay **/}
              <div className="itinerary__cover__overlay header-height">
                <img className="cover-height" src="../img/cover-overlay.png"/>
              </div>

              {/** Cover Content **/}
              <div className="itinerary__cover__text flx flx-col flx-center-all ta-left">
                
                {/** <<<<<< USER PHOTO AND TIP COUNT **/}
                <div className="itinerary__cover__topbar flx flx-row flx-align-center flx-just-start v2-type-body1 mrgn-bottom-sm">
                  <div className="itinerary__cover__author-photo mrgn-right-md">
                      <Link
                      to={`${itinerary.createdBy.username}`}
                      className="">
                      <ProfilePic src={itinerary.createdBy.image} className="center-img" />
                      </Link>
                  </div>
                  <div className="flx flx-col flx-just-start flx-align-start">
                    <div className="itinerary__cover__username color--white mrgn-right-md">
                      <Link
                      to={`${itinerary.createdBy.username}`}
                      className="color--white">
                      {itinerary.createdBy.username}
                      </Link>
                    </div>
                    <Link to={`itinerary/${itinerary.id}`}>
                    <div className="flx flx-row flx-just-end flx-align-center opa-80 color--white">
                      {itinerary.reviewsCount} Tips
                    </div>
                    </Link>
                  </div>

                  {/* Like */}
                  <div className="cta-wrapper flx flx-row flx-just-end flex-item-right mrgn-right-md">
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
                {/** >>>>>> CLOSE USER PHOTO AND TIP COUNT **/}

            
              {/** <<<<<< CENTER INFO **/}
              <div className="flx flx-col flx-center-all ta-center w-100 mrgn-bottom-sm">
                
                {/** Flag and Geo **/}
                <div className={'itinerary__cover__flag mrgn-bottom-sm flx-hold flag-' + itinerary.geo.country}>
                </div>
                <Link to={`places/${itinerary.geo.placeId}`}>
                  <div className="geo-type color--white text-shadow ellipsis mrgn-bottom-sm">
                  {itinerary.geo.label}
                  </div>
                </Link>

                {/** TITLE **/}
                <Link to={`itinerary/${itinerary.id}`}>
                <div className="itinerary__cover__title text-shadow ta-center v2-type-h2 color--white">
                  {itinerary.title}
                </div>
                </Link>

                {/** DESCRIPTION **/}
                <div className="itinerary__cover__descrip text-shadow v2-type-body3 color--white mrgn-top-sm">
                   {itinerary.description}
                </div>

                {/** TIMESTAMP **/}
                <div className="itinerary__cover__timestamp ta-center pdding-top-sm opa-30 color--white">
                  <DisplayTimestamp timestamp={itinerary.lastModified} />
                  {/*(new Date(itinerary.lastModified)).toLocaleString()*/}
                </div> 

              </div>
              {/** >>>>>> CLOSE CENTER INFO **/}

              {/** <<<<<< AUTHOER INFO **/}
              <div className="it-author-controls flx flx-row flx-just-center ta-center w-100 mrgn-bottom-sm">

                <EditItineraryLink isUser={isUser} itineraryId={this.props.itineraryId} />

                <ItineraryActions 
                  itinerary={itinerary} 
                  authenticated={this.props.authenticated} 
                  canModify={canModify} 
                  deleteItinerary={this.props.showDeleteModal} 
                  redirectPath="/" />
              </div>
              {/** AUTHOR CONTROLS >>>>>> **/}
            
            </div>
            {/** Close Cover Text DIV >>>>>> **/}  


            {/* Hidden edit itinerary dropdown 
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
            */}

            </div>
            {/** ----- Close itinerary__cover DIV ----- **/}  

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

            <div className="itinerary__comments-module flx flx-col flx-align-start flx-just-start w-max-2">
              <div className="v2-type-h3 mrgn-top-md ta-left w-100">
                Itinerary Comments
              </div>
              <div className="v2-type-body2 mrgn-bottom-sm ta-left w-100 opa-40 DN">
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