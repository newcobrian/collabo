import React from 'react';
import { Link } from 'react-router';
import LikeReviewButton from './LikeReviewButton';
import ProxyImage from './ProxyImage';
import ImagePicker from './ImagePicker';
import ItineraryActions from './ItineraryActions';
import FORWARD from '../constants';
import { FORWARD_MODAL, REVIEW_MODAL } from '../actions';
import { ITINERARY_TYPE } from '../constants';

const CommentPreview = props => {
  if (props.comments) {
    return (
      <Link to={`itinerary/${props.itinerary.id}`}>
        <div className="cta-wrapper flx flx-row flx-just-end flex-item-right">
          <div className="flx flx-row flx-just-end flx-align-center">
            <div className="v2-type-body1">{props.itinerary.commentsCount}</div>
            <div className="cta-icon cta-comment"></div>
          </div>
        </div>
      </Link>
    )
  }
  else {
    return (
      <Link to={`itinerary/${props.itinerary.id}`}>
        <div className="cta-wrapper flx flx-row flx-just-end flex-item-right">
          <div className="flx flx-row flx-just-end flx-align-center">
             <div className="v2-type-body1"></div>
             <div className="cta-icon cta-comment"></div>
           </div>
        </div>
      </Link>
    )
  }
}

const ItineraryPreview = props => {
  if (!props.itinerary) {
    return null
  }

  const itinerary = props.itinerary;
  const canModify = props.authenticated &&
      props.authenticated === props.itinerary.createdBy.userId;

  return (
    <Link to={`itinerary/${itinerary.id}`}>
    <div className="itinerary__cover flx flx-left">

      <div className="itinerary__cover__text flx flx-col flx-align-center flx-just-space-between ta-center">
        
        {/** Hidden - Prob don't need this here **/}
        <div className="delete-wrapper DN">
          <div className="delete-button">
              <ItineraryActions 
                itinerary={itinerary} 
                authenticated={props.authenticated} 
                canModify={canModify} 
                deleteItinerary={props.deleteItinerary} 
                redirectPath={props.redirectPath} />
          </div>
        </div>


        {/** USER PHOTO AND INFO **/}
        <div className="flx flx-col flx-just-center flx-align-center ta-center mrgn-bottom-md">
          <div className="itinerary__cover__author-photo mrgn-bottom-sm">
            <ProxyImage src={itinerary.createdBy.image} className="center-img" />
          </div>
          <div className="v2-type-body1 opa-70 color--primary">
            {itinerary.reviewsCount} Tips by {itinerary.createdBy.username}
          </div>
          <div className="v2-type-mono">
            {itinerary.geo.label}
          </div>

          {/** TITLE **/}
          <Link to={`itinerary/${itinerary.id}`}>
          <div className="itinerary__cover__title ta-center v2-type-h2 mrgn-top-sm">
            {itinerary.title}
          </div>
          </Link>

          {/** DESCRIPTION **/}
          <div className="itinerary__cover__descrip ta-center flx flx-row-top mrgn-top-sm">
            <div className="flx flx-col flx-align-center">
                <div className="subject-caption v2-type-body2 pdding-top-sm">
                  {itinerary.description}
                </div> 
            </div>
          </div>

        </div>
        
        {/** CTA **/}
        <div className="flx flx-row flx-wrap flx-align-center flx-just-space-between cta-container">
          <div className="itinerary__cover__timestamp ta-center opa-40">
            {(new Date(itinerary.lastModified)).toLocaleString()}
          </div> 
          <div className="cta-box flx flx-row">
            <CommentPreview comments={props.itinerary.comments} itinerary={props.itinerary} />
            <div className="cta-wrapper flx flx-row flx-just-end flex-item-right">
              <LikeReviewButton
                authenticated={props.authenticated}
                isLiked={props.itinerary.isLiked}
                likesCount={props.itinerary.likesCount}
                unLike={props.unLike}
                like={props.like} 
                likeObject={itinerary}
                type={ITINERARY_TYPE} />
            </div>
          </div>             
        </div>

      </div> {/** ----- Close Cover Text DIV ----- **/}

      {/** Cover Image **/}
      <Link to={`itinerary/${itinerary.id}`}>
      <div className="itinerary__cover__image">
        <ImagePicker images={itinerary.images} />
      </div>
      </Link>

    {/** ----- Close itinerary__cover DIV ----- **/}  
    </div>
    </Link> 
  );
}

export default ItineraryPreview;