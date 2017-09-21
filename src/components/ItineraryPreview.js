import React from 'react';
import { Link } from 'react-router';
import LikeReviewButton from './LikeReviewButton';
import ProfilePic from './ProfilePic';
import ImagePicker from './ImagePicker';
import ItineraryActions from './ItineraryActions';
import * as Constants from '../constants';
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
     <div className="ellipsis w-100 opa-30">
     {/**{props.itinerary.createdBy.username} hasn't written anything about this itinerary yet...**/}
     </div>
    )
  }
}

const CommentPreview = props => {
  if (props.itinerary.lastComment) {
    return (
      <Link to={`/guide/${props.itinerary.id}`}>

        <div className="comment-preview-bubble flx flx-row flx-just-start flx-align-center color--black">
          <div className="DN comment-author-img mrgn-right-sm flx-hold">
            <Link
              to={`/${props.itinerary.lastComment.username}`}
              >
              <ProfilePic src={props.itinerary.lastComment.image} className="center-img" />
            </Link>
          </div>

          <div className="comment-preview-wrapper v2-type-body0 color--black flx flx-row flx-align-center">
            <div className="new-bubble fill--primary mrgn-right-sm flx-hold"></div>
            <Link
              to={`/${props.itinerary.lastComment.username}`}
              className="comment-author color--black">
              {props.itinerary.lastComment.username}
            </Link>
            <div className="ellipsis comment-text">
              {props.itinerary.lastComment.body}
            </div>
          </div>
        </div>


        <div className="vb vb--sm vb--outline flx-align-center mrgn-left-n-1 cta-wrapper flx flx-row flx-just-end flex-item-right last-comment">
          <div className="flx flx-row flx-just-end flx-align-center">
            <div className="cta-icon cta-comment comment-on"></div>
            <div className="v2-type-body1 weight-500">{props.itinerary.commentsCount}</div>
          </div>
        </div>
      </Link>
    )
  }
  else {
    return (
      <Link to={`/guide/${props.itinerary.id}`}>
        <div className="vb vb--sm vb--outline cta-wrapper flx flx-row flx-center-all no-comments">             
             <div className="cta-icon cta-comment"></div>
             <div className="v2-type-body1 weight-500">0</div>
        </div>
      </Link>
    )
  }
}

const GeoInfo = props => {
  if (!props.geo) {
    return null;
  }
  else {
    return (
      <Link to={`/places/${props.geo.placeId}`}>
        <div className="flx flx-row flx-just-start flx-align-center">
          {/** Flag and Geo **/}
          <div className={'itinerary__cover__flag flx-hold flag-' + props.geo.country}>
          </div>
          <div className="geo-type ellipsis opa-50">
            {props.geo.label}
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
  
  if (props.type === Constants.SMALL_GUIDE_PREVIEW) {
    return (
      <div className={"pdding-top-sm pdding-bottom-sm mrgn-bottom-md flx flx-row flx-align-center w-100 " + props.type}>
          
            {/** USER PHOTO **/}
            <div className="itinerary__cover__author-photo mrgn-right-md">
                <Link
                to={`/${itinerary.createdBy.username}`}
                className="">
                <ProfilePic src={itinerary.createdBy.image} className="center-img" />
                </Link>
            </div>
            <div className="flx flx-col">
              {/** TITLE - START  **/}
              <Link to={`/guide/${itinerary.id}`}>
              <div className="guide-preview-title ta-left mrgn-bottom-xs mrgn-top-xs">
                {itinerary.title}
              </div>
              </Link>
              {/** END - TITLE **/}
              <div className="flx flx-row flx-just-start flx-align-center">
                 <div className={'itinerary__cover__flag flx-hold flag-' + itinerary.geo.country}>
                </div>
                {/** USERNAME **/}
                <div className="itinerary__cover__username mrgn-right-md">
                  <Link
                  to={`/${itinerary.createdBy.username}`}
                  className="color--black opa-40">
                  {itinerary.createdBy.username} &middot; {itinerary.reviewsCount ? itinerary.reviewsCount : 0} {itinerary.reviewsCount === 1 ? ' Tip' : ' Tips'}
                  </Link>
                </div>
                {/** END USERNAME **/}


              </div>
            </div>



      </div>
      )
  } 
  else {
    return (
      <div className={"itinerary__cover flx flx-col bx-shadow " + props.type + " " + props.guideLabel}>
        
        {/** START USER PHOTO AND TIP COUNT **/}
        <div className="itinerary__cover__topbar flx flx-row flx-align-center w-100 w-max flx-hold flx-just-start v2-type-body1 mrgn-bottom-sm">
          
          {/** USER PHOTO **/}
          <div className="itinerary__cover__author-photo mrgn-right-md">
              <Link
              to={`/${itinerary.createdBy.username}`}
              className="">
              <ProfilePic src={itinerary.createdBy.image} className="center-img" />
              </Link>
          </div>

          {/** USERNAME **/}

            <div className="itinerary__cover__username mrgn-right-md">
              <Link
              to={`/${itinerary.createdBy.username}`}
              className="color--primary">
              {itinerary.createdBy.username}
              </Link>
            </div>

          {/** TIMESTAMP **/}
          <div className="itinerary__cover__timestamp flx-item-right ta-left opa-70">
            <DisplayTimestamp timestamp={itinerary.lastModified} />
          </div> 
        
        </div>
        {/** END USER PHOTO AND TIP COUNT **/}

        <div className="itinerary__contents flx flx-col w-100">
          {/** START IMAGES **/}
          <div className="itinerary__book w-100 flx-hold bg-loading">
            <div className="guide-label fill--primary color--white">
              Featured
            </div>

            {/** Cover Image **/}
            <div className="itinerary__cover__image bg-loading">
              <ImagePicker images={itinerary.images ? [itinerary.images]: null} />
            </div>
            {/** Cover Hit Area **/}
            <Link className="itinerary__hit-area" to={`/guide/${itinerary.id}`}>
              <div></div>
            </Link>
            {/** Cover Content **/}
            
          </div>
          {/** END IMAGES **/}


          <div className="guide-preview-data-wrapper flx flx-col flx-align-start ta-left w-100">
              
              {/** CAPTION ROW - START **/}
              <div className="geo-wrapper flx flx-row flx-just-start flx-align-center mrgn-bottom-xs w-100 mrgn-top-xs">

                {/** GEO - START **/}
                <GeoInfo geo={itinerary.geo} />          
                {/** END - GEO ROW **/}

              </div>
              {/** END - CAPTION ROW **/}



              {/** TEXT CONTAINER - START **/}
              <div className="guide-preview-text-wrapper w-100 flx flx-col">

                {/** TITLE - START  **/}
                <Link to={`/guide/${itinerary.id}`}>
                <div className="guide-preview-title ta-left mrgn-bottom-xs mrgn-top-xs">
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
              <div className="guide-cta-wrapper flx flx-row flx-center-all w-100">

                {/** LIKE AND COMMENTS **/}
                <div className="it__cover__cta-module flx flx-row flx-just-end">
                  <CommentPreview itinerary={props.itinerary} />

                  <div className="vb vb--sm vb--outline flx flx-row flx-align-center mrgn-right-sm cta-wrapper flx flx-row flx-just-end flex-item-right mrgn-left-n-1">
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

                {/** TIP COUNT **/}
                <Link to={`/guide/${itinerary.id}`} className="vb vb--sm vb--outline tip-count color--primary v2-type-body3 flx flx-row flx-just-start flx-align-center color--primary flx-item-right no-uppercase">
                    <div>{itinerary.reviewsCount ? itinerary.reviewsCount : 0} {itinerary.reviewsCount === 1 ? ' Tip' : ' Tips'}</div>
                    <i className="DN material-icons mrgn-left-sm color--primary md-24">playlist_play</i>
                </Link>

              </div>
              {/** END - CTA ROW **/}


             

          </div> {/** ----- Close Cover Text DIV ----- **/}
        </div>



      
      </div>
    
  );
}
}

export default ItineraryPreview;