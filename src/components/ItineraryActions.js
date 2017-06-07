import { Link } from 'react-router';
import React from 'react';
import * as Actions from '../actions';
import { connect } from 'react-redux';

const ItineraryActions = props => {
  const del = () => {
    props.deleteItinerary(props.authenticated, props.itinerary.id, props.itinerary.geo, props.redirectPath);
  };

  if (props.canModify) {
    return (
      <span>
{/***}        <Link
          to={`/editor/${subject.slug}`}
          className="btn btn-outline-secondary btn-sm">
          <i className="ion-edit"></i> Edit Article
        </Link>
      ***/}

        <button className="vb vb--light vb--no-outline vb-sm opa-30 mrgn-right-md" onClick={del}>
          {/*<img src="../img/icon32_x.svg"/>*/} Delete
        </button>

      </span>
    );
  }

  return (
    <span>
    </span>
  );
};

export default connect(() => ({}), Actions)(ItineraryActions);