import React from 'react';
import * as Actions from '../actions';
import { connect } from 'react-redux';

const ItineraryActionsButton = props => {
  const del = () => {
    props.deleteModal(props.itinerary, props.redirectPath);
  };

  if (props.canModify) {
    return (
      <div className="">

      <div className="v2-type-caption make-link" onClick={del}>
      Delete this Guide
      </div>
      </div>

    );
  }

  return (
    <span>
    </span>
  );
};

export default connect(() => ({}), Actions)(ItineraryActionsButton);