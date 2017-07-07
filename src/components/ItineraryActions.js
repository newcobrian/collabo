import React from 'react';
import * as Actions from '../actions';
import { connect } from 'react-redux';

const ItineraryActions = props => {
  const del = () => {
    props.deleteItinerary(props.itinerary, props.redirectPath);
  };

  if (props.canModify) {
    return (
      <div>
{/***}        <Link
          to={`/editor/${subject.slug}`}
          className="btn btn-outline-secondary btn-sm">
          <i className="ion-edit"></i> Edit Article
        </Link>
      ***/}

        <button className="vb vb--light vb--no-outline w-100" onClick={del}>
          {/*<img src="../img/icon32_x.svg"/>*/} Delete
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