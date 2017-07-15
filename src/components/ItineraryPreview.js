import React from 'react';
import { Link } from 'react-router';
import LikeReviewButton from './LikeReviewButton';
import ProfilePic from './ProfilePic';
import ImagePicker from './ImagePicker';
import ItineraryActions from './ItineraryActions';
import FORWARD from '../constants';
import { FORWARD_MODAL, REVIEW_MODAL } from '../actions';
import { ITINERARY_TYPE } from '../constants';
import DisplayTimestamp from './DisplayTimestamp';

/* Displays user entered caption -OR- empty message if user has not entered caption */ 
const DescriptionPreview = props => {
  if (props.itinerary.description) {
    return (
      <div className="ellipsis w-100">{props.itinerary.description}</div>
    )
  }
  else {
    return (
     <div className="ellipsis w-100 opa-30">{props.itinerary.createdBy.username} hasn't written anything about this itinerary yet...</div>
    )
  }
}

const CommentPreview = props => {
  if (props.itinerary.lastComment) {
    return (
      <Link to={`/guide/${props.itinerary.id}`}>

        <div className="comment-preview-bubble flx flx-row flx-center-all">
          <div className="comment-author-img mrgn-right-sm">
            <Link
              to={`/${props.itinerary.lastComment.username}`}
              >
              <ProfilePic src={props.itinerary.lastComment.image} className="center-img" />
            </Link>
          </div>

          <div className="comment-preview-wrapper v2-type-body1 flx flx-row mrgn-right-sm">
            <Link
              to={`/${props.itinerary.lastComment.username}`}
              className="comment-author">
              {props.itinerary.lastComment.username}
            </Link>
            <div className="ellipsis comment-text">
              {props.itinerary.lastComment.body}
            </div>
          </div>
        </div>


        <div className="cta-wrapper flx flx-row flx-just-end flex-item-right last-comment mrgn-right-sm">
          
          <div className="flx flx-row flx-just-end flx-align-center">

            <div className="v2-type-body1">{props.itinerary.commentsCount}</div>
            <div className="cta-icon cta-comment comment-on"></div>

          </div>
        </div>
      </Link>
    )
  }
  else {
    return (
      <Link to={`/guide/${props.itinerary.id}`}>
        <div className="cta-wrapper flx flx-row flx-just-end flex-item-right flx-row-reverse no-comments mrgn-right-sm">
          <div className="flx flx-row flx-just-end flx-align-center">
             <div className="v2-type-body1">0</div>
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
  const canModify = props.authenticated && props.itinerary.createdBy &&
      props.authenticated === props.itinerary.createdBy.userId;

  return (


    <div className="itinerary__cover flx flx-col">
      
      {/** START USER PHOTO AND TIP COUNT **/}
      <div className="itinerary__cover__topbar flx flx-row flx-align-center w-100 w-max flx-just-start v2-type-body1 mrgn-bottom-sm">
        
        {/** USER PHOTO **/}
        <div className="itinerary__cover__author-photo mrgn-right-md">
            <Link
            to={`/${itinerary.createdBy.username}`}
            className="">
            <ProfilePic src={itinerary.createdBy.image} className="center-img" />
            </Link>
        </div>

        {/** USERNAME **/}
        <div className="flx flx-col flx-just-center flx-align-start">
          <div className="itinerary__cover__username mrgn-right-md">
            <Link
            to={`/${itinerary.createdBy.username}`}
            className="">
            {itinerary.createdBy.username}
            </Link>
          </div>
        </div>
        {/** TIMESTAMP **/}
        <div className="itinerary__cover__timestamp flx-item-right ta-left opa-50">
          <DisplayTimestamp timestamp={itinerary.lastModified} />
        </div> 
      
      </div>
      {/** END USER PHOTO AND TIP COUNT **/}

      {/** START IMAGES **/}
      <div className="itinerary__book cover-height w-100">

        {/** Cover Image **/}
         <Link className="itinerary__cover__image cover-height" to={`/guide/${itinerary.id}`}>
          <ImagePicker images={itinerary.images ? [itinerary.images]: null} />
        </Link>
        {/** Cover Overlay **/}
        <div className="itinerary__cover__overlay cover-height DN">
          <img className="cover-height DN" src="../img/cover-overlay.png"/>
        </div>
        {/** Cover Hit Area **/}
        <Link className="it__hit-area DN" to={`/guide/${itinerary.id}`}>
          <div></div>
        </Link>
        {/** Cover Content **/}
        
      </div>
      {/** END IMAGES **/}


    <div className="itinerary__cover__text flx flx-col flx-align-start ta-left w-100">

      {/** <<<<<< CENTER INFO **/}
      <div className="it__center-info flx flx-col flx-align-start ta-left w-100">
        
        {/** CAPTION ROW - START **/}
        <div className="flx flx-row flx-just-start flx-align-center mrgn-bottom-sm w-100 mrgn-top-sm">

          {/** GEO - START **/}
          <Link to={`/places/${itinerary.geo.placeId}`}>
          <div className="flx flx-row flx-just-start flx-align-center">
            {/** Flag and Geo **/}
            <div className={'itinerary__cover__flag flx-hold flag-' + itinerary.geo.country}>
            </div>
            <div className="geo-type ellipsis">
              {itinerary.geo.label}
            </div>
          </div>
          </Link>
          {/** END - GEO ROW **/}
          
        </div>
        {/** END - CAPTION ROW **/}



        {/** TEXT CONTAINER - START **/}
        <div className="guide-text-wrapper w-100 flx flx-col">

          {/** TITLE - START  **/}
          <Link to={`/guide/${itinerary.id}`}>
          <div className="itinerary__cover__title ta-left v2-type-h2 mrgn-top-xs mrgn-bottom-xs">
            {itinerary.title}
          </div>
          </Link>
          {/** END - TITLE **/}

          {/** DESCRIPTION - START **/}
          <div className="itinerary__cover__descrip v2-type-body2 opa-90">
             <DescriptionPreview  itinerary={props.itinerary}/>
          </div>
          {/** END - DESCRIPTION **/}
        
        </div>
        {/** END - TEXT CONTAINER **/}


        {/** CTA - START **/}
        <div className="flx flx-row flx-center-all w-100">

          {/** TIP COUNT **/}
          <Link to={`/guide/${itinerary.id}`}>
          <div className="v2-type-body3 strong--400 flx flx-row flx-just-end flx-align-center color--primary mrgn-top-xs">
            {itinerary.reviewsCount ? itinerary.reviewsCount : 0} {itinerary.reviewsCount === 1 ? ' tip' : ' tips'}
          </div>
          </Link>

          <div className="it__cover__cta-module flx flx-row flx-just-end flx-item-right mrgn-left-md">
            <CommentPreview itinerary={props.itinerary} />
            <div className="cta-wrapper flx flx-row flx-just-end flex-item-right">
              <LikeReviewButton
                authenticated={props.authenticated}
                isLiked={props.itinerary.isLiked}
                likesCount={props.itinerary.likesCount}
                unLike={props.unLike}
                like={props.like} 
                likeObject={itinerary}
                itineraryId={itinerary.id}
                type={ITINERARY_TYPE} />
            </div>
          </div>

        </div>
        {/** END - CTA ROW **/}


      </div>
       

    </div> {/** ----- Close Cover Text DIV ----- **/}



    
    </div>
  );
}

export default ItineraryPreview;