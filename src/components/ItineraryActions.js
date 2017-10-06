import React from 'react';
import * as Actions from '../actions';
import { connect } from 'react-redux';

const ItineraryActions = props => {
  const del = () => {
    props.deleteModal(props.itinerary, props.redirectPath);
  };

  if (props.canModify) {
    return (
      <div className="mrgn-left-sm mrgn-right-sm">

      <button className="vb vb--sm vb--shadow-none fill--white color--primary danger-hover" onClick={del}>
      Delete this Guide
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