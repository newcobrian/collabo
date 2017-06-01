import React, { Component } from 'react';
import {connect} from 'react-redux'
import {Field, FieldArray, reduxForm} from 'redux-form';
import validate from './validate';
import {load as loadItinerary} from '../reducers/editor'
import { Link } from 'react-router';
import Dropzone from 'react-dropzone';

const renderField = ({input, label, placeholder, min, max, classname, type, meta: {touched, error}}) => (
  <div className="field-wrapper"> 
    <label>{label}</label>
    <div>
      <input {...input} type={type} min={min} max={max} className={classname} placeholder={placeholder} />
      {touched && error && <span>{error}</span>}
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

const renderReviews = ({fields, meta: {error, submitFailed}}) => (
  <ul>
    {fields.map((review, index) => (
      <li key={index}>
        <div className="flx flx-col itinerary__edit-tip mrgn-bottom-sm">
          <div className="temp-text">  
            <div className="flx flx-row">
              <div className="v2-type-h4">Tip #{index + 1}</div>
              <button
              type="button"
              className="v-button v-button--light v-button--warning tip-delete flex-item-right"
              title="Remove Review"
              onClick={() => fields.remove(index)}>Delete Tip</button>
            </div>



            <Field
              name={`${review}.title`}
              type="text"
              component={renderField}
              label="Tip Name"
              placeholder="Golden Boy Pizza"
              classname="input--underline edit-tip__name"
            />
            <Field
              name={`${review}.address`}
              type="text"
              component={renderField}
              label="Address"
              placeholder="1100 West Street"
              classname="input--underline edit-tip__address"
            />
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
              <div className="field-wrapper field-wrapper--dropzone"> 
                <Field
                name={`${review}.images`}
                component={renderDropzoneInput}/>
              </div>

              {/*<div className="edit-tip__rating-total opa-30">/10</div>*/}
            </div>

            <div className="field-wrapper"> 
              <label>Caption</label>
              <Field
                name={`${review}.caption`}
                type="text"
                component="textarea"
                rows="6"
                label="Description"
                placeholder="Write some tips..."
                classname="edit-tip__caption"
              />
            </div>
          </div>

        </div>
      </li>
    ))}
    <li>
      <button className="v-button" type="button" onClick={() => fields.push({})}>Add a tip</button>
      {submitFailed && error && <span>{error}</span>}
    </li>
  </ul>
)

let EditItineraryForm = props => {
  const {handleSubmit, pristine, reset, submitting} = props

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
            component={renderDropzoneInput}/>
          </div>
          
        </div>

        <div className="flx flx-col itinerary__tiplist">
          <FieldArray name="itinerary.reviews" component={renderReviews} />
        </div>

      </div>

      {/* Edit Bar */}  
      <div className="edit-bar flx flx-row flx-just-end flx-align-center">
        <div className="mrgn-right-lg">
          <Link to={'itinerary/' + props.itineraryId} className="v-button v-button--light" type="submit" disabled={submitting}>Cancel</Link>
        </div>
        <div>
          <button className="v-button v-button--full" type="submit" disabled={submitting}>Save & Exit</button>
        </div>
      </div>
    </div>
    </form>
  )
}

// export default EditItineraryForm = reduxForm({
//   form: 'EditItinerary', // a unique identifier for this form
//   validate
// })(EditItineraryForm)

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