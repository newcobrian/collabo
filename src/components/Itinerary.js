import React from 'react';
import { connect } from 'react-redux';
import * as Actions from '../actions';
import * as Constants from '../constants';
import {BackToTop} from 'pui-react-back-to-top';
import TipList from './TipList';
import ProfilePic from './ProfilePic';
import ImagePicker from './ImagePicker';
import { Link } from 'react-router';
import LikeReviewButton from './LikeReviewButton';
import CommentContainer from './Review/CommentContainer'
import { ITINERARY_TYPE, ITINERARY_PAGE } from '../constants';
import ItineraryActions from './ItineraryActions';
import DisplayTimestamp from './DisplayTimestamp';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import Dropzone from 'react-dropzone';
import ItineraryForm from './ItineraryForm';
import * as Selectors from '../selectors/itinerarySelectors';
import { isEmpty } from 'lodash';
 
const UpdateCoverPhoto = props => {
  if (props.isUser) {
    const dropHandler = (fileToUpload, e) => {
      if (fileToUpload && fileToUpload[0]) {
        props.uploadCoverPhoto(props.authenticated, fileToUpload[0], props.itinerary, props.itineraryId)
      }
    }

    return (
      <div >
        <Dropzone
          onDrop={dropHandler}
          disablePreview={false}
          multiple={false}
          accept="image/*"
          className="edit-tip__dropzone__touch flx flx-col flx-align-center flx-just-start ta-center">
          <div className="vb vb--sm vb--shadow-none fill--white color--primary">Change photo</div>

        </Dropzone>
        
      </div>
    );
  }
  return null;
}

const EditItineraryLink = props => {
  if (props.isUser || Constants.SHARED_ITINERARIES.indexOf(props.itineraryId) > -1) {
    return (
      <Link
        to={'/edit/' + props.itineraryId}
        className="vb vb--sm vb--shadow-none fill--white color--primary mrgn-right-md">
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
      // if (iid) {
      //   this.props.getItinerary(this.props.authenticated, iid);
      //   this.props.getItineraryComments(iid);
      // }
      if (iid) {
        this.props.watchItinerary(this.props.authenticated, iid);
      }
      this.props.sendMixpanelEvent('Itinerary page loaded');
    }

    this.unloadItinerary = itineraryId => {
      this.props.unwatchItinerary(this.props.authenticated, itineraryId);
      // this.props.onItineraryUnload(this.props.authenticated, itineraryId);
      // this.props.unloadItineraryComments(itineraryId);
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
    if (isEmpty(this.props.itinerary)) {
      return (
        <div className="error-module flx flx-center-all v2-type-body3">
           <div>Itinerary doesn't exist</div>
        </div>
      )
    }
    // if (!this.props.itinerary || !this.props.itinerary.createdBy || !this.props.itinerary.geo) {
    else if (!this.props.itinerary || !this.props.itinerary.geo) {
      return (
        <div className="loading-module flx flx-col flx-center-all v2-type-body3">
          <div className="logo-graphic w-100">  
            <img className="center-img" src="/img/logos/logo.earth.temp.png"/>
          </div>
          <div>Loading Travel Guide...</div>
        </div>
      );
    }
    else {
      const itinerary = Selectors.getFullItinerary(this.props.itinerary, this.props.usersData);
      const createdByUsername = Selectors.getUsername(this.props.usersData, this.props.itinerary.userId);
      const createdByImage = Selectors.getUserImage(this.props.usersData, this.props.itinerary.userId);
      const tipList = Selectors.getTipList(this.props.usersData, this.props.tipsData, this.props.reviewsData,
        this.props.subjectsData, this.props.likesData, this.props.commentsData, this.props.userImagesData, 
        this.props.defaultImagesData, this.props.itinerary);

      const isUser = this.props.authenticated &&
      this.props.itinerary.userId === this.props.authenticated;

      const canModify = this.props.authenticated && 
      this.props.authenticated === this.props.itinerary.userId;
// console.log('progress = ' + this.props.coverPicProgress)
// console.log('cmt = ' + JSON.stringify(Selectors.getItineraryComments(this.props.commentsData, this.props.itinerary.id)))
// console.log('itinerary = ' + JSON.stringify(this.props.itinerary))
// console.log('likesData = ' + JSON.stringify(this.props.likesData))
// console.log('commentsData = ' + JSON.stringify(this.props.commentsData))
// console.log('subjectData = ' + JSON.stringify(this.props.subjectsData))
// console.log('reviewsData = ' + JSON.stringify(this.props.reviewsData))
// console.log('tipsData = ' + JSON.stringify(this.props.tipsData))
// console.log('user images data = ' + JSON.stringify(this.props.userImagesData))
      return (
        <div className="flx flx-col flx-align-start page-common page-itinerary">

          <div className="content-wrapper map-off itinerary flx flx-col flx-align-center">

            <div className="itinerary__cover flx flx-row flx-just-start header-height">
              
              {/** <<<<<< USER PHOTO AND TIP COUNT **/}
              <div className="itinerary__cover__topbar w-max flx flx-row flx-align-center flx-just-start v2-type-body1 mrgn-bottom-sm pdding-top-md">
                <div className="itinerary__cover__author-photo">
                    <Link
                    to={`/${createdByUsername}`}
                    className="">
                    <ProfilePic src={createdByImage} className="center-img" />
                    </Link>
                </div>
                <div className="flx flx-col flx-just-start flx-align-start">
                  <div className="itinerary__cover__username ta-left mrgn-right-md color--white">
                    <Link
                    to={`/${createdByUsername}`}
                    className="color--white">
                    {createdByUsername}
                    </Link>
                  </div>
                </div>
              </div>
              {/** >>>>>> CLOSE USER PHOTO AND TIP COUNT **/}


              {/** Cover Image **/}
              <div className="itinerary__cover__image header-height">
                <ImagePicker images={itinerary.images ? [itinerary.images] : null} />
                <div className={'flx flx-col flx-center-all v2-type-body3 cover__loading loading-done-' + this.props.coverPicProgress}>
                  Uploading New Cover Photo...
                </div> 
                <div className="vb--change-cover">
                <UpdateCoverPhoto isUser={isUser} itinerary={itinerary} itineraryId={itinerary.id} 
                  uploadCoverPhoto={this.props.uploadCoverPhoto} authenticated={this.props.authenticated} />
                </div>
              </div>

             


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

            {/** Cover Content **/}
            <div className="itinerary__cover__text flx flx-col flx-center-all ta-left w-100">

              {/** <<<<<< CENTER INFO **/}
              <div className="it__title-module flx flx-col flx-just-start ta-center w-100 w-max pdding-left-md pdding-right-md">
                
                {/** Flag and Geo **/}
                <Link to={`/places/${itinerary.geo.placeId}`}>
                <div className="flx flx-row flx-just-start flx-align-center mrgn-bottom-sm mrgn-top-xs">
                  <div className={'itinerary__cover__flag flx-hold flag-' + itinerary.geo.country}>
                  </div>
                  <div className="geo-type ellipsis">
                  {itinerary.geo.label}
                  </div>
                </div>
                </Link>

                {/** TITLE **/}
                <Link to={`/guide/${this.props.itineraryId}`}>
                <div className="itinerary__cover__title ta-left v2-type-h2">
                  {itinerary.title}
                </div>
                </Link>

                {/** DESCRIPTION **/}
                <div className="itinerary__cover__descrip v2-type-body3 ta-left mrgn-top-sm opa-80">
                   {itinerary.description}
                </div>

                {/** TIMESTAMP **/}
                <div className="itinerary__cover__timestamp ta-center pdding-top-sm opa-30 DN">
                  <DisplayTimestamp timestamp={itinerary.lastModified} />
                  {/*(new Date(itinerary.lastModified)).toLocaleString()*/}
                </div> 

              </div>
              {/** >>>>>> CLOSE CENTER INFO **/}

            </div>
            {/** Close Cover Text DIV >>>>>> **/}  



            {/** -------- AUTHOR CONTROLS **/}
            <div className="it-author-controls w-100 w-max flx flx-row flx-center-all ta-center pdding-top-sm pdding-bottom-sm">
              <div className="w-100 w-max flx flx-row flx-center-all ta-center pdding-left-md pdding-right-md">
                <div className="flx flx-row flx-center-all">
                  <div className="it__tip-count flx flx-row flx-just-end flx-align-center opa-60 mrgn-right-lg">
                    {itinerary.reviewsCount} tips
                  </div>

                  <EditItineraryLink isUser={isUser} itineraryId={this.props.itineraryId} />

                  <ItineraryActions 
                    itinerary={itinerary} 
                    authenticated={this.props.authenticated} 
                    canModify={canModify} 
                    deleteItinerary={this.props.showDeleteModal} 
                    redirectPath="/" />

                </div>


                {/* Like */}
                <div className="cta-wrapper flx flx-row flx-item-right">
                  <LikeReviewButton
                    authenticated={this.props.authenticated}
                    isLiked={Selectors.getIsLiked(this.props.likesData, this.props.itinerary.id)}
                    likesCount={itinerary.likesCount}
                    unLike={this.props.unLikeReview}
                    like={this.props.likeReview} 
                    likeObject={itinerary}
                    itineraryId={this.props.itineraryId}
                    type={ITINERARY_TYPE} />
                </div>
              </div>{/** END MAX div **/}

            </div>
            {/** AUTHOR CONTROLS >>>>>> **/}



            <div className="itinerary__tipslist flx flx-col flx-align-center fill--light-gray w-100 pdding-bottom-lg pdding-top-md">
              <div className="w-100">
                <TipList
                  tipList={tipList} 
                  reviewsCount={itinerary.reviewsCount}
                  authenticated={this.props.authenticated}
                  like={this.props.likeReview} 
                  unLike={this.props.unLikeReview}
                  userInfo={this.props.userInfo}
                  showModal={this.props.showModal}
                  deleteComment={this.props.onDeleteComment}
                  itineraryId={this.props.itinerary.id}
                  itinerary={itinerary}
                  canModify={canModify}

                  updateRating={this.props.onUpdateRating}
                  onSetPage={this.onSetPage}
                  deleteReview={this.props.onDeleteReview} />
              </div>
            </div>

            <div className="itinerary__comments-module flx flx-col flx-align-start flx-just-start w-max-2">
              <div className="v2-type-h3 mrgn-top-md ta-left w-100">
                Talk about this guide
              </div>
              <div className="v2-type-body2 mrgn-bottom-sm ta-left w-100 opa-40 DN">
                What do you think about {createdByUsername}'s View?
              </div>
              <CommentContainer
              authenticated={this.props.authenticated}
              userInfo={this.props.userInfo}
              type={ITINERARY_TYPE}
              comments={Selectors.getItineraryComments(this.props.commentsData, this.props.itinerary.id) || []}
              errors={this.props.commentErrors}
              commentObject={itinerary}
              deleteComment={this.props.onDeleteComment}
              itineraryId={this.props.itinerary.id} />
            </div>

          </div>
          <BackToTop />
        </div>
      )
    }
  }
}

export default connect(mapStateToProps, Actions)(Itinerary);