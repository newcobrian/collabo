import React, { Component } from 'react';
import {connect} from 'react-redux'
import {Field, FieldArray, reduxForm} from 'redux-form';
import validate from './validate';
import {load as loadItinerary} from '../reducers/editor'
import { Link } from 'react-router';
import Dropzone from 'react-dropzone';

const renderField = ({input, label, placeholder, type, meta: {touched, error}}) => (
  <div>
    <label>{label}</label>
    <div>
      <input {...input} type={type} placeholder={placeholder} className="input--underline" />
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
    <div>
      <Dropzone
        name={field.name}
        onDrop={dropHandler}
        accept="image/*"
      >
        <div>Add your own photos</div>
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

const customFileInput = (field) => {
  delete field.input.value; // <-- just delete the value property
  return <input type="file" id="file" accept="image/*" className="temp-image" {...field.input} multiple />;
};

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



            <label>Upload Images</label>
             <Field
            name={`${review}.images`}
            component={renderDropzoneInput}/>

 {/**}           <Field 
              name={`${review}.image`}
              type="file"
              component={customFileInput}
              label="Image" />
**/}
            <Field
              name={`${review}.title`}
              type="text"
              component={renderField}
              label="Tip Name"
              placeholder="Golden Boy Pizza"
            />
            <Field
              name={`${review}.address`}
              type="text"
              component={renderField}
              label="Address"
              placeholder="1100 West Street"
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
            /><div className="rating-total v2-type-body2">/10</div>
            </div>
            <label>Caption</label>
            <Field
              name={`${review}.caption`}
              type="text"
              component="textarea"
              rows="8"
              label="Description"
              placeholder="Write some tips..."
            />
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

    <div className="page-title-wrapper center-text">
      <div className="v2-type-h2">Add Itinerary Tips</div>
    </div>

    <div className="flx flx-row page-common flx-center">

      <div className="content-wrapper itinerary flx flx-row-top">

        <div className="itinerary__summary ta-left">
          <div>
            <Field name="itinerary.title" component={renderField} type="text" label="Itinerary Name" />
          </div>
          <div>
            <Field name="itinerary.geo" component={renderField} type="text" label="Location" />
          </div>
          <div>
            <label>Description</label>
            <Field name="itinerary.description" component="textarea" rows="12" type="text" label="Description" />
          </div>
          <div>
            <button className="v-button mrgn-top-lg" type="submit" disabled={submitting}>Save & Exit</button>
          </div>
          <div>
            <Link to={'itinerary/' + props.itineraryId} className="v-button v-button--light mrgn-top-sm" type="submit" disabled={submitting}>Exit without Saving</Link>
          </div>
        </div>

        <div className="flx flx-col itinerary__tips">
          <FieldArray name="itinerary.reviews" component={renderReviews} />
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