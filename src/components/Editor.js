import ListErrors from './ListErrors';
import React from 'react';
import { connect } from 'react-redux';
import * as Actions from '../actions';
import * as Constants from '../constants';
import EditItineraryForm from './EditItineraryForm';

const mapStateToProps = state => ({
  ...state.editor,
  authenticated: state.common.authenticated
});

class Editor extends React.Component {
  constructor() {
    super();

    this.submitForm = (values) => {
        // console.log('VALUES = ' + JSON.stringify(values))
        this.props.onEditorSubmit(this.props.authenticated, this.props.itineraryId, values.itinerary);
    };
  }

  componentWillMount() {
    if (this.props.params.iid) {
        this.props.onEditorLoad(this.props.authenticated, this.props.params.iid);
        // if (navigator.geolocation) {
        //   let watchId = navigator.geolocation.watchPosition(this.props.showPosition);
        //   this.props.setWatchPositionId(watchId);
        // }
    }
    this.props.sendMixpanelEvent('Itinerary page loaded');
  }

  componentWillUnmount() {
    this.props.onEditorUnload(this.props.itineraryId);
    // if (this.props.watchId) navigator.geolocation.clearWatch(this.props.watchId);
  }

  render() {
    return (
      <EditItineraryForm 
        onSubmit={this.submitForm}  />
    )
  }
}

export default connect(mapStateToProps, Actions)(Editor);