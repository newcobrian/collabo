import React from 'react';
import * as Actions from '../actions';
import { connect } from 'react-redux';

const ItineraryActions = props => {
  const del = () => {
    props.deleteItinerary(props.itinerary, props.redirectPath);
  };

  if (props.canModify) {
    return (
      <div className="mrgn-right-sm">

      <button className="vb vb--sm vb vb--sm vb--outline vb--shadow-none fill--white color--black w-100" onClick={del}>
      Delete
      </button>
      </div>

    );
  }

  return (
    <span>
    </span>
  );
};

export default connect(() => ({}), Actions)(ItineraryActions);