import React, { Component } from 'react';
import {connect} from 'react-redux'
import {Field, FieldArray, reduxForm} from 'redux-form';
import validate from './validate';
import {load as loadItinerary} from '../reducers/editor'

const renderField = ({input, label, type, meta: {touched, error}}) => (
  <div>
    <label>{label}</label>
    <div>
      <input {...input} type={type} placeholder={label} className="input--underline" />
      {touched && error && <span>{error}</span>}
    </div>
  </div>
)

const renderReviews = ({fields, meta: {error, submitFailed}}) => (
  <ul>
    {fields.map((review, index) => (
      <li key={index}>
        <div className="flx flx-row-top itinerary__edit-tip mrgn-bottom-lg">
          <div className="temp-image">
            upload image
            {/**}        <Field 
            name={`${review}.image`}
            type="file"
            accept="image/*" 
            component={renderField}
            label="Image"
          /> **/}
          </div>

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
              label="Place"
            />
            <Field
              name={`${review}.address`}
              type="text"
              component={renderField}
              label="Address"
            />
            <Field
              name={`${review}.rating`}
              type="number"
              min="0"
              max="10"
              component={renderField}
              label="Rating"
            />
            <label>Caption</label>
            <Field
              name={`${review}.caption`}
              type="text"
              component="textarea"
              rows="8"
              label="Caption"
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
            <label>Caption</label>
            <Field name="itinerary.description" component="textarea" rows="12" type="text" label="Description" />
          </div>
          <div>
            <button className="v-button mrgn-top-lg" type="submit" disabled={submitting}>Save & Exit</button>
          </div>
          <div>
            <button className="v-button v-button--light mrgn-top-sm" type="submit" disabled={submitting}>Exit without Saving</button>
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
    initialValues: state.editor.data
  }),
  {load: loadItinerary} // bind account loading action creator
)(EditItineraryForm)

export default EditItineraryForm