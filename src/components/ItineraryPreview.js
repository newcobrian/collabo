import React from 'react';
import { Link } from 'react-router';
import LikeReviewButton from './LikeReviewButton';
import ProxyImage from './ProxyImage';
import ImagePicker from './ImagePicker';
import ReviewActions from './ReviewActions';
import FORWARD from '../constants';
import { FORWARD_MODAL, REVIEW_MODAL } from '../actions';
import { ITINERARY_TYPE } from '../constants';

const CommentPreview = props => {
  if (props.comments) {
    return (
      <Link to={`itinerary/${props.itinerary.id}`}>
        <div className="cta-wrapper cta-wrapper-comment flx flx-col">
          {props.itinerary.commentsCount} Comments
        </div>
      </Link>
    )
  }
  else {
    return (
      <Link to={`itinerary/${props.itinerary.id}`}>
        <div className="cta-wrapper cta-wrapper-comment flx flx-col">

        </div>
      </Link>
    )
  }
}

const ItineraryPreview = props => {
  const itinerary = props.itinerary;
  const canModify = props.authenticated &&
      props.authenticated === props.itinerary.userId;
  return (
    <div className="itinerary__cover flx flx-left mrgn-bottom-lg">

      <div className="itinerary__cover__text flx flx-col flx-align-center flx-just-space-between ta-center">
        
        {/** DELETE BUTTON !!!! NOT FUNCTIONAL !!!! **/}
        <div className="delete-wrapper DN">
          <div className="delete-button">
              <ReviewActions review={itinerary} authenticated={props.authenticated} 
              canModify={canModify} deleteReview={props.deleteReview} reviewDetailPath={props.reviewDetailPath} />
          </div>
        </div>


        {/** USER PHOTO AND INFO **/}
        <div className="flx flx-col flx-just-center flx-align-center ta-center mrgn-bottom-md">
          <div className="itinerary__cover__author-photo mrgn-bottom-sm">
            <ProxyImage src={itinerary.createdBy.image} className="center-img" />
          </div>
          <div className="v2-type-body1 opa-30">
            {itinerary.reviewsCount} Tips by {itinerary.createdBy.username}
          </div>
          <div className="v2-type-mono">
            {itinerary.geo}
          </div>
        </div>


        {/** TITLE **/}
        <Link to={`itinerary/${itinerary.id}`}>
        <div className="text-subject-name ta-center v2-type-h2">
          {itinerary.title}
        </div>
        </Link>

        

        {/** DESCRIPTION **/}
        <div className="itinerary__cover__descrip ta-center flx flx-row-top">
          <div className="flx flx-col flx-align-center">
              <div className="subject-caption v2-type-body2 pdding-top-sm">
                {itinerary.description}
              </div> 
          </div>
        </div>

      {/** CTA **/}
        <div className="flx flx-row flex-wrap flx-just-space-between cta-container">
          <div className="review-timestamp ta-center">
            {(new Date(itinerary.lastModified)).toLocaleString()}
          </div> 
          <div className="cta-box flx flx-row">
            <CommentPreview comments={props.itinerary.comments} itinerary={props.itinerary} />
            <div className="cta-wrapper flx flx-row flex-item-right">
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
      </div> 

      <Link to={`itinerary/${itinerary.id}`}>
      <div className="subject-image">
        <ImagePicker images={itinerary.images} />
        {/*<ProxyImage className="gray-border" src={itinerary.subjectImage ? itinerary.subjectImage : ""}/>*/}
      </div>
      </Link>


    </div>
  );
}

export default ItineraryPreview;