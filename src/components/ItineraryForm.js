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
        accept="image/*"
        className="edit-tip__dropzone__touch flx flx-col flx-align-center flx-just-start ta-center">
        <div className="vb vb--sm vb--round vb--shadow-none fill--white color--black opa-80">
          <i className="material-icons color--primary md-18">add_a_photo</i>
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

    const suggestSelectTip = geoSuggestRef => result => {
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
          addTipFunc(auth, resultObject, itinerary)
          geoSuggestRef._geoSuggest.clear()
        }
        else {
          addTipFunc(auth, resultObject, itinerary)
          geoSuggestRef._geoSuggest.clear()
        }
      })
    }

    const renderGeoSuggestTip = geo => {
      if (geo.location) {
        let latLng = new this.props.googleObject.maps.LatLng(geo.location.lat, geo.location.lng);
        
        return (
          <div className="it-add-wrapper w-100 w-max flx flx-row flx-align-center flx-just-start fill--primary">
            <div className="v2-type-h4 color--white flx-hold mrgn-right-md">ADD TIPS:</div>
            <i className="material-icons color--white md-36 mrgn-right-md DN">add</i>

            <Geosuggest 
              ref={el=>this._geoSuggest=el}
              className="input--underline w-100 color--black"
              placeholder={'Search for any place in ' + itinerary.geo.label}
              location={latLng}
              radius={1000}
              onSuggestSelect={suggestSelectTip(this)}/>
          </div>
        )
      }
      else return (
        <div className="it-add-wrapper w-100 w-max flx flx-row flx-align-center flx-just-start fill--primary">
          <i className="material-icons color--white md-36 mrgn-right-md">add</i>
          <Geosuggest
            ref={el=>this._geoSuggest=el}
            className="input--underline w-100 color--black"
            placeholder={'Search for any place in ' + itinerary.geo.label}
            onSuggestSelect={suggestSelectTip(this)}/>
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
          <Link name="reorderLink" onClick={onReorderClick} className="hide-in-list vb vb--sm vb--outline flx flx-row flx-align-center mrgn-right-sm">
            <i className="material-icons color--black md-18 mrgn-right-sm">low_priority</i>
            <div className="color--black">Reorder</div>
          </Link>
        )
      }
      else return (
        <Link name="reorderLink" onClick={onReorderClick} className="hide-in-list vb vb--sm vb--disabled vb--outline flx flx-row flx-align-center mrgn-right-sm">
          <i className="material-icons color--black md-18 mrgn-right-sm">low_priority</i>
          <div className="color--black">Reorder</div>
        </Link>
        )
    }

    return (
      <div className="flx flx-col flx-align-start page-common page-itinerary page-edit-own">

        <div className="content-wrapper itinerary flx flx-col flx-align-center map-on">


          {/** Cover Content **/}
          <div className="itinerary__cover__text w-100">
            <div className="it__cover__inner flx flx-row flx-just-start ta-left w-100 w-max">
              <div className="it__author-wrapper flx flx-col flx-center-all mrgn-bottom-sm">
                <div className="itinerary__cover__author-photo">
                    <Link
                    to={`/${createdByUsername}`}
                    className="">
                    <ProfilePic src={createdByImage} className="center-img" />
                    </Link>
                </div>
                <div className="itinerary__cover__username">
                  <Link
                  to={`/${createdByUsername}`}
                  className="">
                  {createdByUsername}
                  </Link>
                </div>
              </div>
             

            {/** <<<<<< CENTER INFO **/}
            <div className="it__title-module flx flx-col flx-just-start ta-center">
            
             
              {/** Flag and Geo **/}
              <div className="flx flx-row flx-just-start flx-align-center mrgn-bottom-sm mrgn-top-xs w-100">
                <Link to={`/places/${itinerary.geo.placeId}`} className={'itinerary__cover__flag flx-hold flag-' + itinerary.geo.country} />
                <div className="geo-type ellipsis w-100 flx flx-row flx-align-center flx-just-start">
                  <Geosuggest 
                    className="input--underline w-100"
                    types={['(regions)']}
                    placeholder="Search for a location (e.g. 'New York' or 'Japan')"
                    required
                    initialValue={itinerary.geo.label}
                    onSuggestSelect={this.suggestSelectGeo}/>
                </div>
              </div>

              {/** TITLE **/}
              <div className="itinerary__cover__title ta-left v2-type-h2 mrgn-bottom-xs">
                <RenderDebounceInput
                  type="text"
                  value={this.props.data.title}
                  placeholder="Title"
                  className={this.props.formErrors.title ? 'has-error' : ''}
                  debounceFunction={this.changeTitle} />
                  <DisplayError error={this.props.formErrors.title} message="Title is required"/>
              </div>

              {/** DESCRIPTION **/}
              <div className="itinerary__cover__descrip v2-type-body3 ta-left mrgn-top-sm opa-80">
                 <RenderDebounceInput
                    type="text"
                    className="w-100"
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
                <div className="w-100 w-max flx flx-row flx-just-start flx-align-center ta-center pdding-right-md">
                  <div className="flx flx-row flx-center-all">
                    <div className="it__tip-count flx flx-row flx-just-end flx-align-center opa-60 mrgn-right-md">
                      {itinerary.reviewsCount} tips
                    </div>

                    {renderReorderButton(itinerary.tips.length)}
                  </div>


                  {/* Like */}
                  <div className="cta-wrapper flx flx-row vb vb--sm vb--outline fill--white color--black mrgn-right-sm">
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

                  <div className="edit-itinerary-link vb vb--sm no-pad vb--outline fill--white color--black">             
                    <MuiThemeProvider muiTheme={getMuiTheme()}>
                      <IconMenu
                         iconButtonElement={<IconButton><MoreHorizIcon /></IconButton>}
                         anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
                         targetOrigin={{horizontal: 'left', vertical: 'top'}}
                       >
                         <ItineraryActions 
                          itinerary={itinerary} 
                          authenticated={this.props.authenticated} 
                          canModify={true} 
                          deleteItinerary={this.props.showDeleteModal} 
                          redirectPath="/" />
                       </IconMenu>
                     </MuiThemeProvider>
                  </div>

                </div>{/** END MAX div **/}

              </div>
              {/** AUTHOR CONTROLS >>>>>> **/}

              </div>

            </div>
            {/** >>>>>> CLOSE CENTER INFO **/}

          </div>
          {/** Close Cover Text DIV >>>>>> **/}  




          <div className="itinerary__cover flx flx-row flx-just-start header-height">
            
            {/** Cover Image **/}
            <div className="itinerary__cover__image header-height">
              <ImagePicker images={itinerary.images ? [itinerary.images] : null} />
              <div className={'flx flx-col flx-center-all v2-type-body3 cover__loading loading-done-' + this.props.coverPicProgress}>
                Uploading New Cover Photo...
              </div> 
              <div className="vb--change-cover">
                <UpdateCoverPhoto itinerary={itinerary} itineraryId={itinerary.id} 
                  uploadCoverPhoto={this.props.uploadCoverPhoto} authenticated={this.props.authenticated} />
              </div>
            </div>

        
            </div>
            {/** ----- Close itinerary__cover DIV ----- **/}  
            <div className="itinerary__tipslist flx flx-col flx-align-center fill--light-gray w-100 pdding-bottom-lg">

              {
                itinerary.tips.map((tip, index) => {
                  return (
                    <Element name={'tip:' + tip.key} className="tip-wrapper flx flx-col flx-col w-100 w-max" id={'tip:' + tip.key} key={tip.key}>

                       
                            <div className="tip-container flx flx-col flx-center-all w-100">
                                
                              
                                  
                                  { /** Title and Address **/ }
                                  <div className="tip__title-module flx flx-row w-100">


                                    <div className="tip__right-module flx flx-col flx-align-end">


                                      { /** Rating **/ }
                                      <div className={'mobile-show tip__rating-module flx flx-row flx-align-center flx-item-right w-100 tip__rating-module--' + tip.review.rating}>
                                        <select value={tip.review.rating} onChange={this.changeRating(tip)}>
                                          <option value="-">-</option>
                                          <option value="0">0</option>
                                          <option value="1">1</option>
                                          <option value="2">2</option>
                                          <option value="3">3</option>
                                          <option value="4">4</option>
                                          <option value="5">5</option>
                                          <option value="6">6</option>
                                          <option value="7">7</option>
                                          <option value="8">8</option>
                                          <option value="9">9</option>
                                          <option value="10">10</option>
                                        </select>
                                      </div>
                                      { /** END Rating **/ }


                                      { /** Image **/ }
                                      <div className="tip__image-module">
                                        <div className="tip__photo-count">{tip.images.length > 0 ? tip.images.length : null}</div>
                                        <ImagePicker images={tip.images} />
                                      </div>
                                      <div >
                                        <Dropzone
                                          onDrop={tipDropHandler(tip)}
                                          disablePreview={false}
                                          accept="image/*"
                                          className="edit-tip__dropzone__touch flx flx-col flx-align-center flx-just-start ta-center">
                                          <div className="vb vb--sm vb--shadow-none fill--white color--black opa-80 no-pad">
                                            <i className="material-icons color--primary md-18">add_a_photo</i>
                                          </div>

                                        </Dropzone>
                                        
                                      </div>
                                      { /** END Image **/ }


                                      <div className="tip__timestamp v2-type-caption opa-20 mrgn-top-xs DN">
                                        <DisplayTimestamp timestamp={tip.review.lastModified} />
                                      </div>
                                      
                                    </div>


                                    <div className="flx flx-col w-100">

                                        <div className="tip__title-wrapper flx flx-row flx-align-top w-100 hide-in-list">
                                          <div className="tip__order-count DN v2-type-h3">{index+1}.</div>

                                        

                                        </div>
                                      <div className="tip__content-wrapper">
                                        <div className="tip__header-wrapper flx flx-row flx-align-start flx-just-start">
                                          { /** Title **/ }
                                          <Link to={`/review/${tip.subjectId}`}>
                                          <div className="hide-in-list tip__title v2-type-h3 ta-left">
                                            <div className="tip__order-count">{index+1}</div> {tip.subject.title} 
                                          </div>
                                          </Link>
                                          { /** END Title **/ }

                                          { /** Rating **/ }
                                          <div className={'mobile-hide tip__rating-module flx flx-row flx-align-center flx-item-right w-100 tip__rating-module--' + tip.review.rating}>
                                            <select value={tip.review.rating} onChange={this.changeRating(tip)}>
                                              <option value="-">-</option>
                                              <option value="0">0</option>
                                              <option value="1">1</option>
                                              <option value="2">2</option>
                                              <option value="3">3</option>
                                              <option value="4">4</option>
                                              <option value="5">5</option>
                                              <option value="6">6</option>
                                              <option value="7">7</option>
                                              <option value="8">8</option>
                                              <option value="9">9</option>
                                              <option value="10">10</option>
                                            </select>
                                          </div>
                                          { /** END Rating **/ }

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
                                        <div className="tip__caption-module flx flx-col w-100 pdding-right-lg mrgn-bottom-sm">
                                          <div className="tip__caption v2-type-body2 ta-left opa-90">
                                            <RenderDebounceInput
                                              type="textarea"
                                              className="w-100"
                                              cols="20"
                                              wrap="hard"
                                              value={tip.review.caption}
                                              placeholder="Add a review"
                                              debounceFunction={this.changeCaption(tip)} />
                                          </div>
                                        </div>

                                        { /** Comments **/ }
                                        <div className="flx flx-row flex-wrap cta-container mrgn-left-sm">
                                           <CommentContainer
                                              authenticated={this.props.authenticated}
                                              comments={tip.comments || []}
                                              commentObject={tip}
                                              itineraryId={itinerary.id}
                                              userInfo={this.props.userInfo}
                                              type={Constants.REVIEW_TYPE}
                                              deleteComment={this.props.onDeleteComment} />
                                        </div> 
                                        {/* Action Module */}
                                        <div className="tip__cta-box w-100 flx flx-row flx-just-start flx-align-center mrgn-top-md">
                                          <Link onClick={handleSaveClick(tip)} className="hide-in-list vb vb--sm fill--primary flx flx-row flx-align-center mrgn-right-sm color--white">
                                              <i className="material-icons mrgn-right-sm color--white">playlist_add</i>
                                              <div className="color--white">ADD TO...</div>
                                          </Link>
                                          <Link onClick={onInfoClick(tip)} className="hide-in-list vb vb--sm vb--outline flx flx-row flx-align-center mrgn-right-sm">
                                            <i className="material-icons mrgn-right-sm">info_outline</i>
                                            <div className="color--black">Info</div>
                                          </Link>
                                          <div className="cta-wrapper vb vb--sm vb--outline flx flx-row flx-align-center v2-type-body2 mrgn-right-sm">
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

                                          {/* More Options button */}
                                          <div className="edit-itinerary-link vb vb--sm no-pad vb--outline fill--white color--black">             
                                            <MuiThemeProvider muiTheme={getMuiTheme()}>
                                              <IconMenu
                                                 iconButtonElement={<IconButton className=""><MoreHorizIcon /></IconButton>}
                                                 anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
                                                 targetOrigin={{horizontal: 'left', vertical: 'top'}}
                                               >
                                              <div className="vb vb--sm vb--shadow-none fill--white color--primary flx-item-right danger-hover"
                                                onClick={this.deleteTip(tip)}>Delete Tip
                                              </div>
                                                
                                               </IconMenu>
                                             </MuiThemeProvider>
                                          </div>
                                          {/* END More Options button */}
                                        
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
            {renderGeoSuggestTip(itinerary.geo)}
          </div>

          <div className="it-map-container fill--primary">
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

          <div className="itinerary__comments-module map-on flx flx-col flx-align-start flx-just-start w-max-2">
            <div className="v2-type-h3 mrgn-top-md mrgn-bottom-md ta-left w-100">
              Comments
            </div>
            <div className="v2-type-body2 mrgn-bottom-sm ta-left w-100 opa-40 DN">
              What do you think about {createdByUsername}'s View?
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
          </div>
        </div>
    );
  }
}

// export default connect(mapStateToProps, Actions)(ItineraryForm);

export default GoogleApiWrapper({
  apiKey: Constants.GOOGLE_API_KEY
}) (connect(mapStateToProps, Actions)(ItineraryForm));