import React from 'react';
import { connect } from 'react-redux';
import * as Actions from '../actions';
import * as Constants from '../constants';
import {BackToTop} from 'pui-react-back-to-top';
import TipList from './TipList';
import ProfilePic from './ProfilePic';
import ImagePicker from './ImagePicker';
import { browserHistory, Link } from 'react-router';
import LikeReviewButton from './LikeReviewButton';
import CommentContainer from './Review/CommentContainer'
import { ITINERARY_TYPE, ITINERARY_PAGE } from '../constants';
import ItineraryActionsButton from './ItineraryActionsButton';
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
import { isEmpty, find, filter } from 'lodash';
import MapContainer from './MapContainer';
import scrollToElement from 'scroll-to-element';
import RelatedItineraries from './RelatedItineraries';
import SEO from './SEO';
import LoadingSpinner from './LoadingSpinner';
import { ShareButtons, ShareCounts, generateShareIcon } from 'react-share';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import Geosuggest from 'react-geosuggest';
import FollowItineraryButton from './FollowItineraryButton'
import { GoogleApiWrapper, Map, Marker } from 'google-maps-react';
import Sticky from 'react-sticky-el';

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
var scroller = Scroll.scroller;

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
          <div className="vb vb--sm vb--shadow-none fill--white color--black opa-80">
            <i className="material-icons color--primary md-24">add_a_photo</i>
          </div>

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
        className="vb vb--sm vb--outline fill--white color--black mrgn-right-sm">
         <div>Edit</div>
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

    this.initMap = (mapProps, map) => {
      const {google} = this.props;
      this.props.loadGoogleMaps(google, map, ITINERARY_PAGE);
    }

    this.loadItinerary = iid => {
      // if (iid) {
      //   this.props.getItinerary(this.props.authenticated, iid);
      //   this.props.getItineraryComments(iid);
      // }
      if (iid) {
        this.props.watchItinerary(this.props.authenticated, iid);
        this.props.getItineraryFollow(this.props.authenticated, iid);
      }
      this.props.sendMixpanelEvent(Constants.MIXPANEL_PAGE_VIEWED, { 'page name' : 'itinerary'});
    }

    this.unloadItinerary = itineraryId => {
      this.props.unwatchItinerary(this.props.authenticated, itineraryId);
      this.props.unmountItineraryFollow(this.props.authenticated, itineraryId);
      // this.props.onItineraryUnload(this.props.authenticated, itineraryId);
      // this.props.unloadItineraryComments(itineraryId);
    }

    this.onMapToggle = ev => {
      this.props.toggleMapView()
    }

    this.shareGuide = ev => {
      ev.preventDefault();
      this.props.showShareModal(this.props.itinerary);
    }

    const updateReviewFieldEvent = (field, value, tip) => {
      this.props.updateReviewField(this.props.authenticated, this.props.itinerary, field, value, tip, Constants.RECOMMENDATIONS_TYPE);
    }

    this.changeCaption = tip => value => updateReviewFieldEvent('caption', value, tip)
    this.changeRating = tip => ev => updateReviewFieldEvent('rating', ev.target.value, tip)

    this.deleteRec = tip => ev => {
      ev.preventDefault();
      this.props.onDeleteRecommendation(this.props.authenticated, tip, this.props.itineraryId, this.props.itinerary)
    }
  }

  componentWillMount() {
    this.loadItinerary(this.props.params.iid);
    this.props.loadRelatedItineraries(this.props.authenticated, this.props.params.iid);
    this.jumpToHash();
  }

  componentDidUpdate() {
    this.jumpToHash();
  }

  componentWillUnmount() {
    this.unloadItinerary(this.props.itineraryId);
    this.props.unloadRelatedItineraries(this.props.authenticated);
    if (!this.props.authenticated) {
      this.props.setAuthRedirect(this.props.location.pathname);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.params.iid !== this.props.params.iid) {
      this.unloadItinerary(this.props.itineraryId);
      this.loadItinerary(nextProps.params.iid);
      this.props.loadRelatedItineraries(this.props.authenticated, nextProps.params.iid);
    }
  }

  jumpToHash = () => {
    let hash = browserHistory.getCurrentLocation().hash;
    if (hash) {
      // scroller.scrollTo(hash, {duration: 3000, offset: -70});
      scrollToElement(hash, { offset: -70 });
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
    if (this.props.itineraryNotFound) {
      return (
        <div className="error-module flx flx-col flx-center-all ta-center v2-type-body3 color--black">
          <div className="xiao-img-wrapper mrgn-bottom-sm">
            <img className="center-img" src="/img/xiaog.png"/>
          </div>
          <div className="mrgn-bottom-md">The guide you're looking for doesn't exist, <br/>but here's a panda with chicken legs.</div>
          <Link to="/" className="vb vb--sm fill--primary color--white">More guides</Link>
        </div>
      )
    }
    // if (!this.props.itinerary || !this.props.itinerary.createdBy || !this.props.itinerary.geo) {
    else if (!this.props.itinerary || !this.props.itinerary.geo) {
      return (
        <LoadingSpinner message="Loading guide" />
      );
    }
    else {
      const {google} = this.props;
      const itinerary = this.props.itinerary;
      itinerary.tips = this.props.tips;
      const createdByUsername = Selectors.getCreatedByUsername(this.props.itinerary);
      const createdByImage = Selectors.getCreatedByUserImage(this.props.itinerary);
      const addTipFunc = this.props.onAddTip;
      const auth = this.props.authenticated;

      const onCopyClick = () => {
        this.props.openSnackbar('Share link copied to clipboard');
      }

      const onPostClick = type => ev => {
        this.props.sendMixpanelEvent(Constants.MIXPANEL_SHARE_EVENT, { 'type' : type, 'source': Constants.ITINERARY_PAGE });
      }

      const isUser = this.props.authenticated &&
      this.props.itinerary.userId === this.props.authenticated;

      const canModify = (this.props.authenticated && 
      this.props.authenticated === this.props.itinerary.userId) || (Constants.SHARED_ITINERARIES.indexOf(itinerary.id) !== -1);

      const openFilter = ev => {
        ev.preventDefault()
        this.props.showFilterModal(itinerary, this.props.visibleTags, this.props.showAllFilters);
      }

      const onSubscribeTooltipOkay = ev => {
        ev.preventDefault();
        if (!this.props.userInfo || !this.props.userInfo.flags || !this.props.userInfo.flags.hideSubscribeTip) {
          this.props.closeSubscribeTooltip(this.props.authenticated)
        }
      }

      const getVisibleTips = (tips, visibleTags) => {
      if (this.props.showAllFilters) {
        return tips;
      }
      else {
        return tips.filter(function(tip) {
          for (var tagName in tip.tags) {
            if (visibleTags.hasOwnProperty(tagName) && visibleTags[tagName].checked) {
              return true;
            }
          }
          return false;
        })
      }
    }

    const suggestSelectTip = geoSuggestRef => result => {
      if (!this.props.authenticated) {
        this.props.askForAuth('Create an account so your friend knows who these recommendations are coming from.');
      }
      else {
        let resultObject = {
          title: result.label,
          id: result.placeId,
          location: result.location
        }
        if (result.gmaps && result.gmaps.formatted_address) {
          resultObject.address = result.gmaps.formatted_address;
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
            addTipFunc(auth, resultObject, itinerary, Constants.RECOMMENDATIONS_TYPE)
            geoSuggestRef._geoSuggest.clear()
          }
          else {
            addTipFunc(auth, resultObject, itinerary, Constants.RECOMMENDATIONS_TYPE)
            geoSuggestRef._geoSuggest.clear()
          }
        })
        // setTimeout(function() {
          scrollToElement('#guidecommentcontainer', { offset: -170 });
        // }, 500);
      }
    }

    const renderGeoSuggestRec = geo => {
      if (geo.location) {
        let latLng = new this.props.googleObject.maps.LatLng(geo.location.lat, geo.location.lng);
        
        return (
          <div className="it-add-wrapper w-100 w-max flx flx-row flx-align-center flx-just-start fill--transparent">
            <i className="it-add-search-icon material-icons color--black opa-70 md-24">search</i>
            
            <Geosuggest 
              ref={el=>this._geoSuggest=el}
              className="input--underline w-100 color--black bx-shadow"
              placeholder={'Add a recommendation'}
              location={latLng}
              radius={1000}
              onSuggestSelect={suggestSelectTip(this)}/>
          </div>
        )
      }
      else return (
        <div className="it-add-wrapper w-100 w-max flx flx-row flx-align-center flx-just-start fill--primary color--white">
          <i className="material-icons color--white md-36 mrgn-right-md">add</i>
         
          <Geosuggest
            ref={el=>this._geoSuggest=el}
            className="input--underline w-100 color--white"
            placeholder={'Add a recommendation'}
            onSuggestSelect={suggestSelectTip(this)}/>
        </div>
      )
    }

    // console.log('visible tags = ' + JSON.stringify(this.props.visibleTags))
    // console.log('show allfilter = ' + JSON.stringify(this.props.showAllFilters))
    const visibleTips = getVisibleTips(itinerary.tips, this.props.visibleTags);
    const numVisibleTips = visibleTips.length
    const numTotalTips = Object.keys(itinerary.tips).length
    // const numVisibleTags = this.props.showAllFilters ? numTotalTags : Object.keys(filter(this.props.visibleTags, ['checked', true])).length;

      if (canModify) {
        return (
          <ItineraryForm 
            initialValues={itinerary}
            recommendations={this.props.recommendations}
            visibleTips={visibleTips} 
            numTotalTips={numTotalTips}
            google={google}
             />
          )
      }
      else {
        return (
          <div className={this.props.mapViewToggle ? 'flx flx-col flx-align-start page-common page-itinerary not-my-guide page-edit-own show-map' : 'flx flx-col flx-align-start page-common not-my-guide page-edit-own page-itinerary'}>

            <button className="mobile-show vb vb--sm flx flx-row flx-align-center fill--black color--white button-map-toggle bx-shadow"
              onClick={this.onMapToggle}>
              <i className="material-icons md-18">map</i>
              <div className="mobile-hide mrgn-left-sm">Full Map</div>
            </button>

            {/*<button className="mobile-show vb vb--sm vb--outline vb--round flx flx-row flx-align-center fill--white color--black button-filter-map bx-shadow"
             onClick={openFilter}>
              <i className="material-icons color--black md-18 opa-80 DN">filter_list</i>
              <div className="color--black">Filter</div>
            </button>*/}


            {/** -------- AUTHOR CONTROLS **/}
                      <div className="border-top--primary--3 test00 brdr-top it-author-controls w-max flx flx-row flx-just-start flx-align-center ta-center pdding-top-sm pdding-bottom-sm DN">
                        <div className="w-100 flx flx-row flx-just-start flx-align-center ta-center">


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
                          <div className="cta-wrapper flx flx-row vb vb--sm vb--outline--none fill--primary color--white flx-item-right pdding-right-lg pdding-left-lg"
                            onClick={this.shareGuide} >
                            <div className="color--white mrgn-right-sm">SHARE GUIDE</div>
                            <i className="material-icons mrgn-left-sm color--white flip-h">reply</i>
                            <i className="material-icons color--white DN">accessibility</i>
                          </div>


                          <div className="flx-item-right flx flx-row flx-align-center">

                            <div className="v2-type-h4 mrgn-right-md mobile-hide">Share this Guide:</div>

                            <div className="vb vb--sm vb--outline--none color--black color--white mrgn-right-xs vb--fb">
                              <FacebookShareButton
                                url={Constants.VIEWS_URL + `/guide/${this.props.itineraryId}`}
                                quote={'Check out my travel guide "' + itinerary.title + '" for '}
                                hashtag={'#views'}
                                onClick={onPostClick(Constants.FACEBOOK_POST)}
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

                            <div className="vb vb--sm vb--outline--none color--black mrgn-right-xs vb--tw">
                              <TwitterShareButton
                                url={Constants.VIEWS_URL + `/guide/${this.props.itineraryId}`}
                                title={'Check out my travel guide "' + itinerary.title + '" for ' + ':'}
                                hashtags={['views']}
                                onClick={onPostClick(Constants.TWITTER_POST)}
                                className="Demo__some-network__share-button">
                                <TwitterIcon
                                  size={24}
                                  round />
                              </TwitterShareButton>
                              <i className="material-icons color--primary md-18 DN">share</i>
                            </div>

                            <CopyToClipboard 
                              className="flx flx-row flx-center-all vb vb--sm vb--outline fill--white color--black"
                              text={Constants.VIEWS_URL + '/guide/' + itinerary.id}
                              onCopy={onCopyClick}>
                                <div className="flx flx-row flx-center-all w-100">
                                  <i className="material-icons color--black opa-60 flx-item-left DN">link</i>
                                  <div className="mobile-hide">Copy&nbsp;</div>
                                  <div className="">URL</div>
                                </div>
                            </CopyToClipboard>


                          </div>
                        </div>{/** END MAX div **/}

                      </div>
                      {/** AUTHOR CONTROLS >>>>>> **/}


            
            <div className="content-wrapper itinerary flx flx-col flx-align-center map-on">

              {/** Cover Image **/}
              <div className="itinerary__big-photo bg-loading country-color- fill--light-gray">
                {/**+ itinerary.geo.country}**/}
                <ImagePicker images={itinerary.images ? [itinerary.images] : null} max-w="1280" h="400"/>
                <div className={'flx flx-col flx-center-all v2-type-body3 cover__loading loading-done-' + this.props.coverPicProgress}>
                  Uploading New Cover Photo...
                </div> 
                <div className="vb--change-cover">
                <UpdateCoverPhoto isUser={isUser} itinerary={itinerary} itineraryId={itinerary.id} 
                  uploadCoverPhoto={this.props.uploadCoverPhoto} authenticated={this.props.authenticated} />
                </div>
              </div>


              

              {/** Cover Content **/}
              <div className="itinerary__cover__text w-100">
                

                <div className="it__cover__inner flx flx-col flx-just-start ta-left w-100 w-max">
                  <div className="flx flx-row w-100 flx-align-center flx-just-start mrgn-bottom-sm">

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
                      <Link to={`/places/${itinerary.geo.placeId}`} className="flx flx-row flx-just-start flx-align-center w-50">
                        <div className={'itinerary__cover__flag flx-hold invert flag-' + itinerary.geo.country}>
                        </div>
                        <div className="geo-type ellipsis mrgn-left-sm ta-left invert">
                        {itinerary.geo.label}
                        </div>
                      </Link>

                  </div>


                {/** <<<<<< CENTER INFO **/}
                <div className="it__title-module flx flx-col flx-just-start flx-align-start ta-center w-100">
                

                  {/** TITLE **/}
                  
                  <div className="guide-title ta-left w-100 invert">
                    {itinerary.title}
                  </div>

                

                  {/** DESCRIPTION **/}
                  <div className="itinerary__cover__descrip v2-type-body2 font--beta ta-left mrgn-top-xs mrgn-bottom-sm opa-60 invert w-100">
                     {itinerary.description}
                  </div>

                
                 

                  <div className="it-actions-row w-100 flx flx-row flx-align-center flx-just-start ta-left opa-40 mrgn-bottom-sm">
                    {/** TIMESTAMP **/}
                    <div className="itinerary__cover__timestamp v2-type-caption ta-left invert color--black">
                      Updated &nbsp;
                      <DisplayTimestamp timestamp={itinerary.lastModified} />
                      {/*(new Date(itinerary.lastModified)).toLocaleString()*/}
                    </div> 

                     {/** Source Link **/}
                    { itinerary.link &&
                    <a href={itinerary.link} target="blank" className="itinerary__cover__source v2-type-caption mrgn-left-sm color--black invert">
                       <div className="ellipsis">Source Link</div>
                    </a>
                    }
                  </div>


                  <div className="flx flx-row flx-just-start flx-align-center w-100 mrgn-top-sm">
                    <div className="tooltip-wrapper">
                      <FollowItineraryButton
                        authenticated={this.props.authenticated}
                        canModify={canModify}
                        itinerary={itinerary}
                        isFollowingItinerary={this.props.isFollowingItinerary}
                        hideSubscribeTip={this.props.userInfo && this.props.userInfo.flags && this.props.userInfo.flags.hideSubscribeTip}
                        />
                        {(this.props.userInfo && (!this.props.userInfo.flags || !this.props.userInfo.flags.hideSubscribeTip)) && 
                          <div className="help-- arrow-up help--subscribe flx flx-row flx-align-start color--white bx-shadow">
                            <i className="material-icons color--white md-24 mrgn-left-xs DN">arrow_upward</i>
                            <div className="flx flx-col flx-just-start color--white">
                              <div className="v2-type-body2 ta-left">Subscribe to guides you care about. We'll let you know whenever they get updated with new tips.</div>
                              <Link className="vb vb--xs vb--outline--none fill--none hover--white10 flx-item-right color--white" onClick={onSubscribeTooltipOkay}>Okay</Link>
                            </div>
                          </div>
                        }
                      </div>

                      <div className="color--black v2-type-caption mrgn-left-sm invert">{this.props.numGuideFollows} subscribers</div>
                  </div>


                  

                

                  </div>

                </div>
                {/** >>>>>> CLOSE CENTER INFO **/}

                <div className="flx flx-row flx-align-center w-100 pdding-all-sm pdding-top-xs pdding-bottom-sm fill--white">
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



              </div>
              {/** Close Cover Text DIV >>>>>> **/}

              <div className="w-100 flx flx-row flx-center-all pdding-all-sm DN">
                <Link className="vb vb--md fill--white color--black w-100 flx flx-row flx-center-all vb--outline ta-center" onClick={openFilter}>
                  <i className="material-icons color--black opa-60 mrgn-right-sm">filter_list</i>
                    
                </Link>
              </div>

              <div className="itinerary__tipslist flx flx-col flx-align-center fill--light-gray w-100 pdding-bottom-lg">
                <Sticky bottomOffset={140} className={'sticky-class'}>
                  <div className="it-add-container give-rec-wrapper flx flx-row flx-align-center">
                    {renderGeoSuggestRec(itinerary.geo)}
                  </div>
                </Sticky>

                <div className="flx flx-row w-100 flx-align-center flx-just-space-between pdding-left-xs pdding-right-xs pdding-top-xs">
                  
                  <div className="pdding-all-sm fill--none v2-type-body1 color--black mrgn-right-xs">{/*itinerary.reviewsCount ? itinerary.reviewsCount : 0*/}
                  {visibleTips.length}/{numTotalTips} Items</div>
                  
                  <Link className="vb vb--xs flx flx-row fill--none flx-center-all ta-center" onClick={openFilter}>
                    <i className="material-icons color--black opa-80 mrgn-right-sm md-18">filter_list</i>
                    <div className="color--black">Filter{/*numVisibleTags}/{numTotalTips*/} {/*Showing 4/10 Categories */}</div>
                  </Link>


                </div>
                <TipList
                  tipList={visibleTips}
                  reviewsCount={itinerary.reviewsCount}
                  authenticated={this.props.authenticated}
                  userInfo={this.props.userInfo}
                  showModal={this.props.showModal}
                  deleteComment={this.props.onDeleteComment}
                  itineraryId={this.props.itinerary.id}
                  itinerary={itinerary}
                  canModify={canModify}
                  dataType={Constants.TIPS_TYPE}
                  selectedMarker={this.props.selectedMarker}
                  onSelectActiveTip={this.props.onSelectActiveTip}
                  deleteRec={this.deleteRec}
                  />


                 <div className="flx flx-col w-100 fill--white brdr-top pdding-top-lg pdding-bottom-lg mrgn-top-lg">
                     <div className="comments-section-title w-100 color--black pdding-left-lg pdding-right-lg">
                     Recommendations from friends
                     </div>


                  {/* Tip List for recommendations */}
                    <TipList
                      tipList={this.props.recommendations}
                      authenticated={this.props.authenticated}
                      userInfo={this.props.userInfo}
                      showModal={this.props.showModal}
                      deleteComment={this.props.onDeleteComment}
                      itineraryId={this.props.itinerary.id}
                      itinerary={itinerary}
                      dataType={Constants.RECOMMENDATIONS_TYPE}
                      selectedMarker={this.props.selectedMarker}
                      onSelectActiveTip={this.props.onSelectActiveTip}
                      changeRating={this.changeRating}
                      changeCaption={this.changeCaption}
                      deleteRec={this.deleteRec} />
                  </div>

                  <div className="DN bx-shadow big-share-button cta-wrapper flx flx-col flx-center-all vb vb--sm vb--outline--none fill--primary color--white"
                    onClick={this.shareGuide} >
                    <i className="material-icons color--white flip-h md-36 mrgn-bottom-md">reply</i>
                    <i className="material-icons color--white DN">accessibility</i>
                    <div className="color--white weight-700 v2-type-h3">Share this Guide</div>
                  </div>


              </div>

              <div className="itinerary__comments-module flx flx-col brdr-top flx-align-start flx-just-start w-max-2" id="guidecommentcontainer">
                <div className="comments-section-title mrgn-bottom-md ta-left w-100">
                  Discussion
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

                <div className="itinerary__related-module flx flx-col flx-align-center fill--white w-100 pdding-bottom-lg">
                  <RelatedItineraries
                    relatedItineraries={this.props.relatedItineraries} 
                    numRelated={this.props.numRelated}
                    authenticated={this.props.authenticated}
                    like={this.props.likeReview}
                    unLike={this.props.unLikeReview} />
                </div>

                <BackToTop />
                
            </div> {/*Content Wrapper*/}
            
            <div className="it-map-container fill--primary">
              <MapContainer itinerary={itinerary} visibleTips={visibleTips} google={google} />
            </div>

        

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
              image={itinerary.images ? itinerary.images.url : null}
            />

          </div>
        )
      }
    }
  }
}

export default GoogleApiWrapper({
  apiKey: Constants.GOOGLE_API_KEY
}) (connect(mapStateToProps, Actions)(Itinerary));

// export default connect(mapStateToProps, Actions)(Itinerary);