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
import { filter } from 'lodash'
import {CopyToClipboard} from 'react-copy-to-clipboard';
import Sticky from 'react-sticky-el';
import LoadingSpinner from './LoadingSpinner';
import TipList from './TipList';

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
        <div className="add-photo-wrapper vb vb--xs vb--shadow-none fill--none">
          <i className="material-icons color--white md-18">add_a_photo</i>
          <div className="mrgn-left-sm mobile-hide DN">Upload Cover</div>
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

class ItineraryForm2 extends React.Component {
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

    const updateReviewFieldEvent = (field, value, tip, dataType=Constants.TIPS_TYPE) =>
      this.props.updateReviewField(this.props.authenticated, this.props.data, field, value, tip, dataType);

    this.changeDescription = value => updateItineraryFieldEvent('description', value)
    this.changeLink = value => updateItineraryFieldEvent('link', value)
    this.changeTitle = value => {
      if (value.length >= 1) {
        updateItineraryFieldEvent('title', value)
        this.props.updateItineraryFormErrors('title', false)
      }
      else {
        this.props.updateItineraryFormErrors('title', true);
      }
    }
    this.changeCaption = tip => value => updateReviewFieldEvent('caption', value, tip, Constants.TIPS_TYPE)
    this.changeRating = tip => ev => updateReviewFieldEvent('rating', ev.target.value, tip, Constants.TIPS_TYPE)

    this.changeRecCaption = tip => value => updateReviewFieldEvent('caption', value, tip, Constants.RECOMMENDATIONS_TYPE)
    this.changeRecRating = tip => ev => updateReviewFieldEvent('rating', ev.target.value, tip, Constants.RECOMMENDATIONS_TYPE)

    this.deleteTip = tip => ev => {
      ev.preventDefault();
      this.props.onDeleteTip(this.props.authenticated, tip, this.props.itineraryId, this.props.data)
    }

    this.deleteRec = tip => ev => {
      ev.preventDefault();
      this.props.onDeleteRecommendation(this.props.authenticated, tip, this.props.itineraryId, this.props.itinerary)
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
    // this.jumpToHash();
  }

  componentDidMount() {
    setTimeout(function() {
      let hash = browserHistory.getCurrentLocation().hash;
      if (hash) {
        scrollToElement(hash, { offset: -200 });
      }
    }, 500);
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
    // if (!this.props.googleObject) {
    //   return (
    //     <Map google={window.google}
    //       onReady={this.initMap}
    //       visible={false} >
    //     </Map>
    //     );
    // }

    if (!this.props.google || !this.props.data) {
      return (
         <LoadingSpinner message="Loading guide" />
        );
    }

    const itinerary = this.props.data;
    const visibleTips = this.props.visibleTips;
    const shortName = itinerary && itinerary.geo && itinerary.geo.shortName ? itinerary.geo.shortName : itinerary.geo.label;
    const {google} = this.props;
    const addTipFunc = this.props.onAddTip;
    const auth = this.props.authenticated;

    const onCopyClick = () => {
        this.props.openSnackbar('Share link copied to clipboard');
      }

    const onPostClick = type => ev => {
      this.props.sendMixpanelEvent(Constants.MIXPANEL_SHARE_EVENT, { 'type' : type, 'source': Constants.ITINERARY_PAGE });
    }

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

    const handleAddToGuideClick = tip => ev => {
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

      if (!this.props.userInfo.flags || !this.props.userInfo.flags.tutorialCompleted) {
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
          addTipFunc(auth, resultObject, itinerary, Constants.TIPS_TYPE)
          geoSuggestRef._geoSuggest.clear()
        }
        else {
          addTipFunc(auth, resultObject, itinerary, Constants.TIPS_TYPE)
          geoSuggestRef._geoSuggest.clear()
        }
      })
      // setTimeout(function() {
        scrollToElement('#recommendationscontainer', { offset: -170 });
      // }, 500);
    }

    const ImDoneButton = props => {
      const onDoneClick = ev => {
        ev.preventDefault();
        props.onImDoneClick(props.itinerary);
      }

      const onCopyClick = () => {
        this.props.openSnackbar('Share link copied to clipboard');
      }

      const onPostClick = type => ev => {
        this.props.sendMixpanelEvent(Constants.MIXPANEL_SHARE_EVENT, { 'type' : type, 'source': Constants.ITINERARY_PAGE });
      }

      let twoDaysAgo = new Date();
      twoDaysAgo.setMonth(twoDaysAgo.getDate() <= 2 ? twoDaysAgo.getMonth() - 1 : twoDaysAgo.getMonth());
      twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

      // don't show the I'm done button if it's already been clicked
      // OR if guide has been created over 2 days ago and has at least 2 tips
      if (props.itinerary.imDoneClicked === true || 
        (props.itinerary.createdOn && props.itinerary.createdOn < twoDaysAgo && props.itinerary.tips && props.itinerary.tips.length >= 2)) {
        return (
          <div className="w-100 flx flx-row flx-just-start flx-align-center ta-center DN">
            {/* Like */}
            <div className="cta-wrapper flx flx-row vb vb--sm vb--outline--none fill--white color--black">
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

            
            {/* Share */}
            <div className="DN cta-wrapper flx flx-row vb vb--sm vb--outline--none fill--primary color--white flx-item-right pdding-right-lg pdding-left-lg"
              onClick={this.shareGuide} >
              <div className="color--white mrgn-right-sm">Share</div>
              <i className="material-icons mrgn-left-sm color--white flip-h">reply</i>
              <i className="material-icons color--white DN">accessibility</i>
            </div>


            
            </div>
          
          
        )
      }
      else return (
        <div className="DN test00 it-author-controls w-max flx flx-row flx-just-start flx-align-center ta-center pdding-top-sm pdding-bottom-sm">
          <div className="w-100 flx flx-row flx-just-start flx-align-center ta-center">
            <button className="bx-shadow cta-wrapper flx flx-row flx-center-all vb vb--sm vb--outline--none fill--success color--white w-50 mobile-w-100"
              onClick={onDoneClick} >
                <i className="material-icons color--white flx-item-left">check</i>
                <div className="flx-item-left">Done</div>
            </button>
          </div>
        </div>
      )
    }

const ShareGuideTooltip = props => {

  const onCopyClick = () => {
      this.props.openSnackbar('Share link copied to clipboard');
    }

  const onPostClick = type => ev => {
    this.props.sendMixpanelEvent(Constants.MIXPANEL_SHARE_EVENT, { 'type' : type, 'source': Constants.ITINERARY_PAGE });
  }

  if (props.showShareGuide) {
    return (
       <div className="share-prompt flx flx-col flx-just-end color--white bx-shadow ta-center">

        <div className="fill--none w-100 v2-type-body3 ta-center color--white pdding-bottom-md flx-center-all flx flx-col">
         <i className="material-icons md-36 color--success pdding-all-sm">check</i>
          <div>Changes saved.</div>
        </div>

        <div className="flx flx-col flx-just-end fill--white color--black w-100 pdding-all-md">
          <div className="v2-type-h4 ta-center color--black pdding-bottom-sm w-100">
            Would you like to share your travel guide with friends?
          </div>
            
          <div className="flx flx-row fill--white color--black w-100 pdding-all-sm flx-just-center">


              <FacebookShareButton
                url={Constants.VIEWS_URL + `/guide/${this.props.itineraryId}`}
                quote={'Check out my travel guide "' + itinerary.title + '" for '}
                hashtag={'#views'}
                onClick={onPostClick(Constants.FACEBOOK_POST)}
                className="Demo__some-network__share-button mrgn-right-sm flx flx-row flx-center-all vb vb--md vb--outline--none vb--fb mrgn-bottom-sm">
                <FacebookIcon
                  size={42}
                  round />
                <div className="color--white w-100 DN">Share on Facebook</div>
              </FacebookShareButton>


              <TwitterShareButton
                url={Constants.VIEWS_URL + `/guide/${this.props.itineraryId}`}
                title={'Check out my travel guide "' + itinerary.title + '" for ' + ':'}
                hashtags={['views']}
                onClick={onPostClick(Constants.TWITTER_POST)}
                className="mrgn-right-sm flx flx-row flx-center-all vb vb--md vb--outline--none vb--tw mrgn-bottom-sm">
                <TwitterIcon
                  size={42}
                  round />
                <div className="color--black DN w-100">Share on Twitter</div>

              </TwitterShareButton>

              <CopyToClipboard 
                className="flx flx-row flx-center-all vb vb--outline fill--white color--black vb--md"
                text={Constants.VIEWS_URL + '/guide/' + itinerary.id}
                onCopy={onCopyClick}>
                  <div className="flx flx-row flx-center-all w-100">
                    <i className="material-icons md-18 color--black opa-60 flx-item-left pdding-all-sm DN">link</i>
                    <div className="mobile-hide DN">Copy&nbsp;</div>
                     <div className="color--dark-gray">Copy URL</div>
                  </div>
              </CopyToClipboard>

            </div>

            <i className="material-icons color--primary md-18 DN">share</i>
            <Link className="w-100 v2-type-body1 fill--none hover--white10 opa-60 color--dark-gray flx-item-right mrgn-top-sm" onClick={this.props.closeShareGuide}>
              No thanks
            </Link>
        </div>
      </div>
    )
  }
  else return null
}


    const renderGeoSuggestTip = geo => {
      if (geo.location) {
        let latLng = new this.props.googleObject.maps.LatLng(geo.location.lat, geo.location.lng);
        
        return (

            <div className="it-add-wrapper w-100 w-max flx flx-row flx-align-center flx-just-start fill--transparent">
              <div className="tooltip-wrapper w-100">
                <i className="it-add-search-icon material-icons color--black opa-70 md-24">search</i>
                <Geosuggest 
                  ref={el=>this._geoSuggest=el}
                  className="input--underline w-100 color--black bx-"
                  placeholder={'Add a place to your guide'}
                  location={latLng}
                  radius={1000}
                  onSuggestSelect={suggestSelectTip(this)}/>
                  {(!this.props.userInfo.flags || !this.props.userInfo.flags.tutorialCompleted) && 
                    <div className="help-- arrow-up help--add-tip flx flx-row flx-center-all color--white bx-shadow">
                      <i className="material-icons color--white md-24 mrgn-left-xs DN">arrow_upward</i>
                      <div className="v2-type-body2">Add your first tip by searching for something in the dropdown</div>
                    </div>
                  }
              </div>
            </div>
        )
      }
      else return (
        
          <div className="it-add-wrapper w-100 w-max flx flx-row flx-align-center flx-just-start fill--primary color--white">
            <div className="tooltip-wrapper w-100">
              <i className="material-icons color--white md-36 mrgn-right-md">add</i>
              <Geosuggest
                ref={el=>this._geoSuggest=el}
                className="input--underline w-100 color--white"
                placeholder={'Search the name of any place in ' + itinerary.geo.label}
                onSuggestSelect={suggestSelectTip(this)}/>

              {(!this.props.userInfo.flags || !this.props.userInfo.flags.tutorialCompleted) && 
                <div className="help-- arrow-up help--add-tip flx flx-row flx-center-all color--white bx-shadow">
                  <i className="material-icons color--white md-24 mrgn-left-xs DN">arrow_upward</i>
                  <div className="v2-type-body2">Start adding to your travel guide by searching here and selecting a place from the dropdown</div>
                </div>
              }
            </div>
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
            <i className="material-icons color--white md-18 opa-90">low_priority</i>
            <div className="color--black mrgn-left-sm DN">Reorder</div>
          </Link>
        )
      }
      else return (
        <Link name="reorderLink" onClick={onReorderClick} className="vb--disabled hide-in-list vb vb--xs vb--outline-white fill--none flx flx-row flx-align-center">
          <i className="material-icons color--white md-18 opa-90 mrgn-right-sm">low_priority</i>
          <div className="color--black mrgn-left-sm DN">Reorder</div>
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
      this.props.showFilterModal(itinerary, this.props.visibleTags, this.props.showAllFilters);
    }

    const onSaveButtonClick = ev => {
      ev.preventDefault()
      this.props.onSaveGuideClick();
    }

    return (
      <div className={this.props.mapViewToggle ? 'flx flx-col flx-align-start page-common page-itinerary page-edit-own show-map' : 'flx flx-col flx-align-start page-common page-itinerary page-edit-own'}>


        
        
        <button className="mobile-show vb vb--sm flx flx-row flx-align-center fill--black color--white button-map-toggle bx-shadow"
          onClick={this.onMapToggle}>
          <i className="material-icons md-18">map</i>
          <div className="mobile-hide mrgn-left-sm">Full Map</div>
        </button>


        <div className="content-wrapper itinerary flx flx-col flx-align-center map-on">

          
          <div className="itinerary-image-wrapper flx flx-row flx-just-start header-height">
            

            
            {/** Cover Image **/}
            <div className="itinerary__big-photo bg-loading country-color- fill--light-gray">
              {/**+ itinerary.geo.country}**/}
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

              
           
               
          {/** -------- AUTHOR CONTROLS **/}
          

              <ImDoneButton
                itinerary={itinerary}
                onImDoneClick={this.props.onImDoneClick} />
              
          {/** AUTHOR CONTROLS >>>>>> **/}

          
          {/** Cover Content **/}
          <div className="itinerary__cover__text w-100">
            
            

            <div className="it__cover__inner flx flx-col flx-just-start ta-left w-100 w-max">
              <div className="flx flx-row w-100 flx-just-start flx-align-center mrgn-bottom-sm">

                <div className="it__author-wrapper flx flx-row flx-just-start flx-align-center mrgn-right-lg">
                  <div className="itinerary__summary__author-photo">
                      <Link
                      to={`/${createdByUsername}`}
                      className="invert">
                      <ProfilePic src={createdByImage} className="center-img" />
                      </Link>
                  </div>
                  <div className="itinerary-username v2-type-body2 ta-left mrgn-left-sm">
                    <Link
                    to={`/${createdByUsername}`}
                    className="invert">
                    {createdByUsername}
                    </Link>
                  </div>
                </div>

                {/** Flag and Geo **/}
                <div className="flx flx-row flx-just-start flx-align-center w-60">
                  <Link to={`/places/${itinerary.geo.placeId}`} className={'itinerary__cover__flag flx-hold invert flag-' + itinerary.geo.country} />
                  <div className="v2-type-body2 ellipsis w-100 flx flx-row flx-align-center mrgn-left-sm flx-just-start">
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
              
              {/**** SAMPLE ask for recs button. Remove this later ****/}
              <div className="w-100 pdding-all-md flx flx-row flx-center-all w-max-2 mrgn-top-md DN">
                <button className="ask-for-recs-button vb vb--sm fill--primary color--white mobile-w-100" onClick={this.props.onAskForRecsClick(this.props.itineraryId, itinerary)}>
                  <i className="material-icons color--white md-24 mrgn-right-sm DN">flare</i>
                    Ask for Recs
                  <i className="material-icons color--white md-24 mrgn-left-sm">room_service</i>
                </button>
              </div>

             

              {/** TITLE **/}
              <div className="itinerary__cover__title ta-left guide-title font--alpha invert">
                <RenderDebounceInput
                  type="text"
                  value={this.props.data.title}
                  placeholder="Title"
                  className={this.props.formErrors.title ? 'has-error' : ''}
                  debounceFunction={this.changeTitle} />
                  <DisplayError error={this.props.formErrors.title} message="Title is required"/>
              </div>

              {/** DESCRIPTION **/}
              <div className="itinerary__cover__descrip font--beta v2-type-body2 ta-left opa-80">
                 <RenderDebounceInput
                    type="text"
                    className="w-100 font--beta invert"
                    value={this.props.data.description}
                    placeholder="Description"
                    debounceFunction={this.changeDescription} />
              </div>

            {/** LINK - only for admins **/}
              {
                Constants.ADMIN_USERS.includes(this.props.authenticated) && 
                <div className="itinerary__cover__descrip font--beta v2-type-body1 ta-left opa-80">
                   <RenderDebounceInput
                      type="text"
                      className="w-100 font--beta invert"
                      value={this.props.data.link}
                      placeholder="Link"
                      debounceFunction={this.changeLink} />
                </div>
              }

              <div className="it-actions-row w-100 flx flx-row flx-align-center flx-just-start ta-left opa-40">
                {/** TIMESTAMP **/}
                <div className="itinerary__cover__timestamp v2-type-caption ta-left invert color--black">
                  Updated &nbsp;
                  <DisplayTimestamp timestamp={this.props.data.lastModified} />
                  {/*(new Date(itinerary.lastModified)).toLocaleString()*/}
                </div> 
                <div className="edit-itinerary-link mrgn-left-md color--black invert">             
                  <MuiThemeProvider muiTheme={getMuiTheme()}>

                       <ItineraryActionsButton 
                        itinerary={itinerary} 
                        authenticated={this.props.authenticated} 
                        canModify={true} 
                        className="invert color--black"
                        deleteModal={this.props.showDeleteModal}
                        style={{
                          margin: '0',
                          padding: '0'
                        }} 
                        redirectPath="/" />
                   </MuiThemeProvider>
                </div>
              </div>



              

              </div>

            </div>
            {/** >>>>>> CLOSE CENTER INFO **/}

          {/** >>>>>> SMALL ACTIONS START **/}
            <div className="flx flx-row flx-align-center w-100 pdding-left-md pdding-all-sm pdding-top-xs pdding-bottom-xs fill--white">
              
              {/** LIKE BUTTON **/}
              <div className="cta-wrapper flx flx-row vb vb--xs vb--outline--none vb--nohover fill--none color--black">
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

              
              {/** END LIKE BUTTON **/}

              {/* Share */}
              <div className="DN cta-wrapper flx flx-row vb vb--xs vb--outline--none vb--nohover fill--none color--black invert flx-item-right pdding-left-lg"
                onClick={this.shareGuide} >
                <div className="color--black mrgn-right-xs">Share this guide</div>
                <i className="material-icons mrgn-left-xs color--black flip-h">reply</i>
                <i className="material-icons color--white DN">accessibility</i>
              </div>


              <div className="flx flx-row flx-align-center pdding-right-sm flx-item-right">
                <FacebookShareButton
                  url={Constants.VIEWS_URL + `/guide/${this.props.itineraryId}`}
                  quote={'Check out my travel guide "' + itinerary.title + '" for '}
                  hashtag={'#views'}
                  onClick={onPostClick(Constants.FACEBOOK_POST)}
                  className="Demo__some-network__share-button">
                  <FacebookIcon
                    size={24}
                    round={true}
                     />
                </FacebookShareButton>

                <FacebookShareCount
                  url={Constants.VIEWS_URL + `/guide/${this.props.itineraryId}`}
                  className="mrgn-left-sm color--fb mrgn-right-sm v2-type-body0 weight-500">
                  {count => count}
                </FacebookShareCount>


                <TwitterShareButton
                  url={Constants.VIEWS_URL + `/guide/${this.props.itineraryId}`}
                  title={'Check out my travel guide "' + itinerary.title + '" for ' + ':'}
                  hashtags={['views']}
                  onClick={onPostClick(Constants.TWITTER_POST)}
                  className="Demo__some-network__share-button flx flx-row flx-align-center">
                  <TwitterIcon
                    size={24}
                    round={true}
                     />
                   
                  <div className="v2-type-body0 mrgn-left-sm color--tw">Tweet</div>
                </TwitterShareButton>
                <i className="material-icons color--primary md-18 DN">share</i>

                <CopyToClipboard 
                  className="flx flx-row flx-center-all fill--white color--black DN"
                  text={Constants.VIEWS_URL + '/guide/' + itinerary.id}
                  onCopy={onCopyClick}>
                    <div className="flx flx-row flx-center-all w-100 fill--white">
                      <i className="material-icons md-18 color--dark-gray flx-item-left">link</i>
                      <div className="mobile-hide DN">Copy&nbsp;</div>
                      <div className="v2-type-body0 mrgn-left-xs color--dark-gray">Copy URL</div>
                    </div>
                </CopyToClipboard>
              </div>
            </div>
          {/** >>>>>> SMALL ACTIONS END **/}


          </div>
          {/** Close Cover Text DIV >>>>>> **/}  



         
            
            {/** ----- Close itinerary__cover DIV ----- **/}  
            <div className="itinerary__tipslist flx flx-col flx-align-center fill--light-gray w-100 pdding-bottom-lg country-color- + itinerary.geo.country">

                <Sticky bottomOffset={140} className={'sticky-class'}>
                  <div className="it-add-container flx flx-col flx-align-center fill--black bx-shadow country-color- + itinerary.geo.country">
                    
                    <div className="flx flx-row flx-align-center w-100 ta-center pdding-all-xs v2-type-body1 color--white w-100 ta-left">
                        
                        <div className="pdding-right-sm brdr-right--white">{/*this.props.visibleTips.length*/}{this.props.numTotalTips} Tips</div>
                        {/*<Link animate={{offset: 0, duration: 600}}
                        onClick={this.props.scrollToRecommendations}
                        className="pdding-left-sm color--white">
                        {this.props.numRecs} Recommendations</Link>*/}

                      <div className="flx flx-row flx-align-center opa-80 flx-item-right">
                        <div className="flx-item-right">{renderReorderButton(itinerary.tips.length)}</div>
                        <Link className="vb vb--xs flx flx-row fill--none flx-center-all vb--outline-white ta-center" onClick={openFilter}>
                          <i className="material-icons color--white opa-90 md-18">filter_list</i>
                          <div className="color--black DN">Filter {/*this.props.numVisibleTags}/{this.props.numTotalTags*/} {/*Showing 4/10 Categories */}</div>
                        </Link>
                      </div>

                    </div>

                    {renderGeoSuggestTip(itinerary.geo)}
                  </div>
                </Sticky>


              {
                visibleTips.map((tip, index) => {
                  return (
                    <Element name={'tip' + tip.key} className={"tip-wrapper flx flx-col flx-col w-100 w-max" + isSelectedTip(tip.key)} id={'tip' + tip.key} key={tip.key} onClick={onTipClick(tip)}>

                       
                            <div className="tip-container flx flx-col flx-center-all w-100 bx- brdr-all">
                                
                              
                                  
                                  { /** Title **/ }
                                  <div className="tip__title-module flx flx-col w-100">


                                      <div className="tip__right-module flx flx-row flx-align-center w-100">





                                      { /** Image shown if own web 
                                      <MediaQuery query="(min-device-width: 1224px)">**/}
                                        <div className="tip__image-module bx-shadow">
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

                                        { /** Title **/ }
                                        <div className="hide-in-list tip__title tip-title ta-left mrgn-left-md">
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



                                      <div className="tip__timestamp v2-type-caption opa-20 mrgn-top-xs DN">
                                        <DisplayTimestamp timestamp={tip.review.lastModified} />
                                      </div>
                                      
                                    </div>


                                    <div className="flx flx-col w-100">

                                      <div className="tip__content-wrapper">
                                        <div className="tip__content-inner">


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
                                          <div className="tip__caption-module flx flx-row w-100 pdding-bottom-sm">
                                            <div className="tip__author-photo flx-hold mrgn-right-sm">
                                              <ProfilePic src={tip.createdBy.image} className="user-image user-image-sm center-img" />
                                            </div>
                                            <div className="flx flx-col flx-align-start w-100">
                                                {/* Tags Wrapper **/ }
                                                <div className="flx flx-row flx-align-center flx-wrap pdding-bottom-xs">

                                                  { /** Rating **/ }
                                                  <div className={'tip__rating-module flx flx-row flx-align-center flx-hold w-100 tip__rating-module--' + tip.review.rating}>
                                                    <select className="color--black" value={tip.review.rating} onChange={this.changeRating(tip)}>
                                                      <option value="-">To Try</option>
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


                                                  </div>
                                                {/* END tags wrapper **/ }

                                              <div className="tip__caption v2-type-body2 font--beta  ta-left opa-70">
                                                <RenderDebounceInput
                                                  type="textarea"
                                                  className="w-100 show-border"
                                                  cols="20"
                                                  wrap="hard"
                                                  value={tip.review.caption}
                                                  placeholder="Add notes here"
                                                  debounceFunction={this.changeCaption(tip)} />
                                              </div>


                                              {/* Tags list **/ }
                                              <div className="w-100 flx flx-row flx-align-center">
                                               { 
                                                Object.keys(tip.tags || {}).map(function (tagName) {
                                                  return (
                                                    <div key={tagName} className="tip-tag fill--light-gray flx flx-row flx-align-center">
                                                      <div className="opa-50">{tagName}</div>
                                                      <Link className="tag-x flx-item-right flx flx-center-all" onClick={onRemoveTag(this.props.authenticated, tip, itinerary.id, itinerary.geo.placeId, tagName)}>
                                                        <i className="material-icons color--black md-16">close</i>
                                                      </Link>
                                                    </div>
                                                  )
                                                }, this)}

                                                  <div className="tag-input-wrapper">
                                                    <AddTagInput tip={tip} itineraryId={itinerary.id} placeId={itinerary.geo.placeId} />
                                                  </div>
                                              </div>
                                              {/* END Tags list **/ }





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
                                                type={Constants.TIPS_TYPE}
                                                deleteComment={this.props.onDeleteComment} />
                                          </div> 

                                         

                                        </div>

                                        {/* Action Module */}
                                        <div className="tip__cta-box w-100 flx flx-row flx-just-start flx-align-center mrgn-top-md">

                                          <Link onClick={handleAddToGuideClick(tip)} className="w-33 hide-in-list vb vb--tip vb--outlin--none flx flx-row flx-align-center brdr-top brdr-right color--black fill--white">
                                              <i className="material-icons color--primary mrgn-right-sm md-24">playlist_add</i>
                                              <div className="color--black">Add to</div>
                                          </Link>

                                          <div className="w-33 cta-wrapper vb vb--tip vb--outline--none flx flx-row flx-align-center v2-type-body2 brdr-top brdr-right">
                                            <LikeReviewButton
                                              authenticated={this.props.authenticated}
                                              isLiked={tip.isLiked}
                                              likesCount={tip.likesCount}
                                              unLike={this.props.unLikeReview}
                                              like={this.props.likeReview} 
                                              likeObject={tip}
                                              itineraryId={itinerary.id}
                                              type={Constants.TIPS_TYPE} />
                                          </div>

                                          <Link onClick={onInfoClick(tip)} className="w-33 hide-in-list vb vb--tip vb--outline--none flx flx-row flx-align-center brdr-top">
                                            <i className="material-icons md-24 mrgn-right-sm opa-60">info_outline</i>
                                            <div className="color--black v2-type-body0 weight-500">Info</div>
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

              {/** Big share button **/}
              
              
              <div className="DN bx-shadow big-share-button cta-wrapper flx flx-col flx-center-all vb vb--sm vb--outline--none fill--primary color--white"
                onClick={this.shareGuide} >
                <i className="material-icons color--white flip-h md-36 mrgn-bottom-md">reply</i>
                <i className="material-icons color--white DN">accessibility</i>
                <div className="color--white v2-type-h3">Share this Guide</div>
              </div>

              {/** Big share button **/}

{/*}
              <div className="recs-list-wrapper flx flx-col w-100 fill--black brdr-top pdding-top-md pdding-bottom-lg mrgn-top-lg">
                 <div className="comments-section-title flx flx-row w-100 color--black invert pdding-left-md pdding-right-md mrgn-bottom-sm" id="recommendationscontainer">
                      <i className="material-icons color--yellow mrgn-right-sm">lightbulb_outline</i>
                      <div className="color--black invert">Recommendations from friends</div>
                   </div>
                {/* Tip List for recommendations 
                <TipList
                  tipList={this.props.recommendations}
                  authenticated={this.props.authenticated}
                  userInfo={this.props.userInfo}
                  showModal={this.props.showModal}
                  deleteComment={this.props.onDeleteComment}
                  itineraryId={this.props.itinerary.id}
                  itinerary={itinerary}
                  dataType={Constants.RECOMMENDATIONS_TYPE}
                  canModify={false}
                  selectedMarker={this.props.selectedMarker}
                  onSelectActiveTip={this.props.onSelectActiveTip}
                  changeRating={this.changeRecRating}
                  changeCaption={this.changeRecCaption}
                  deleteRec={this.deleteRec} />
              </div>

       */}       

            </div>


            <Element className="itinerary__comments-module brdr-top map-on flx flx-col flx-align-start flx-just-start w-max-2" id='guidecommentcontainer' name='guidecommentcontainer'>
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

           

            <div className="test00 it-author-controls w-max flx flx-row flx-just-start flx-align-center ta-center pdding-top-sm pdding-bottom-sm">
              <div className="w-100 flx flx-row flx-just-start flx-align-center ta-center">
                <button className="bx-shadow cta-wrapper flx flx-row flx-center-all vb vb--sm vb--outline--none fill--primary color--white w-100"
                  onClick={onSaveButtonClick} >
                    <i className="material-icons color--white flx-item-left DN">check</i>
                    <div className="">Save</div>
                </button>
              </div>
            </div>


            <ShareGuideTooltip showShareGuide={this.props.showShareGuide} closeTooltip={this.props.closeShareGuide}/>

          </div>

          <div className="it-map-container fill--light-gray">
            <MapContainer itinerary={itinerary} visibleTips={visibleTips} google={this.props.google} />
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

export default connect(mapStateToProps, Actions)(ItineraryForm2);

// export default GoogleApiWrapper({
//   apiKey: Constants.GOOGLE_API_KEY
// }) (connect(mapStateToProps, Actions)(ItineraryForm));