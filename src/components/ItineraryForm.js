import React from 'react';
import { connect } from 'react-redux';
import * as Actions from '../actions';
import * as Constants from '../constants';
import ProfilePic from './ProfilePic';
import ImagePicker from './ImagePicker';
import { browserHistory, Link } from 'react-router';
import LikeReviewButton from './LikeReviewButton';
import CommentContainer from './Review/CommentContainer'
import { ITINERARY_TYPE, ITINERARY_PAGE } from '../constants';
import ItineraryActionsButton from './ItineraryActionsButton';
import DisplayTimestamp from './DisplayTimestamp';
import RenderDebounceInput from './RenderDebounceInput';
import MapContainer from './MapContainer';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import MoreHorizIcon from 'material-ui/svg-icons/navigation/more-horiz';
import Dropzone from 'react-dropzone';
import { GoogleApiWrapper, Map, Marker } from 'google-maps-react'
import Geosuggest from 'react-geosuggest';
import * as Selectors from '../selectors/itinerarySelectors';
import Textarea from 'react-textarea-autosize';
import scrollToElement from 'scroll-to-element';
import RelatedItineraries from './RelatedItineraries';
import {BackToTop} from 'pui-react-back-to-top';
import SEO from './SEO';
import { ShareButtons, ShareCounts, generateShareIcon } from 'react-share';
import MediaQuery from 'react-responsive';
import AddTagInput from './AddTagInput';

const {
  FacebookShareButton,
  TwitterShareButton
} = ShareButtons;

const {
  FacebookShareCount
} = ShareCounts;

const FacebookIcon = generateShareIcon('facebook');
const TwitterIcon = generateShareIcon('twitter');

var Scroll = require('react-scroll');
var Element = Scroll.Element;

const DisplayError = props => {
  if (!props.error) {
    return null;
  }
  else return ( <div className='error-messages'>{props.message}</div>)
}

const UpdateCoverPhoto = props => {
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
        accept="image/jpeg,image/png,application/pdf"
        className="edit-tip__dropzone__touch flx flx-col flx-align-center flx-just-start ta-center">
        <div className="vb vb--xs vb--shadow-none fill--white color--black vb--outline">
          <i className="material-icons color--black opa-80 md-18">add_a_photo</i>
          <div className="mrgn-left-sm mobile-hide">Upload Cover</div>
        </div>
      </Dropzone>
      
    </div>
  );
}

const mapStateToProps = state => ({
  ...state.itinerary,
  authenticated: state.common.authenticated,
  userInfo: state.common.userInfo
});

class ItineraryForm extends React.Component {
  constructor() {
    super();

    this.initMap = (mapProps, map) => {
      const {google} = this.props;
      this.props.loadGoogleMaps(google, map, ITINERARY_PAGE);
    }

    this.onTextChange = event => {
      const curText = event.target.value;
      this.props.updateItineraryForm('curText', curText);

    // // Throttle updates so we don't go to minimongo and then the server
    // // on every keystroke.
    // this.updateText = this.updateText || _.throttle(newText => {
    //   Meteor.call("/todos/setText", this.props.task._id, newText);
    // }, 300);

    // this.updateText(curText);
    }

    const updateFieldEvent =
        key => ev => this.props.onUpdateCreateField(key, ev.target.value, ITINERARY_PAGE);

    const updateItineraryFieldEvent = (field, value) =>
      this.props.updateItineraryField(this.props.authenticated, this.props.data, field, value);

    const updateReviewFieldEvent = (field, value, tip) =>
      this.props.updateReviewField(this.props.authenticated, this.props.data, field, value, tip);

    this.changeDescription = value => updateItineraryFieldEvent('description', value)
    this.changeTitle = value => {
      if (value.length >= 1) {
        updateItineraryFieldEvent('title', value)
        this.props.updateItineraryFormErrors('title', false)
      }
      else {
        this.props.updateItineraryFormErrors('title', true);
      }
    }
    this.changeCaption = tip => value => updateReviewFieldEvent('caption', value, tip)
    this.changeRating = tip => ev => updateReviewFieldEvent('rating', ev.target.value, tip)

    this.deleteTip = tip => ev => {
      ev.preventDefault();
      this.props.onDeleteTip(this.props.authenticated, tip, this.props.itineraryId, this.props.data)
    }

    this.onMapToggle = ev => {
      this.props.toggleMapView()
    }

    this.shareGuide = ev => {
      ev.preventDefault();
      this.props.showShareModal(this.props.itinerary);
    }

    this.suggestSelectGeo = result => {
      let geoData = {
        label: result.label,
        placeId: result.placeId,
        location: result.location
      }

      if (result.gmaps && result.gmaps.address_components) {
        result.gmaps.address_components.forEach(function(resultItem) {
          if (resultItem.types && resultItem.types[0] && resultItem.types[0] === 'country') {
            if (resultItem.short_name) geoData.country = resultItem.short_name;
            if (resultItem.long_name) geoData.fullCountry = resultItem.long_name;
          }
        })
      }

      this.props.updateItineraryGeo(this.props.authenticated, this.props.data, geoData);
    }
  }

  componentWillMount() {
    if (this.props.initialValues) {
      this.props.updateItineraryForm('data', this.props.initialValues);
    }
    this.jumpToHash();
  }

  componentDidUpdate() {
    this.jumpToHash();
  }

  jumpToHash = () => {
    let hash = browserHistory.getCurrentLocation().hash;
    if (hash) {
      // scroller.scrollTo(hash, {duration: 400, offset: -70});
      scrollToElement(hash, { offset: -70 });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.initialValues && nextProps.initialValues !== this.props.initialValues) {
      this.props.updateItineraryForm('data', nextProps.initialValues);
    }
  }

  render() {
    if (!this.props.googleObject) {
      return (
        <Map google={window.google}
          onReady={this.initMap}
          visible={false} >
        </Map>
        );
    }
    const itinerary = this.props.data;
    const shortName = itinerary && itinerary.geo && itinerary.geo.shortName ? itinerary.geo.shortName : itinerary.geo.label;
    const {google} = this.props;
    const addTipFunc = this.props.onAddTip;
    const auth = this.props.authenticated;

    let initialMapCenter = {};
    if (itinerary.tips && itinerary.tips[0] && itinerary.tips[0].subject && itinerary.tips[0].subject.location) {
      initialMapCenter =  itinerary.tips[0].subject.location
    }
    else if (navigator && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        const coords = pos.coords;
        initialMapCenter = { lat: coords.latitude, lng: coords.longitude }
      })
    }
    else {
      initialMapCenter = { lat: null, lng: null }
    }

    const createdByUsername = Selectors.getCreatedByUsername(itinerary);
    const createdByImage = Selectors.getCreatedByUserImage(itinerary);

    const handleSaveClick = tip => ev => {
      ev.preventDefault();
      this.props.showModal(Constants.SAVE_MODAL, tip, tip.images);
    }

    const onInfoClick = tip => ev => {
      ev.preventDefault();
      this.props.showModal(Constants.INFO_MODAL, tip);
    }

    const onReorderClick = ev => {
      ev.preventDefault();
      this.props.showReorderModal(itinerary);
    }

    const isSelectedTip = tipId => {
      if (tipId === this.props.selectedMarker) return ' tip-selected';
      return '';
    }

    const suggestSelectTip = geoSuggestRef => result => {
      let resultObject = {
        title: result.label,
        id: result.placeId,
        location: result.location
      }
      if (result.gmaps && result.gmaps.formatted_address) {
        resultObject.address = result.gmaps.formatted_address;
      }

      if (!this.props.userInfo.tutorialCompleted) {
        this.props.completeTutorial(this.props.authenticated);
      }

      let service = new google.maps.places.PlacesService(this.props.mapObject);
      let request = { placeId: result.placeId }
      service.getDetails(request, function(place, status) {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
          if (place.name) resultObject.title = place.name;
          if (place.international_phone_number) resultObject.internationalPhoneNumber = place.international_phone_number;
          if (place.formatted_phone_number) resultObject.formattedPhoneNumber = place.formatted_phone_number;
          if (place.opening_hours) {
            resultObject.hours = {};
            if (place.opening_hours.periods) resultObject.hours.periods = place.opening_hours.periods;
            if (place.opening_hours.weekday_text) resultObject.hours.weekdayText = place.opening_hours.weekday_text;
          }
          if (place.permanently_closed) resultObject.permanently_closed = true;
          if (place.website) resultObject.website = place.website;
          if (place.photos && place.photos[0]) {
            resultObject.defaultImage = [ place.photos[0].getUrl({'maxWidth': 1225, 'maxHeight': 500}) ];
          }
          if (place.url) resultObject.googleMapsURL = place.url;
          addTipFunc(auth, resultObject, itinerary)
          geoSuggestRef._geoSuggest.clear()
        }
        else {
          addTipFunc(auth, resultObject, itinerary)
          geoSuggestRef._geoSuggest.clear()
        }
      })
      // setTimeout(function() {
        scrollToElement('#guidecommentcontainer', { offset: -170 });
      // }, 500);
    }

    const renderGeoSuggestTip = geo => {
      if (geo.location) {
        let latLng = new this.props.googleObject.maps.LatLng(geo.location.lat, geo.location.lng);
        
        return (
          <div className="it-add-wrapper w-100 w-max flx flx-row flx-align-center flx-just-start fill--transparent">
            <i className="it-add-search-icon material-icons color--primary md-24">add_circle</i>
            
            <Geosuggest 
              ref={el=>this._geoSuggest=el}
              className="input--underline w-100 color--black bx-shadow"
              placeholder={'Search to add a place'}
              location={latLng}
              radius={1000}
              onSuggestSelect={suggestSelectTip(this)}/>
              {!this.props.userInfo.tutorialCompleted && 
                <div className="help--add-tip flx flx-row flx-center-all fill--black color--white opa-90 bx-shadow">
                  <i className="material-icons color--white md-24 mrgn-left-xs">arrow_upward</i>
                  <div className="v2-type-body2 mrgn-left-md">Start adding to your guide by searching here and selecting a place from the dropdown</div>
                </div>
              }
          </div>
        )
      }
      else return (
        <div className="it-add-wrapper w-100 w-max flx flx-row flx-align-center flx-just-start fill--primary color--white">
          <i className="material-icons color--white md-36 mrgn-right-md">add</i>
         
          <Geosuggest
            ref={el=>this._geoSuggest=el}
            className="input--underline w-100 color--white"
            placeholder={'Search for any place in ' + itinerary.geo.label}
            onSuggestSelect={suggestSelectTip(this)}/>

          {!this.props.userInfo.tutorialCompleted && 
            <div className="help--add-tip flx flx-row flx-center-all fill--black color--white opa-90 bx-shadow">
              <i className="material-icons color--white md-24 mrgn-left-xs">arrow_upward</i>
              <div className="v2-type-body2 mrgn-left-md">Start adding to your guide by searching here and selecting a place from the dropdown</div>
            </div>
          }
        </div>
      )
    }

    const tipDropHandler = tip => (filesToUpload, e) => {
      if (filesToUpload && tip && tip.subjectId) {
        // console.log('tip = ' + JSON.stringify(tip))
        // console.log(filesToUpload)
        this.props.uploadCustomSubjectImages(this.props.authenticated, tip.subjectId, filesToUpload, itinerary.id);
      }
    }

    const renderReorderButton = numTips => {
      if(numTips > 0) {
        return (
          <Link name="reorderLink" onClick={onReorderClick} className="hide-in-list vb vb--xs vb--outline-none fill--none flx flx-row flx-align-center">
            <i className="material-icons color--black md-18 opa-80">low_priority</i>
            <div className="color--black mrgn-left-sm">Reorder</div>
          </Link>
        )
      }
      else return (
        <Link name="reorderLink" onClick={onReorderClick} className="vb--disabled hide-in-list vb vb--xs vb--outline-none fill--none flx flx-row flx-align-center">
          <i className="material-icons color--black md-18 opa-80 mrgn-right-sm">low_priority</i>
          <div className="color--black mrgn-left-sm">Reorder</div>
        </Link>
        )
    }

    const onTipClick = (tip) => ev => {
      ev.preventDefault();
      this.props.onSelectActiveTip(tip);
    }

    const onRemoveTag = (auth, tip, itineraryId, placeId, tag) => ev => {
      ev.preventDefault();
      this.props.onRemoveTag(auth, tip, itineraryId, placeId, tag);
    }

    const openFilter = ev => {
      ev.preventDefault()
      this.props.showFilterModal(itinerary);
    }

    return (
      <div className={this.props.mapViewToggle ? 'flx flx-col flx-align-start page-common page-itinerary page-edit-own show-map' : 'flx flx-col flx-align-start page-common page-itinerary page-edit-own'}>


        
        
        <button className="vb vb--sm vb--outline vb--round flx flx-row flx-align-center fill--white color--black mrgn-left-n-1 button-map-toggle bx-shadow brdr-left"
          onClick={this.onMapToggle}>
          <i className="material-icons color--black md-18 opa-80">map</i>
          <div className="mobile-hide color--black mrgn-left-sm">Full Map</div>
        </button>



        <div className="content-wrapper itinerary flx flx-col flx-align-center map-on">

          
          <div className="itinerary-image-wrapper flx flx-row flx-just-start header-height">
            
            <div className="it-add-container flx flx-row flx-align-center fill--none">
              <div className="it__tip-count color--black mrgn-right-sm mrgn-left-sm DN">
                {itinerary.reviewsCount ? itinerary.reviewsCount : 0}
              </div>
              {renderGeoSuggestTip(itinerary.geo)}
            </div>

            
            {/** Cover Image **/}
            <div className="itinerary__big-photo bg-loading">
              <ImagePicker images={itinerary.images ? [itinerary.images] : null} />
              <div className={'flx flx-col flx-center-all v2-type-body3 fill--black color--white cover__loading fill--light-gray loading-done-' + this.props.coverPicProgress}>
                  <div className="loader-wrapper flx flx-col flx-center-all fill--black">
                    <div className="loader-bird"></div>
                    <div className="loader">
                      <div className="bar1"></div>
                      <div className="bar2"></div>
                      <div className="bar3"></div>
                    </div>
                    <div className="v2-type-body2 color--white">Loading guide</div>
                  </div>
              </div> 
              <div className="vb--change-cover">
                <UpdateCoverPhoto itinerary={itinerary} itineraryId={itinerary.id} 
                  uploadCoverPhoto={this.props.uploadCoverPhoto} authenticated={this.props.authenticated} />
              </div>
            </div>

          
          </div>

              
           
               

          {/** Cover Content **/}
          <div className={"itinerary__cover__text w-100 country-color-" + itinerary.geo.country}>
            
            <div className="it__cover__inner flx flx-col flx-just-start ta-left w-100 w-max">
              <div className="flx flx-row w-100 flx-center-all mrgn-bottom-sm">

                <div className="it__author-wrapper flx flx-col flx-center-all w-50">
                  <div className="itinerary__summary__author-photo">
                      <Link
                      to={`/${createdByUsername}`}
                      className="invert">
                      <ProfilePic src={createdByImage} className="center-img" />
                      </Link>
                  </div>
                  <div className="itinerary-username v2-type-body1">
                    <Link
                    to={`/${createdByUsername}`}
                    className="invert">
                    {createdByUsername}
                    </Link>
                  </div>
                </div>

                {/** Flag and Geo **/}
                <div className="flx flx-col flx-just-start flx-align-center mrgn-top-xs mrgn-bottom-xs w-50">
                  <Link to={`/places/${itinerary.geo.placeId}`} className={'itinerary__cover__flag flx-hold invert flag-' + itinerary.geo.country} />
                  <div className="geo-type ellipsis w-100 flx flx-row flx-align-center flx-just-start">
                    <Geosuggest 
                      className="input--underline w-100 invert"
                      types={['(regions)']}
                      placeholder="Search for a location (e.g. 'New York' or 'Japan')"
                      required
                      initialValue={itinerary.geo.label}
                      onSuggestSelect={this.suggestSelectGeo}/>
                  </div>
                </div>
              </div>

             

            {/** <<<<<< CENTER INFO **/}
            <div className="it__title-module flx flx-col flx-just-start ta-center w-100">
            
             

              {/** TITLE **/}
              <div className="itinerary__cover__title ta-center guide-title font--alpha invert">
                <RenderDebounceInput
                  type="text"
                  value={this.props.data.title}
                  placeholder="Title"
                  className={this.props.formErrors.title ? 'has-error' : ''}
                  debounceFunction={this.changeTitle} />
                  <DisplayError error={this.props.formErrors.title} message="Title is required"/>
              </div>

              {/** DESCRIPTION **/}
              <div className="itinerary__cover__descrip font--beta v2-type-body3 ta-center mrgn-top-sm opa-80">
                 <RenderDebounceInput
                    type="text"
                    className="w-100 font--beta invert"
                    value={this.props.data.description}
                    placeholder="Description"
                    debounceFunction={this.changeDescription} />
              </div>

              {/** TIMESTAMP **/}
              <div className="itinerary__cover__timestamp ta-center pdding-top-sm opa-30 DN">
                <DisplayTimestamp timestamp={this.props.data.lastModified} />
                {/*(new Date(itinerary.lastModified)).toLocaleString()*/}
              </div> 



              {/** -------- AUTHOR CONTROLS **/}
              <div className="it-author-controls w-100 w-max flx flx-row flx-just-start flx-align-center ta-center pdding-top-sm pdding-bottom-sm">
                <div className="w-100 w-max flx flx-row flx-just-start flx-align-center ta-center">


                  {/* Like */}
                  <div className="cta-wrapper flx flx-row vb vb--sm vb--outline fill--white color--black mrgn-left-n-1">
                    <LikeReviewButton
                      authenticated={this.props.authenticated}
                      isLiked={itinerary.isLiked}
                      likesCount={itinerary.likesCount}
                      unLike={this.props.unLikeReview}
                      like={this.props.likeReview} 
                      likeObject={itinerary}
                      itineraryId={itinerary.id}
                      type={ITINERARY_TYPE} />
                  </div>


                  <div className="edit-itinerary-link vb vb--sm no-pad vb--outline--none fill--none color--black opa-60 mrgn-left-n-1">             
                    <MuiThemeProvider muiTheme={getMuiTheme()}>
                      <IconMenu
                         iconButtonElement={<IconButton><MoreHorizIcon /></IconButton>}
                         className="invert"
                         anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
                         targetOrigin={{horizontal: 'left', vertical: 'top'}}
                        >
                         <ItineraryActionsButton 
                          itinerary={itinerary} 
                          authenticated={this.props.authenticated} 
                          canModify={true} 
                          className="invert vb vb--outline--none fill--none"
                          deleteModal={this.props.showDeleteModal} 
                          redirectPath="/" />
                       </IconMenu>
                     </MuiThemeProvider>
                  </div>

                  
                  {/* Share */}
                  <div className="cta-wrapper flx flx-row vb vb--sm vb--outline fill--white color--black flx-item-right"
                    onClick={this.shareGuide} >
                    <div className="color--black mrgn-right-sm">Share Guide</div>
                    <i className="material-icons color--primary">play_arrow</i>
                    <i className="material-icons color--primary">accessibility</i>
                  </div>


                  <div className="flx-item-right flx flx-row DN">
                    <div className="vb vb--sm vb--outline fill--white color--black">
                      <FacebookShareButton
                        url={Constants.VIEWS_URL + `/guides/${this.props.itineraryId}`}
                        quote={'Check out my travel guide "' + itinerary.title + '" for ' + shortName}
                        hashtag={'#views'}
                        className="Demo__some-network__share-button">
                        <FacebookIcon
                          size={24}
                          round />
                      </FacebookShareButton>

                      <FacebookShareCount
                        url={Constants.VIEWS_URL + `/guide/${this.props.itineraryId}`}
                        className="mrgn-left-sm">
                        {count => count}
                      </FacebookShareCount>
                    </div>
                    <div className="vb vb--sm vb--outline fill--white color--black mrgn-left-n-1">
                      <TwitterShareButton
                        url={Constants.VIEWS_URL + `/guide/${this.props.itineraryId}`}
                        title={'Check out my travel guide "' + itinerary.title + '" for ' + shortName + ':'}
                        hashtags={['views']}
                        className="Demo__some-network__share-button">
                        <TwitterIcon
                          size={24}
                          round />
                      </TwitterShareButton>
                      <i className="material-icons color--primary md-18 DN">share</i>
                    </div>

                  </div>
                </div>{/** END MAX div **/}

              </div>
              {/** AUTHOR CONTROLS >>>>>> **/}

              </div>

            </div>
            {/** >>>>>> CLOSE CENTER INFO **/}

          </div>
          {/** Close Cover Text DIV >>>>>> **/}  



            <div className="w-100 flx flx-row flx-center-all pdding-all-sm">
              <Link className="vb vb--md fill--white color--black w-100 flx flx-row flx-center-all vb--outline ta-center" onClick={openFilter}>
                <i className="material-icons color--black opa-60 mrgn-right-sm">filter_list</i>
                Showing 4/10 Categories
              </Link>
            </div>


            
            {/** ----- Close itinerary__cover DIV ----- **/}  
            <div className="itinerary__tipslist flx flx-col flx-align-center fill--light-gray w-100 pdding-bottom-lg">
              <div className="flx flx-row w-100 flx-align-center pdding-left-md pdding-right-md pdding-top-sm">
                <div className="v2-type-body1 color--black">{itinerary.reviewsCount ? itinerary.reviewsCount : 0} Items</div>
                <div className="flx-item-right">{renderReorderButton(itinerary.tips.length)}</div>
              </div>

              {
                itinerary.tips.map((tip, index) => {
                  return (
                    <Element name={'tip' + tip.key} className={"tip-wrapper flx flx-col flx-col w-100 w-max" + isSelectedTip(tip.key)} id={'tip' + tip.key} key={tip.key} onClick={onTipClick(tip)}>

                       
                            <div className="tip-container flx flx-col flx-center-all w-100 bx-shadow">
                                
                              
                                  
                                  { /** Title **/ }
                                  <div className="tip__title-module flx flx-col w-100">


                                      <div className="tip__right-module flx flx-col flx-m-row w-100">





                                      { /** Image shown if own web 
                                      <MediaQuery query="(min-device-width: 1224px)">**/}
                                        <div className="tip__image-module">
                                            <div className={"tip__photo-count tip-count-" + tip.images.length}>{tip.images.length > 0 ? tip.images.length : null}</div>
                                            <ImagePicker images={tip.images} />
                                          <Dropzone
                                            onDrop={tipDropHandler(tip)}
                                            disablePreview={false}
                                            accept="image/jpeg,image/png,application/pdf"
                                            className="add-photo-wrapper flx flx-col flx-align-center flx-just-start ta-center">
                                            <div className="vb vb--xs vb--shadow-none fill--none">
                                              <i className="material-icons color--white md-18">add_a_photo</i>
                                            </div>

                                          </Dropzone>
                                        </div>
                                      
                                      {/** 
                                      </MediaQuery>

                                      EXAMPLE: on mobile, just show the dropzone 
                                      <MediaQuery query="(max-device-width: 1224px)">
                                        <Dropzone
                                            onDrop={tipDropHandler(tip)}
                                            disablePreview={false}
                                            accept="image/jpeg,image/png,application/pdf"
                                            className="add-photo-wrapper flx flx-col flx-align-center flx-just-start ta-center">
                                            <div className="vb vb--xs vb--shadow-none fill--none">
                                              <i className="material-icons color--white md-18">add_a_photo</i>
                                            </div>

                                        </Dropzone>
                                      </MediaQuery>
                                      { /** END Image **/ }


                                      <div className="tip__timestamp v2-type-caption opa-20 mrgn-top-xs DN">
                                        <DisplayTimestamp timestamp={tip.review.lastModified} />
                                      </div>
                                      
                                    </div>


                                    <div className="flx flx-col w-100">

                                      <div className="tip__content-wrapper">
                                        <div className="tip__content-inner">
                                          <div className="tip__header-wrapper flx flx-col flx-align-start flx-just-start">
                                            
                                            <div className="flx flx-row w-100 flx-align-center">
                                              { /** Title **/ }
                                              <div className="hide-in-list tip__title tip-title ta-left">
                                                <div className="tip__order-count color--black">{index+1}.</div> 
                                                <Link to={`/review/${tip.subjectId}`} className=""> {tip.subject.title}</Link>
                                              </div>
                                              <div className="tip-map-marker"></div>
                                              { /** END Title **/ }

                                              {/* More Options button */}
                                              <div className="edit-itinerary-link vb vb--xs flx-item-right no-pad vb--outline--none opa-20 fill--white color--black">             
                                                <MuiThemeProvider muiTheme={getMuiTheme()}>
                                                  <IconMenu
                                                     iconButtonElement={<IconButton className=""><MoreHorizIcon /></IconButton>}
                                                     anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
                                                     targetOrigin={{horizontal: 'left', vertical: 'top'}}
                                                   >
                                                  <div className="vb vb--sm vb--shadow-none fill--white color--primary danger-hover"
                                                    onClick={this.deleteTip(tip)}>Delete Tip
                                                  </div>
                                                    
                                                   </IconMenu>
                                                 </MuiThemeProvider>
                                              </div>
                                              {/* END More Options button */}
                                            </div>



                                            {/* Tags Wrapper **/ }
                                            <div className="flx flx-row flx-align-center flx-wrap pdding-top-sm pdding-bottom-sm">

                                              { /** Rating **/ }
                                              <div className={'tip__rating-module flx flx-row flx-align-center flx-hold w-100 tip__rating-module--' + tip.review.rating}>
                                                <select className="color--black" value={tip.review.rating} onChange={this.changeRating(tip)}>
                                                  <option value="-">Add Rating</option>
                                                  <option value="0">0/10 Run away</option>
                                                  <option value="1">1/10 Stay away</option>
                                                  <option value="2">2/10 Just bad</option>
                                                  <option value="3">3/10 Don't go</option>
                                                  <option value="4">4/10 Meh</option>
                                                  <option value="5">5/10 Average</option>
                                                  <option value="6">6/10 Solid</option>
                                                  <option value="7">7/10 Go here</option>
                                                  <option value="8">8/10 Really good</option>
                                                  <option value="9">9/10 Must go</option>
                                                  <option value="10">10/10 The best</option>
                                                </select>
                                              </div>
                                              { /** END Rating **/ }

                                              {/* Tags list **/ }
                                              
                                               { 
                                                Object.keys(tip.tags || {}).map(function (tagName) {
                                                  return (
                                                    <div key={tagName} className="tip-tag fill--light-gray flx flx-row flx-align-center">
                                                      <div className="opa-50">{tagName}</div>
                                                      <Link className="flx-item-right flx flx-center-all" onClick={onRemoveTag(this.props.authenticated, tip, itinerary.id, itinerary.geo.placeId, tagName)}>
                                                        <i className="material-icons color--black mrgn-left-xs md-16">close</i>
                                                      </Link>
                                                    </div>
                                                  )
                                                }, this)}

                                                  <div className="tag-input-wrapper">
                                                    <AddTagInput tip={tip} itineraryId={itinerary.id} placeId={itinerary.geo.placeId} />
                                                  </div>




                                              
                                            {/* END Tags list **/ }
                                            </div>
                                          {/* END tags wrapper **/ }


                                           

                                          </div>

                                          { /** Author **/ }
                                          <Link
                                              to={'/' + tip.createdBy.username}
                                              className="show-in-list">
                                            <div className="flx flx-row flx-just-start flx-align-center mrgn-bottom-sm">
                                                <div className="tip__author-photo flx-hold mrgn-right-sm">
                                                  <ProfilePic src={tip.createdBy.image} className="user-image user-image-sm center-img" />
                                                </div> 
                                                <div className="color--black v2-type-body1">
                                                  {tip.createdBy.username}
                                                </div>
                                            </div>
                                          </Link>
                                          { /** END Author **/ }

                                          { /** Caption **/ }
                                          <div className="tip__caption-module flx flx-col w-100 pdding-bottom-sm mrgn-bottom-md">
                                            <div className="tip__caption v2-type-body3 font--beta  ta-left opa-90">
                                              <RenderDebounceInput
                                                type="textarea"
                                                className="w-100 show-border"
                                                cols="20"
                                                wrap="hard"
                                                value={tip.review.caption}
                                                placeholder="Add notes here"
                                                debounceFunction={this.changeCaption(tip)} />
                                            </div>
                                          </div>

                                          { /** Comments **/ }
                                          <div className="flx flx-row flex-wrap cta-container">
                                             <CommentContainer
                                                authenticated={this.props.authenticated}
                                                comments={tip.comments || []}
                                                commentObject={tip}
                                                itineraryId={itinerary.id}
                                                userInfo={this.props.userInfo}
                                                type={Constants.REVIEW_TYPE}
                                                deleteComment={this.props.onDeleteComment} />
                                          </div> 

                                        </div>

                                        {/* Action Module */}
                                        <div className="tip__cta-box w-100 flx flx-row flx-just-start flx-align-center mrgn-top-md">

                                          <Link onClick={handleSaveClick(tip)} className="w-50 hide-in-list vb vb--tip vb--outlin--none flx flx-row flx-align-center brdr-top brdr-right color--black fill--white">
                                              <i className="material-icons color--primary mrgn-right-sm md-24">add_circle</i>
                                              <div className="color--black">Save</div>
                                          </Link>

                                          <div className="w-30 cta-wrapper vb vb--tip vb--outline--none flx flx-row flx-align-center v2-type-body2 brdr-top brdr-right">
                                            <LikeReviewButton
                                              authenticated={this.props.authenticated}
                                              isLiked={tip.isLiked}
                                              likesCount={tip.likesCount}
                                              unLike={this.props.unLikeReview}
                                              like={this.props.likeReview} 
                                              likeObject={tip}
                                              itineraryId={itinerary.id}
                                              type={Constants.REVIEW_TYPE} />
                                          </div>

                                          <Link onClick={onInfoClick(tip)} className="w-20 hide-in-list vb vb--tip vb--outline--none flx flx-row flx-align-center brdr-top">
                                            <i className="material-icons md-24">info_outline</i>
                                          </Link>
                                         
                                        
                                        </div>
                                        {/* END Action Module */}
                                      </div>
                                    </div>
                                </div> { /** End photo / copy row **/ }


                               

                            </div> { /** END Content-wrapper **/}



                    </Element>
                  );
                })
              }
            </div>


            <Element className="itinerary__comments-module map-on flx flx-col flx-align-start flx-just-start w-max-2" id='guidecommentcontainer' name='guidecommentcontainer'>
              <div className="comments-section-title mrgn-bottom-md ta-left w-100">
                Discussion
              </div>
              <CommentContainer
              authenticated={this.props.authenticated}
              userInfo={this.props.userInfo}
              type={Constants.ITINERARY_TYPE}
              comments={Selectors.getItineraryComments(this.props.commentsData, itinerary.id) || []}
              errors={this.props.commentErrors}
              commentObject={itinerary}
              deleteComment={this.props.onDeleteComment}
              itineraryId={itinerary.id} />
            </Element>

            <div className="itinerary__related-module flx flx-col flx-align-center w-100 pdding-bottom-lg">
              <RelatedItineraries
                relatedItineraries={this.props.relatedItineraries} 
                numRelated={this.props.numRelated}
                authenticated={this.props.authenticated}
                like={this.props.likeReview}
                unLike={this.props.unLikeReview} />
            </div>

          </div>

         





          <div className="it-map-container fill--light-gray">
            <MapContainer itinerary={itinerary} google={this.props.google} />
          </div>
          { /** Map block 
          <div className="it-map-container">
            <Map google={this.props.google} >
            {
              itinerary.tips.map((tipItem, index) => {
                return (
                  <Marker
                    key={index}
                    name={tipItem.subject.title}
                    title={'# ' + index + ': ' + tipItem.subject.title}
                    position={tipItem.subject.location} />
                )
              })
            }
            </Map>
          </div>
          { /** END Map block **/ }

          
          <BackToTop />

          <SEO
            schema="Guide"
            title={itinerary.title}
            description={itinerary.description}
            path={`/guides/${this.props.itineraryId}`}
            contentType="article"
            published={itinerary.createdOn ? (new Date(itinerary.createdOn)).toISOString() : (new Date(itinerary.lastModified)).toISOString()}
            updated={(new Date(itinerary.lastModified)).toISOString()}
            category={''}
            tags={[]}
            twitter={''}
            image={itinerary && itinerary.images && itinerary.images.url ? itinerary.images.url : null }
          />

        </div>
                  
                   

    );
  }
}

// export default connect(mapStateToProps, Actions)(ItineraryForm);

export default GoogleApiWrapper({
  apiKey: Constants.GOOGLE_API_KEY
}) (connect(mapStateToProps, Actions)(ItineraryForm));