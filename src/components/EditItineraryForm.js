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
  const files = field.input.value;
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
        {files && Array.isArray(files) && (
          <ul className="">
            { files.map((file, i) => <li key={i}>{file.name}</li>) }
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
    var request = {
      placeId: result.placeId
    };

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

  // return null;
  // if (!field.googleMapsObject) return null;
  return (
    <Geosuggest 
      className="input--underline"
      types={['(regions)']}
      placeholder="Search a city or country"
      required
      googleMaps={field.googleMapsObject}
      initialValue={field.geoSuggest}
      onSuggestSelect={suggestSelect}/>
  )
}

const renderGeoSuggestReview = (field) => {
  const suggestSelect = result => {
    var request = {
      placeId: result.placeId
    };

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
      placeholder="Search a city or country"
      required
      googleMaps={field.googleMapsObject}
      initialValue={field.geoSuggest}
      onSuggestSelect={suggestSelect}/>
  )
}

// if subject ID or eventually result.id exists, show subject info + review
// else if no subject ID, just show the search field
// eventually need the add custom subject button which would open up all input fields
let Review = ({ review, index, fields, authenticated, reviewObject, searchLocation }) => {
  if (Object.keys(reviewObject).length === 0 && reviewObject.constructor === Object) {
    // empty review object, so just let the user search
    return (
      <li key={index} className="mrgn-bottom-md edit-tip_wrapper">
        <div className="flx flx-row flx-align-center pdding-top-sm pdding-bottom-sm">
          <div className="v2-type-h5">Tip #{index + 1}</div>
          <div className="vb vb--light vb--no-outline vb-sm opa-30 danger-hover flex-item-right"
          onClick={() => fields.remove(index)}>Delete Tip</div>
        </div>
        <div className="field-wrapper"> 
          <Field
              name={`${review}`}
              type="text"
              component={renderSearchInput}
              searchLocation={searchLocation}
              authenticated={authenticated}
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
          <div className="vb vb--light vb--no-outline vb-sm opa-30 flex-item-right"
          onClick={() => fields.remove(index)}>Delete Tip</div>
        </div>

        { /** Image and Fields **/ }
        <div className="flx flx-row"> 

          { /** Image **/ }
          <div className="image-module mrgn-right-lg">
            <div className="tip__image-module">
              <ImagePicker images={reviewObject.images || reviewObject.defaultImage} source={EDITOR_PAGE} />
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
              <Field
                name={`${review}.rating`}
                type="number"
                min="0"
                max="10"
                component={renderField}
                label="Rating"
                placeholder="0"
                classname="input--underline edit-tip__rating"
              />
              <div className="field-wrapper"> 
                <label>Caption</label>
                <Field
                  name={`${review}.caption`}
                  type="text"
                  component="textarea"
                  maxLength="120"
                  rows="2"
                  label="Description"
                  placeholder="Add a caption (optional)"
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

const renderReviews = ({fields, searchLocation, authenticated, meta: {error, submitFailed}}) => (
  <ul>
    {fields.map((review, index) =>
    <Review review={review} fields={fields} index={index} key={index} geo={searchLocation} authenticated={authenticated} />)}
    <li>
      <div className="add-tip-wrapper">
        <button className="vb" type="button" onClick={() => fields.push({})}>Add Tip</button>
        {submitFailed && error && <span>{error}</span>}
        {/*touched && error && <span>{error}</span> */}
      </div>
    </li>
  </ul>
)

let EditItineraryForm = props => {
    const {handleSubmit, pristine, reset, submitting} = props;

    // if (!props.googleMapsObject) return null;

    return ( 
      <form onSubmit={handleSubmit}>
        <div className="page-title-wrapper center-text flx flx-row flx-center-all">
          
          <div className="v2-type-page-header">Edit Itinerary</div>
          
        </div>

        <div className="flx flx-col page-common flx-just-center flx-align-center">

          <div className="container--editor flx flx-col flx-just-center flx-align-center w-100 w-max-2">

            <div className="edit-it-wrapper flx flx-row w-100 pdding-all-md">
              { /** Left Image **/ }
              <div className="image-module mrgn-right-lg">
                <div className="tip__image-module">
                  <ImagePicker images={(props.itineraryImages && props.itineraryImages.url ? [props.itineraryImages.url] : null)} source={EDITOR_PAGE}/>
                </div>
                <div className="">
                   <Field
                  name={`itinerary.images`}
                  component={renderDropzoneInput}
                  latitude={props.latitude} 
                  longitude={props.longitude}
                  authenticated={props.authenticated}/>
                </div>

              </div>
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
                  maxLength="32"
                  label="Itinerary Name"
                  className="input--underline edit-itinerary__name" />
                </div>
              
                <div className="field-wrapper"> 
                  <label>Description</label>
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
                    geoSuggest={props.geoSuggest} type="text" label="Location" 
                    googleMapsObject={props.googleMapsObject}
                    classname="input--underline edit-itinerary__location" />
                </div>
              </div>
              {/* >>>>> Right */}
            </div>

            <div className="flx flx-col itinerary__tiplist">
              <FieldArray name="itinerary.reviews" component={renderReviews} searchLocation={props.searchLocation} authenticated={props.authenticated} />
            </div>
          </div>


          {/* Edit Bar */}  
          <div className="edit-bar flx flx-row flx-just-end flx-align-center">
            <div className="mrgn-right-lg">
              <Link to={'itinerary/' + props.itineraryId} className="vb vb--full--second" type="submit" disabled={submitting}>Cancel</Link>
            </div>
            <div>
              <button className="vb vb--full" type="submit" disabled={submitting}>Save & Exit</button>
            </div>
          </div>
        </div>
    </form>
  )
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
    searchLocation: state.editor.searchLocation,
    geoSuggest: state.editor.geoSuggest,
    googleMapsObject: state.editor.googleMapsObject,
    itineraryImages: state.editor.itineraryImages
  }),
  {load: loadItinerary} // bind account loading action creator
)(EditItineraryForm)

export default EditItineraryForm