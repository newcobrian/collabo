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
        <div className="vb vb--light vb--outline--none mrgn-right-md">Change cover photo</div>

      </Dropzone>
      
    </div>
  );
}
    
const Tip = props => {
  console.log('props. tip = ' + JSON.stringify(props.tip))
  return (
        <li key={props.index} className="mrgn-bottom-lg edit-tip_wrapper">
        
        { /** Top Row **/ }
        <div className="flx flx-row flx-align-center pdding-top-sm pdding-bottom-sm">
          <div className="v2-type-h5">Tip #{props.index + 1}</div>
          <div className="vb vb--sm vb--shadow-none fill--white color--primary flx-item-right danger-hover"/>
          {/* onClick={() => fields.remove(index)}>Delete Tip 
          </div> */}
        </div>

        { /** Image and Fields **/ }
        <div className="flx flx-row"> 

          { /** Image **
          <div className="image-module mrgn-right-lg">
            <div className="tip__image-module">
              <ImagePicker images={getReviewPic(reviewObject)} source={EDITOR_PAGE} />
            </div>
              <Field
              name={`${review}.images`}
              component={renderDropzoneInput}/>
          </div>

          { /** Text Inputs **
          <div className="text-fields"> 
            { /** rating and caption row **/ }
            <label>Tip Name</label>
            <div className="field-wrapper"> 
              <input
                value={`${props.tip}.title`}
                type="text"
                classname="edit-tip__name"
              />
{/*}            </div>
            <div className="field-wrapper"> 
              <Field
                name={`${review}.address`}
                type="text"
                component={displayField}
                label="Address"
                classname="edit-tip__address"
              />
            </div>            
            <div className="flx flx-row">

              <div className="field-wrapper input--underline edit-tip__rating">
                <label>Rating (optional)</label>
                <Field name={`${review}.rating`} component="select">
                  <option selected value="-">-</option>
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
                </Field>
              </div>
              <div className="field-wrapper resize-ok"> 
                <label>Notes (optional)</label>
                <Field
                  name={`${review}.caption`}
                  type="text"
                  component="textarea"
                  maxLength="500"
                  rows="4"
                  label="Description"
                  placeholder="Write notes and info for others or yourself here"
                  classname="edit-tip__caption"/>
              </div> 
            </div>
            { /** >>>>>> rating and caption row **/ }
         
         </div>
        { /** >>>>>> Text Inputs **/ }

        </div>
        { /** >>>>>> Image and Fields **/ }

      </li>
      )
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

    this.suggestSelect = result => {
    let geoData = {
      label: result.label,
      placeId: result.placeId,
      location: result.location
    }

    if (result.gmaps && result.gmaps.address_components) {
      result.gmaps.address_components.forEach(function(resultItem) {
        if (resultItem.types && resultItem.types[0] && resultItem.types[0] === 'country') {
          if (resultItem.short_name) geoData.country = resultItem.short_name;
        }
      })
    }

    this.onUpdateCreateField('geo', geoData, ITINERARY_PAGE);
  }

    const updateFieldEvent =
        key => ev => this.props.onUpdateCreateField(key, ev.target.value, ITINERARY_PAGE);

    this.changeTitle = updateFieldEvent('title');
    this.changeDescription = updateFieldEvent('description');
  }

  componentWillMount() {
    console.log('mounty mount = ' + JSON.stringify(this.props.tipsList))
    if (this.props.itinerary && this.props.tipsList) {
      console.log('will mount - ' + JSON.stringify(this.props.tipsList))
      this.props.loadItineraryForm(this.props.itinerary, this.props.tipsList);
    }
  }

  componentWillReceiveProps(nextProps) {
    // console.log('next props itin = ' + JSON.stringify(nextProps.itinerary) + ' ..... next props tips = ' + JSON.stringify(nextProps.tipsList))
    // console.log('THIS PROPS itin = ' + JSON.stringify(this.props.itinerary) + ' ..... THIS TIPS = ' + JSON.stringify(this.props.tipsList))
    // if (nextProps.itinerary !== this.props.itinerary) {
    //   this.props.onUpdateCreateField('itinerary', nextProps.itinerary, ITINERARY_PAGE);
    // }
    if (nextProps.tipsList !== this.props.tipsList) {
      // this.props.loadItineraryForm(this.props.itinerary, this.props.tipsList);
      // this.props.onUpdateCreateField('tipsList', nextProps.tipsList, ITINERARY_PAGE);
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
    
    const itinerary = this.props.itinerary;
    const createdBy = this.props.createdBy;
console.log('tips = ' + JSON.stringify(this.props.tipsList))
    return (
      <form>
        <div className="flx flx-col flx-align-center page-common page-itinerary">

            <div className="content-wrapper itinerary flx flx-col flx-align-center">

              <div className="itinerary__cover flx flx-row flx-just-start header-height">
                
                {/** Cover Image **/}
                <div className="itinerary__cover__image header-height">
                  <ImagePicker images={itinerary.images ? [itinerary.images] : null} />
                </div>
                {/** Cover Overlay **/}
                <div className="itinerary__cover__overlay header-height">
                  <img className="cover-height DN" src="../img/cover-overlay.png"/>
                </div>

                {/** <<<<<< USER PHOTO AND TIP COUNT **/}
                <div className="itinerary__cover__topbar w-max flx flx-row flx-align-center flx-just-start v2-type-body1 mrgn-bottom-sm pdding-top-md">
                  <div className="itinerary__cover__author-photo">
                      <Link
                      to={`/${createdBy.username}`}
                      className="">
                      <ProfilePic src={createdBy.image} className="center-img" />
                      </Link>
                  </div>
                  <div className="flx flx-col flx-just-start flx-align-start">
                    <div className="itinerary__cover__username ta-left mrgn-right-md color--white">
                      <Link
                      to={`/${createdBy.username}`}
                      className="color--white">
                      {createdBy.username}
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
                    <Link to={`/places/${itinerary.geo.placeId}`}>
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

                        <UpdateCoverPhoto itinerary={itinerary} itineraryId={this.props.itineraryId} 
                          uploadCoverPhoto={this.props.dispatchUploadCoverPhoto} authenticated={this.props.authenticated} />

                        <ItineraryActions 
                          itinerary={itinerary} 
                          authenticated={this.props.authenticated} 
                          canModify={true} 
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
                  <input 
                    value={this.props.title}
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
                  <input
                    value={this.props.description}
                    type="textarea" 
                    maxLength="500"
                    rows="4"
                    label="Description"
                    placeholder="Write notes and info for others or yourself here"
                    className="input--underline edit-itinerary__name"
                    onChange={this.changeDescription} />
                  </div>
              </div>
            </div>
            <div className={"field-wrapper " + "input--underline edit-itinerary__name"}>
              <label>Location</label>
              <Geosuggest 
                className="input--underline"
                types={['(regions)']}
                placeholder="Search a city or country"
                required
                initialValue={this.props.initialGeo}
                onSuggestSelect={this.suggestSelect}/>
            </div>
          </div>
          <ul>
            {this.props.tips.map((tip, index) =>
              <Tip tip={tip} />)}
          </ul>
        </form>
    );
  }
}

// export default connect(mapStateToProps, Actions)(ItineraryForm);

export default GoogleApiWrapper({
  apiKey: Constants.GOOGLE_API_KEY
}) (connect(mapStateToProps, Actions)(ItineraryForm));