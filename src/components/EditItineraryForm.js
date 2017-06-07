import React, { Component } from 'react';
import {connect} from 'react-redux'
import {Field, FieldArray, reduxForm, formValueSelector} from 'redux-form';
import validate from './validate';
import {load as loadItinerary} from '../reducers/editor'
import { Link } from 'react-router';
import Dropzone from 'react-dropzone';
import FirebaseSearchInput from './FirebaseSearchInput'
import * as Constants from '../constants';
import Firebase from 'firebase';
import ImagePicker from './ImagePicker';

const renderField = ({input, label, placeholder, min, max, classname, type, meta: {touched, error}}) => (
  <div className="field-wrapper"> 
    <label>{label}</label>
    <div>
      <input {...input} type={type} min={min} max={max} className={classname} placeholder={placeholder} />
      {touched && error && <span>{error}</span>}
      </div>
    </div>
  )

const displayField = ({input, label, placeholder, type, meta: {touched, error}}) => (
  <div>
    <label>{label}</label>
    <div>
      {input.value}
    </div>
  </div>
)

const renderDropzoneInput = (field) => {
  const files = field.input.value;
  const dropHandler = (filesToUpload, e) => {    
    field.input.onChange(filesToUpload)
  }

  return (
    <div className="edit-tip__dropzone flx flx-center-all ta-center">
      <Dropzone
        name={field.name}
        onDrop={dropHandler}
        accept="image/*"
        className="edit-tip__dropzone__touch flx flx-center-all"
      >
        <div>Upload or Drop image here</div>
      </Dropzone>
      {field.meta.touched &&
        field.meta.error &&
        <span className="error">{field.meta.error}</span>}
      {files && Array.isArray(files) && (
        <ul>
          { files.map((file, i) => <li key={i}>{file.name}</li>) }
        </ul>
      )}
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
                let reviewObject = Object.assign({}, {images: [ photoURL ]}, reviewSnapshot.val());
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
      className="form-control main-search-inner" 
      callback={searchInputCallback}
      latitude={field.latitude} 
      longitude={field.longitude}
      placeholder={"Tip Name"}
      className="input--underline" />
  )
}

// const renderSubjectInfo = (review) => {
//   if (true) {
//     return (
//       <div>
//         <Field
//           name={`${review}.address`}
//           type="text"
//           component={notInputField}
//           label="Address"
//           placeholder="1100 West Street"
//         />
//       </div>
//     )
//   }
//   else {
//     return (
//       <div>
//         <label>Upload Images</label>
//          <Field
//           name={`${review}.images`}
//           component={renderDropzoneInput}/>
//         <Field
//           name={`${review}.address`}
//           type="text"
//           component={renderField}
//           label="Address"
//           placeholder="1100 West Street"
//         />
//         <div className="flx flx-row">
//           <Field
//             name={`${review}.rating`}
//             type="number"
//             min="0"
//             max="10"
//             component={renderField}
//             label="Rating"
//             placeholder="0"
//           />
//           <div className="rating-total v2-type-body2">/10</div>
//         </div>
//         <label>Caption</label>
//         <Field
//           name={`${review}.caption`}
//           type="text"
//           component="textarea"
//           rows="8"
//           label="Description"
//           placeholder="Write some tips..."
//         />
//       </div>
//     )
//   }
// }

// if subject ID or eventually result.id exists, show subject info + review
// else if no subject ID, just show the search field
// eventually need the add custom subject button which would open up all input fields
let Review = ({ review, index, fields, authenticated, reviewObject }) => {
  if (Object.keys(reviewObject).length === 0 && reviewObject.constructor === Object) {
    // empty review object, so just let the user search
    return (
      <li key={index}>
        <div className="flx flx-row flx-align-center pdding-all-sm">
          <div className="v2-type-h5">Tip #{index + 1}</div>
          <button className="vb vb--light vb--no-outline vb-sm opa-30 flex-item-right" onClick={() => fields.remove(index)}>Delete Tip</button>
        </div>
          
        <Field
            name={`${review}`}
            type="text"
            component={renderSearchInput}
            authenticated={authenticated}
            label="Tip Name"
            placeholder="Golden Boy Pizza"
            classname="input--underline edit-tip__name"
          />
      </li>
    )
  }
  else {
    // we have a review object, show it
    return (
      <li key={index}>
        <div className="flx flx-row flx-align-center pdding-all-sm">
          <div className="v2-type-h5">Tip #{index + 1}</div>
          <div className="vb vb--light vb--no-outline vb-sm opa-30 flex-item-right"
          onClick={() => fields.remove(index)}>Delete Tip</div>
        </div>
        <div className="field-wrapper"> 
          <Field
            name={`${review}.title`}
            type="text"
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
          />
        </div>
        { /** Image **/ }
        {/*<div className="tip__image-module mrgn-bottom-sm">
          <ImagePicker images={`${review}`.images} />
        </div> */}
        <div className="flx flx-row">
          <Field
            name={`${review}.rating`}
            type="number"
            min="0"
            max="10"
            component={renderField}
            label="Rating (optional)"
            placeholder="0"
            classname="input--underline edit-tip__rating"
          />
          <div className="field-wrapper field-wrapper--dropzone"> 
            <Field
            name={`${review}.images`}
            component={renderDropzoneInput}/>
          </div>

        </div>
        <div className="field-wrapper"> 
          <label>Caption</label>
          <Field
            name={`${review}.caption`}
            type="text"
            component="textarea"
            rows="6"
            label="Description"
            placeholder="Add a caption (optional)"
            className="edit-tip__caption"/>
        </div> 
      </li>
    )
    // return (
    //   <li key={index}>
    //     <button
    //       type="button"
    //       title="Remove Tip"
    //       onClick={() => fields.remove(index)}/>
    //     <h4>Tip #{index + 1}</h4>
    //     <Field
    //       name={`${review}.title`}
    //       type="text"
    //       component={renderSearchInput}
    //       label="Tip Name"
    //       placeholder="Golden Boy Pizza"
    //       classname="input--underline edit-tip__name"
    //     />
    //     <Field
    //       name={`${review}.address`}
    //       type="text"
    //       component={renderField}
    //       label="Address"
    //       placeholder="1100 West Street"
    //       classname="input--underline edit-tip__address"
    //     />
    //     <div className="flx flx-row">
    //       <Field
    //         name={`${review}.rating`}
    //         type="number"
    //         min="0"
    //         max="10"
    //         component={renderField}
    //         label="Rating"
    //         placeholder="0"
    //         classname="input--underline edit-tip__rating"
    //       />
    //       <div className="field-wrapper field-wrapper--dropzone"> 
    //         <Field
    //         name={`${review}.images`}
    //         component={renderDropzoneInput}/>
    //       </div>
    //     </div>
    //     <div className="field-wrapper"> 
    //       <label>Caption</label>
    //       <Field
    //         name={`${review}.caption`}
    //         type="text"
    //         component="textarea"
    //         rows="6"
    //         label="Description"
    //         placeholder="Write some tips..."
    //         className="edit-tip__caption"/>
    //     </div> 
    //   </li>
    // )
  }
}

Review = connect(
  (state, props) => ({
    // hasLastName: !!selector(state, `${props.member}.lastName`)
    reviewObject: selector(state, `${props.review}`)
  })
)(Review)

const renderReviews = ({fields, authenticated, latitude, longitude, meta: {error, submitFailed}}) => (
  <ul>
    {fields.map((review, index) =>
    <Review review={review} fields={fields} index={index} key={index} authenticated={authenticated} />)}
    <li>
      <button className="vb" type="button" onClick={() => fields.push({})}>Add Tip</button>
      {submitFailed && error && <span>{error}</span>}
      {/*touched && error && <span>{error}</span> */}
    </li>
  </ul>
)

// const renderReviews2 = ({fields, authenticated, latitude, longitude, meta: {error, submitFailed}}) => (
//   <ul>
//     {fields.map((review, index) => (
//       <li key={index}>
//         <div className="flx flx-col itinerary__edit-tip mrgn-bottom-sm">
//           <div className="temp-text">  
//             <div className="flx flx-row">
//               <div className="v2-type-h4">Tip #{index + 1}</div>
//               <button
//               type="button"
//               className="v-button v-button--light v-button--warning tip-delete flex-item-right"
//               title="Remove Review"
//               onClick={() => fields.remove(index)}>Delete Tip</button>
//             </div>

//             <Field name={`${review}.title`}
//               component={renderSearchInput} 
//               label="Itinerary Name"
//               latitude={latitude}
//               longitude={longitude}
//               authenticated={authenticated} />

//             {/*renderSubjectInfo(review)*/}
//           </div>

//         </div>
//       </li>
//     ))}
//     <li>
//       <button className="v-button" type="button" onClick={() => fields.push({})}>Add a tip</button>
//       {submitFailed && error && <span>{error}</span>}
//     </li>
//   </ul>
// )

// const mapStateToProps = state => ({
//   ...state.form
// });

// class EditItineraryForm extends Component {
  // render() {
    // const {handleSubmit, pristine, reset, submitting} = this.props;
let EditItineraryForm = props => {
    const {handleSubmit, pristine, reset, submitting} = props;
    return ( 
      <form onSubmit={handleSubmit}>
        <div className="page-title-wrapper center-text flx flx-row flx-center-all">
          
          <div className="v2-type-h2">Edit Tips</div>
          
        </div>

        <div className="flx flx-col page-common flx-just-center flx-align-center">

          <div className="container--editor flx flx-col flx-just-center flx-align-center">

            <div className="itinerary__summary ta-left DN">
             

              <div>
                <Field name="itinerary.title" component={renderField} type="text" label="Itinerary Name" classname="input--underline edit-itinerary__name" />
              </div>
              <div>
                <Field name="itinerary.geo" component={renderField} type="text" label="Location" classname="input--underline edit-itinerary__location" />
              </div>
              <div className="field-wrapper"> 
                <label>Description</label>
                <Field name="itinerary.description" component="textarea" rows="8" type="text" label="Description" />
              </div>
              <div>
                <label>Upload Images</label>
                 <Field
                name={`itinerary.images`}
                component={renderDropzoneInput}
                latitude={props.latitude} 
                longitude={props.longitude}
                authenticated={props.authenticated}/>
              </div>
              
            </div>

            <div className="flx flx-col itinerary__tiplist">
              <FieldArray name="itinerary.reviews" component={renderReviews} authenticated={props.authenticated} />
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
    itineraryId: state.editor.itineraryId
  }),
  {load: loadItinerary} // bind account loading action creator
)(EditItineraryForm)

export default EditItineraryForm