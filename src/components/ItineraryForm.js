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
import {GoogleApiWrapper} from 'google-maps-react';
import Map from 'google-maps-react';
import Geosuggest from 'react-geosuggest';

const UpdateCoverPhoto = props => {
  if (props.isUser) {
    const dropHandler = (fileToUpload, e) => {
      if (fileToUpload && fileToUpload[0]) {
        props.uploadCoverPhoto(props.authenticated, fileToUpload[0], props.itinerary, props.itinerary.id)
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
          <div className="vb vb--light vb--no-outline mrgn-right-md">Change cover photo</div>

        </Dropzone>
        
      </div>
    );
  }
  return null;
}

const mapStateToProps = state => ({
  ...state.itinerary,
  authenticated: state.common.authenticated
});

class ItineraryForm extends React.Component {
  constructor() {
    super();

    this.initMap = (mapProps, map) => {
      const {google} = this.props;
      this.props.loadGoogleMaps(google, map, ITINERARY_PAGE);
    }

    const updateFieldEvent =
        key => ev => this.props.onUpdateCreateField(key, ev.target.value, ITINERARY_PAGE);

    this.changeTitle = updateFieldEvent('newItin.title');
  }

  render() {
    // if (!this.props.googleObject) {
    //   return (
    //     <Map google={window.google}
    //       onReady={this.initMap}
    //       visible={false} >
    //     </Map>
    //     );
    // }
    
    const itinerary = this.props.itinerary;
    const isUser = this.props.authenticated &&
    this.props.itinerary.userId === this.props.authenticated;

    const canModify = this.props.authenticated && 
    this.props.authenticated === this.props.itinerary.userId;
    return (
      <div className="flx flx-col flx-align-center page-common page-itinerary">

            <div className="content-wrapper itinerary flx flx-col flx-align-center">

              <div className="itinerary__cover flx flx-row flx-just-start header-height">
                
                {/** Cover Image **/}
                <div className="itinerary__cover__image header-height">
                  <ImagePicker images={(itinerary.images && itinerary.images.url ? [itinerary.images.url] : null)} />
                </div>
                {/** Cover Overlay **/}
                <div className="itinerary__cover__overlay header-height">
                  <img className="cover-height DN" src="../img/cover-overlay.png"/>
                </div>

                {/** <<<<<< USER PHOTO AND TIP COUNT **/}
                <div className="itinerary__cover__topbar w-max flx flx-row flx-align-center flx-just-start v2-type-body1 mrgn-bottom-sm pdding-top-md">
                  <div className="itinerary__cover__author-photo">
                      <Link
                      to={`${itinerary.createdBy.username}`}
                      className="">
                      <ProfilePic src={itinerary.createdBy.image} className="center-img" />
                      </Link>
                  </div>
                  <div className="flx flx-col flx-just-start flx-align-start">
                    <div className="itinerary__cover__username ta-left mrgn-right-md color--white">
                      <Link
                      to={`${itinerary.createdBy.username}`}
                      className="color--white">
                      {itinerary.createdBy.username}
                      </Link>
                    </div>
                  </div>
                </div>
                {/** >>>>>> CLOSE USER PHOTO AND TIP COUNT **/}

                {/** Cover Content **/}
                <div className="itinerary__cover__text flx flx-col flx-center-all ta-left w-100">

                  {/** <<<<<< CENTER INFO **/}
                  <div className="it__title-module flx flx-col flx-just-start ta-center w-100 w-max pdding-left-md">
                    
                    {/** Flag and Geo **/}
                    <div className={'itinerary__cover__flag mrgn-bottom-sm flx-hold flag-' + itinerary.geo.country}>
                    </div>
                    <Link to={`places/${itinerary.geo.placeId}`}>
                      <div className="geo-type color--white text-shadow ellipsis mrgn-bottom-sm">
                      {itinerary.geo.label}
                      </div>
                    </Link>

                    {/** TIMESTAMP **/}
                    <div className="itinerary__cover__timestamp ta-center pdding-top-sm opa-30 color--white DN">
                      <DisplayTimestamp timestamp={itinerary.lastModified} />
                      {/*(new Date(itinerary.lastModified)).toLocaleString()*/}
                    </div> 

                  </div>
                  {/** >>>>>> CLOSE CENTER INFO **/}

                  {/** -------- AUTHOR CONTROLS **/}
                  <div className="it-author-controls w-100 pdding-top-sm pdding-bottom-sm pdding-left-md pdding-right-md">
                    <div className="w-100 w-max flx flx-row flx-center-all ta-center pdding-left-md pdding-right-md">
                      <div className="flx flx-row flx-center-all">
                        <div className="it__tip-count flx flx-row flx-just-end flx-align-center opa-60 mrgn-right-lg">
                          {itinerary.reviewsCount} Tips
                        </div>

                        <UpdateCoverPhoto isUser={isUser} itinerary={itinerary} itineraryId={this.props.itineraryId} 
                          uploadCoverPhoto={this.props.dispatchUploadCoverPhoto} authenticated={this.props.authenticated} />

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
                          isLiked={itinerary.isLiked}
                          likesCount={itinerary.likesCount}
                          unLike={this.props.unLikeReview}
                          like={this.props.likeReview} 
                          likeObject={itinerary}
                          type={ITINERARY_TYPE} />
                      </div>
                    </div>{/** END MAX div **/}

                  </div>
                  {/** AUTHOR CONTROLS >>>>>> **/}
                
                </div>
              </div>

              {/** TITLE **/}
              <div className={"field-wrapper " + "input--underline edit-itinerary__name"}> 
                <label>Itinerary Name</label>
                <div>
                  <input name={this.props.newItin.title}
                    value={this.props.newItin.title}
                    type="text" 
                    maxLength="32" 
                    className="input--underline edit-itinerary__name"
                    placeholder="Name your itinerary"
                    onChange={this.changeTitle} />
                  </div>
              </div>

              {/** DESCRIPTION **/}
              <div className={"field-wrapper " + "input--underline edit-itinerary__name"}> 
                <label>Description (optional)</label>
                <div>
                  <input name={itinerary.description}
                    value={itinerary.description}
                    type="text" 
                    rows="2"
                    maxLength="180" 
                    className="input--underline edit-itinerary__name"
                    placeholder="What is this is about?" />
                  </div>
              </div>
            </div>
          </div>
    );
  }
}

export default connect(mapStateToProps, Actions)(ItineraryForm);

// export default GoogleApiWrapper({
//   apiKey: Constants.GOOGLE_API_KEY
// }) (connect(mapStateToProps, Actions)(ItineraryForm));