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
      <Link to={`itinerary/${props.itinerary.id}`}>
        <div className="cta-wrapper flx flx-row flx-just-end flex-item-right last-comment">
          <div className="flx flx-row flx-just-end flx-align-center">
            <div className="comment-author-img mrgn-right-sm">
              <Link
                to={`${props.itinerary.lastComment.username}`}
                >
                <ProfilePic src={props.itinerary.lastComment.image} className="center-img" />
              </Link>
            </div>

            <div className="comment-preview-wrapper v2-type-body1 flx flx-row mrgn-right-sm">
              <Link
                to={`${props.itinerary.lastComment.username}`}
                className="comment-author">
                {props.itinerary.lastComment.username}:
              </Link>
              <div className="ellipsis comment-text">
                {props.itinerary.lastComment.body}
              </div>
            </div>
              

            <div className="cta-icon cta-comment comment-on"></div>
            <div className="v2-type-body1 mrgn-right-md">{props.itinerary.commentsCount}</div>
          </div>
        </div>
      </Link>
    )
  }
  else {
    return (
      <Link to={`itinerary/${props.itinerary.id}`}>
        <div className="cta-wrapper flx flx-row flx-just-end flex-item-right flx-row-reverse no-comments">
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
  const canModify = props.authenticated && props.itinerary.createdBy &&
      props.authenticated === props.itinerary.createdBy.userId;

  return (


    <div className="itinerary__cover flx flx-col">
      
      {/** <<<<<< USER PHOTO AND TIP COUNT **/}
      <div className="itinerary__cover__topbar flx flx-row flx-align-center flx-just-start v2-type-body1 mrgn-bottom-sm">
        <div className="itinerary__cover__author-photo mrgn-right-md">
            <Link
            to={`${itinerary.createdBy.username}`}
            className="">
            <ProfilePic src={itinerary.createdBy.image} className="center-img" />
            </Link>
        </div>
        <div className="flx flx-col flx-just-start flx-align-start">
          <div className="itinerary__cover__username mrgn-right-md">
            <Link
            to={`${itinerary.createdBy.username}`}
            className="">
            {itinerary.createdBy.username}
            </Link>
          </div>
        </div>
      
      </div>

      <div className="itinerary__book cover-height">
        
        
        {/** Cover Image **/}
        <div className="itinerary__cover__image cover-height">
          <ImagePicker images={itinerary.images ? [itinerary.images]: null} />
        </div>
        {/** Cover Overlay **/}
        <div className="itinerary__cover__overlay cover-height">
          <img className="cover-height DN" src="../img/cover-overlay.png"/>
        </div>
        {/** Cover Hit Area **/}
        <Link className="it__hit-area" to={`itinerary/${itinerary.id}`}>
          <div></div>
        </Link>
        {/** Cover Content **/}
        <div className="itinerary__cover__text flx flx-col flx-align-start ta-left w-100">

          {/** <<<<<< CENTER INFO **/}
          <div className="it__center-info flx flx-col flx-align-start ta-left w-100 pdding-left-md pdding-right-md">
            <Link to={`places/${itinerary.geo.placeId}`}>
            <div className="flx flx-row flx-just-start flx-align-center mrgn-bottom-xs">
              {/** Flag and Geo **/}
              <div className={'itinerary__cover__flag flx-hold flag-' + itinerary.geo.country}>
              </div>
                <div className="geo-type color--white text-shadow ellipsis">
                  {itinerary.geo.label}
                </div>
            </div>
            </Link>

            {/** TITLE **/}
            <Link to={`itinerary/${itinerary.id}`}>
            <div className="itinerary__cover__title text-shadow ta-left v2-type-h2 color--white">
              {itinerary.title}
            </div>
            </Link>

            {/** DESCRIPTION **/}
            <div className="itinerary__cover__descrip text-shadow v2-type-body3 color--white">
               <DescriptionPreview  itinerary={props.itinerary}/>
            </div>

            {/** TIMESTAMP **/}
            <div className="itinerary__cover__timestamp pdding-top-sm ta-left color--white opa-30 DN">
              <DisplayTimestamp timestamp={itinerary.lastModified} />
            </div> 
          </div>
          {/** CLOSE CENTER INFO >>>>>> **/}
         
            

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

        </div> {/** ----- Close Cover Text DIV ----- **/}


    </div> {/** ----- Close GRAPHIC ----- **/}
    <div className="itinerary__cover__bottombar flx flx-row flx-align-center flx-just-end v2-type-body1 mrgn-bottom-sm">
     <div className="flx flx-row flx-item-left pdding-left-sm">  
       <Link to={`itinerary/${itinerary.id}`}>
          <div className="flx flx-row flx-just-end flx-align-center opa-60">
            {itinerary.reviewsCount ? itinerary.reviewsCount : 0} {itinerary.reviewsCount === 1 ? 'Tip' : ' Tips'}
          </div>
          </Link>
      </div>
      <div className="flx flx-row flx-just-end flex-item-right mrgn-left-md">
        <CommentPreview itinerary={props.itinerary} />
        <div className="cta-wrapper flx flx-row flx-just-end flex-item-right mrgn-right-sm">
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
    
    </div>
  );
}

export default ItineraryPreview;