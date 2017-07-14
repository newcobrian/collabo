import React, { Component } from 'react';
import {connect} from 'react-redux'
import {Field, FieldArray, reduxForm, formValueSelector} from 'redux-form';
import { EDITOR_PAGE } from '../actions'
import validate from './validate';
import {load as loadItinerary} from '../reducers/editor'
import { Link } from 'react-router';
import Dropzone from 'react-dropzone';
import FirebaseSearchInput from './FirebaseSearchInput'
import * as Constants from '../constants';
import * as Actions from '../actions';
import Firebase from 'firebase';
import ImagePicker from './ImagePicker';
import Geosuggest from 'react-geosuggest';
import {GoogleApiWrapper} from 'google-maps-react';
import Map from 'google-maps-react';

const renderField = ({input, label, placeholder, min, max, maxlength, classname, type, meta: {touched, error}}) => (
  <div className={"field-wrapper " + classname}> 
    <label>{label}</label>
    <div>
      <input {...input} type={type} min={min} max={max} maxLength={maxlength} className={classname} placeholder={placeholder} />
      {touched && error && <span>{error}</span>}
      </div>
    </div>
  )

const displayField = ({input, label, classname, placeholder, type, meta: {touched, error}}) => (
  <div>
    <label>{label}</label>
    <div className={classname}>
      {input.value}
    </div>
  </div>
) 

const renderDropzoneInput = (field) => {
  const inputField = field.input.value;
  const dropHandler = (filesToUpload, e) => {
    let obj = {files: filesToUpload, isNew: true};
    field.input.onChange(obj)
  }

  return (
    <div className="edit-tip__dropzone flx flx-col flx-just-start ta-left">
      <Dropzone
        name={field.name}
        onDrop={dropHandler}
        disablePreview={false}
        accept="image/*"
        className="edit-tip__dropzone__touch flx flx-col flx-align-center flx-just-start ta-center"
      >
        <div className="edit-tip__upload vb vb--light vb--no-outline vb-sm ta-center w-100">Upload New image</div>

        {field.meta.touched &&
          field.meta.error &&
          <span className="error">{field.meta.error}</span>}
        {inputField && inputField.files && Array.isArray(inputField.files) && (
          <ul className="mrgn-top-sm">
            { inputField.files.map((file, i) => <li key={i}>{file.name}</li>) }
          </ul>
        )}

      </Dropzone>
      
    </div>
  );
}

const renderSearchInput = (field) => {
  const searchInputCallback = (result) => {
    // result needs: subject (title, address, images) and review (caption, rating, subjectId)
    if (result && result.id) {
      Firebase.database().ref(Constants.REVIEWS_BY_SUBJECT_PATH + '/' + result.id + '/' + field.authenticated).once('value', reviewSnapshot => {
        Firebase.database().ref(Constants.SUBJECTS_PATH + '/' + result.id).once('value', subjectSnapshot => {
          let resultObject = result;
          if (subjectSnapshot.exists()) {
            // if subjectId already exists, just load info
            Object.assign(resultObject, subjectSnapshot.val(), reviewSnapshot.val());
            field.input.onChange(resultObject);
          }
          else {
            // subject doesn't exist in database, so fetch image from 4sq API
            const foursquareURL = Constants.FOURSQUARE_API_PATH + result.id.slice(4) + 
              '?client_id=' + Constants.FOURSQUARE_CLIENT_ID + 
              '&client_secret=' + Constants.FOURSQUARE_CLIENT_SECRET + '&v=20170101';
            fetch(foursquareURL).then(response => response.json())
            .then(json => {
              if (json.response.venue && json.response.venue.photos && json.response.venue.photos.groups && 
                json.response.venue.photos.groups[0] && json.response.venue.photos.groups[0].items &&
                json.response.venue.photos.groups[0].items[0]) {
                const photoURL = json.response.venue.photos.groups[0].items[0].prefix + 'original' +
                  json.response.venue.photos.groups[0].items[0].suffix;
                let reviewObject = Object.assign({}, {defaultImage: [ photoURL ]}, reviewSnapshot.val());
                Object.assign(resultObject, subjectSnapshot.val(), reviewObject);
                field.input.onChange(resultObject);
              }
              else {
                Object.assign(resultObject, subjectSnapshot.val(), reviewSnapshot.val());
                field.input.onChange(resultObject);
              }
            })
          }
        })
      })
    }
  }
  
  return (
    <FirebaseSearchInput  
      value={field.input.value}
      callback={searchInputCallback}
      searchLocation={field.searchLocation}
      placeholder={"Search for a place anywhere in the world..."}
      className="input--search" />
  )
}

let renderGeoSuggestItinerary = (field, googlemaps) => {
  const suggestSelect = result => {
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

    field.input.onChange(geoData);
  }

  return (
    <Geosuggest 
      className="input--underline"
      types={['(regions)']}
      placeholder="Search a city or country"
      required
      initialValue={field.geoSuggest}
      onSuggestSelect={suggestSelect}/>
  )
}

const renderGeoSuggestReview = (field) => {
  let latLng = {};
  if (field.searchLocation) {
    latLng = new field.googleObject.maps.LatLng(field.searchLocation.lat, field.searchLocation.lng);
  }
  // Geo suggest needs location and radius
  const suggestSelect = result => {
    let resultObject = {
      title: result.label,
      id: result.placeId,
      location: result.location
    }
    if (result.gmaps && result.gmaps.formatted_address) {
      resultObject.address = result.gmaps.formatted_address;
    }

    let service = new field.googleObject.maps.places.PlacesService(field.mapObject);
    let request = { placeId: result.placeId }
    service.getDetails(request, function(place, status) {
      if (status == field.googleObject.maps.places.PlacesServiceStatus.OK) {
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
        field.input.onChange(resultObject);
      }
      else {
        field.input.onChange(resultObject);
      }
    })
  }

  if (latLng) {
    return (
      <Geosuggest 
        className="input--underline"
        placeholder="What's your tip about? (e.g. 'Yosemite National Park' or 'W Hotel')"
        location={latLng}
        radius={1000}
        required
        initialValue={field.geoSuggest}
        onSuggestSelect={suggestSelect}/>
    )
  }
  else {
    return (
      <Geosuggest 
        className="input--underline"
        placeholder="Search for what you want to add"
        required
        initialValue={field.geoSuggest}
        onSuggestSelect={suggestSelect}/>
    )
  }
}

// if subject ID or eventually result.id exists, show subject info + review
// else if no subject ID, just show the search field
// eventually need the add custom subject button which would open up all input fields
let Review = ({ review, index, fields, authenticated, reviewObject, searchLocation, googleObject, mapObject }) => {
  const getReviewPic = reviewObject => {
    const images = reviewObject.images;
    if (images) {
      if (images.files) return images.files;
      else if (images) return images;
    }
    else if (reviewObject.defaultImage) return [{url: reviewObject.defaultImage}];
    else return null;
  }

  if (Object.keys(reviewObject).length === 0 && reviewObject.constructor === Object) {
    // empty review object, so just let the user search
    return (
      <li key={index} className="mrgn-bottom-md edit-tip_wrapper">
        <div className="flx flx-row flx-align-center pdding-top-sm pdding-bottom-sm">
          <div className="v2-type-h5">Tip #{index + 1}</div>
          <div className="vb vb--light vb--no-outline vb-sm opa-30 danger-hover flex-item-right danger-hover"
          onClick={() => fields.remove(index)}>Delete Tip</div>
        </div>
        <div className="field-wrapper"> 
          <Field
              name={`${review}`}
              type="text"
              component={renderGeoSuggestReview}
              searchLocation={searchLocation}
              authenticated={authenticated}
              googleObject={googleObject}
              mapObject={mapObject}
              label="Search for a place anywhere in the world..."
              placeholder="Search for a place anywhere in the world..."
              classname="input--underline edit-tip__name"
            />
        </div>
      </li>
    )
  }
  else {
    // we have a review object, show it
    return (
      <li key={index} className="mrgn-bottom-lg edit-tip_wrapper">
        
        { /** Top Row **/ }
        <div className="flx flx-row flx-align-center pdding-top-sm pdding-bottom-sm">
          <div className="v2-type-h5">Tip #{index + 1}</div>
          <div className="vb vb--light vb--no-outline vb-sm opa-30 flex-item-right danger-hover"
          onClick={() => fields.remove(index)}>Delete Tip</div>
        </div>

        { /** Image and Fields **/ }
        <div className="flx flx-row"> 

          { /** Image **/ }
          <div className="image-module mrgn-right-lg">
            <div className="tip__image-module">
              <ImagePicker images={getReviewPic(reviewObject)} source={EDITOR_PAGE} />
            </div>
              <Field
              name={`${review}.images`}
              component={renderDropzoneInput}/>
          </div>

          { /** Text Inputs **/ }
          <div className="text-fields"> 
            { /** rating and caption row **/ }
            <div className="field-wrapper"> 
              <Field
                name={`${review}.title`}
                type="text"
                classname="edit-tip__name"
                component={displayField}
                label="Tip Name"
              />
            </div>
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
              {/*<Field
                name={`${review}.rating`}
                type="number"
                min="0"
                max="10"
                component={renderField}
                label="Rating"
                placeholder="0"
                classname="DN input--underline edit-tip__rating"
              />*/}
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
}

Review = connect(
  (state, props) => ({
    // hasLastName: !!selector(state, `${props.member}.lastName`)
    reviewObject: selector(state, `${props.review}`),
  })
)(Review)

const renderReviews = ({fields, searchLocation, authenticated, googleObject, mapObject, meta: {error, submitFailed}}) => (
  <ul>
    {fields.map((review, index) =>
    <Review review={review} fields={fields} index={index} key={index} searchLocation={searchLocation} authenticated={authenticated} googleObject={googleObject} mapObject={mapObject} />)}
    <li>
      <div className="add-tip-wrapper">
        <button className="vb" type="button" onClick={() => fields.push({})}><img className="center-img" src="../img/icon.add--white.png"/> Add Tip</button>
        {submitFailed && error && <span>{error}</span>}
        {/*touched && error && <span>{error}</span> */}
      </div>
    </li>
  </ul>
)

const mapStateToProps = state => ({
  ...state.editor,
  authenticated: state.common.authenticated
});

class EditItineraryForm extends React.Component {
  constructor() {
    super();

    // const {handleSubmit, pristine, reset, submitting} = this.props;

    this.initMap = (mapProps, map) => {
      const {google} = this.props;
      this.props.loadGoogleMaps(google, map, EDITOR_PAGE);
    } 

    this.getItineraryImage = itineraryImages => {
      if (!itineraryImages) return null;
      if (itineraryImages.files) return itineraryImages.files;
      else if (itineraryImages.url) return [itineraryImages.url];
      else return null;
    }
  }

  render() {
    if (!this.props.googleObject) {
      return (
        <Map google={window.google}
          onReady={this.initMap}
          visible={false} >
        </Map>
      )
    }

    return ( 
      <form onSubmit={this.props.handleSubmit}>
        <div className="page-title-wrapper center-text flx flx-row flx-center-all">
          
          <div className="v2-type-page-header">Edit Itinerary</div>
          
        </div>

        <div className="flx flx-col page-common flx-just-center flx-align-center">

          <div className="container--editor flx flx-col flx-just-center flx-align-center w-100 w-max-2">

            <div className="edit-it-wrapper flx flx-row w-100 pdding-all-md">
              { /** Left Image **/ }
              {/*<div className="image-module mrgn-right-lg">
                <div className="tip__image-module no-click">
                  <ImagePicker images={this.getItineraryImage(this.props.itineraryImages)} source={EDITOR_PAGE}/>
                </div>
                <div className="">
                   <Field
                  name={`itinerary.images`}
                  component={renderDropzoneInput}
                  latitude={this.props.latitude} 
                  longitude={this.props.longitude}
                  authenticated={this.props.authenticated}/>
                </div>

              </div>*/}
              { /** >>>>>> Left Image **/ }

              {/* Right */}
              <div className="itinerary__summary ta-left">
                
                <div>
                  <label>Itinerary Name</label>
                  <Field
                  name="itinerary.title"
                  component="textarea"
                  type="text"
                  rows="1"
                  maxLength="42"
                  label="Itinerary Name"
                  className="input--underline edit-itinerary__name" />
                </div>
              
                <div className="field-wrapper"> 
                  <label>Description (optional)</label>
                  <Field
                  name="itinerary.description"
                  component="textarea"
                  rows="2"
                  maxLength="180"
                  type="text"
                  label="Description" />
                </div>

                <div>
                  <Field name="itinerary.geo" component={renderGeoSuggestItinerary} 
                    geoSuggest={this.props.geoSuggest} type="text" label="Location" 
                    classname="input--underline edit-itinerary__location" />
                </div>

              </div>
              {/* >>>>> Right */}
            </div>

            <div className="flx flx-col itinerary__tiplist">
              <FieldArray name="itinerary.reviews" 
                component={renderReviews} 
                searchLocation={this.props.searchLocation} 
                authenticated={this.props.authenticated}
                googleObject={this.props.googleObject}
                mapObject={this.props.mapObject} />
            </div>
          </div>


          {/* Edit Bar */}  
          <div className="edit-bar flx flx-center-all">
            <div className="mrgn-right-lg">
              <Link to={'/guide/' + this.props.itineraryId} className="vb vb--light vb--no-outline" type="submit" disabled={this.props.submitting}>Cancel</Link>
            </div>
            <div>
              <button className="vb" type="submit" disabled={this.props.submitting}>Save & Exit</button>
            </div>
          </div>
        </div>
    </form>
  )
  }
}

const selector = formValueSelector('EditItinerary')

EditItineraryForm = reduxForm({
  form: 'EditItinerary', // a unique identifier for this form
  validate
})(EditItineraryForm)

EditItineraryForm = connect(
  state => ({
    initialValues: state.editor.data,
    itineraryId: state.editor.itineraryId,
    // searchLocation: state.editor.searchLocation,
    // geoSuggest: state.editor.geoSuggest,
    // googleMapsObject: state.editor.googleMapsObject,
    // itineraryImages: state.editor.itineraryImages
  }),
  {load: loadItinerary} // bind account loading action creator
)(EditItineraryForm)

export default GoogleApiWrapper({
  apiKey: Constants.GOOGLE_API_KEY
}) (connect(mapStateToProps, Actions)(EditItineraryForm));

// export default EditItineraryForm