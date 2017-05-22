import React, { Component } from 'react';
import {connect} from 'react-redux'
import {Field, FieldArray, reduxForm} from 'redux-form';
import validate from './validate';
import {load as loadItinerary} from '../reducers/editor'

const renderField = ({input, label, type, meta: {touched, error}}) => (
  <div>
    <label>{label}</label>
    <div>
      <input {...input} type={type} placeholder={label} />
      {touched && error && <span>{error}</span>}
    </div>
  </div>
)

const renderReviews = ({fields, meta: {error, submitFailed}}) => (
  <ul>
    {fields.map((review, index) => (
      <li key={index}>
        <button
          type="button"
          title="Remove Review"
          onClick={() => fields.remove(index)}
        />
        <h4>Tip #{index + 1}</h4>
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
{/**}        <Field 
          name={`${review}.image`}
          type="file"
          accept="image/*" 
          component={renderField}
          label="Image"
        /> **/}
        <Field
          name={`${review}.rating`}
          type="number"
          min="0"
          max="10"
          component={renderField}
          label="Rating"
        />
        <Field
          name={`${review}.caption`}
          type="text"
          component={renderField}
          label="Caption"
        />
      </li>
    ))}
    <li>
      <button type="button" onClick={() => fields.push({})}>Add a tip</button>
      {submitFailed && error && <span>{error}</span>}
    </li>
  </ul>
)

let EditItineraryForm = props => {
  const {handleSubmit, pristine, reset, submitting} = props
  return (
    <form onSubmit={handleSubmit}>
      <div>
          <Field name="itinerary.title" component={renderField} type="text" label="Itinerary Name" />
        </div>
        <div>
          <Field name="itinerary.description" component={renderField} type="text" label="Description" />
        </div>
        <div>
          <Field name="itinerary.geo" component={renderField} type="text" label="Location" />
        </div>

      <FieldArray name="itinerary.reviews" component={renderReviews} />
      <div>
        <button type="submit" disabled={submitting}>Submit</button>
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