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
      <div>{props.itinerary.description}</div>
    )
  }
  else {
    return (
     <div className="opa-30">{props.itinerary.createdBy.username} hasn't written anything about this itinerary yet...</div>
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

            <div className="comment-preview-wrapper v2-type-body1 color--white flx flx-row mrgn-right-sm">
              <Link
                to={`${props.itinerary.lastComment.username}`}
                className="comment-author color--white">
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
    <div className="itinerary__cover flx flx-row flx-center-all cover-height">
     
      {/** Cover Image **/}
      <div className="itinerary__cover__image cover-height">
        <ImagePicker images={(itinerary.images && itinerary.images.url ? [itinerary.images.url] : null)} />
      </div>
      {/** Cover Overlay **/}
      <div className="itinerary__cover__overlay cover-height">
        <img className="cover-height" src="../img/cover-overlay.png"/>
      </div>

      {/** Cover Content **/}
      <div className="itinerary__cover__text flx flx-col flx-center-all ta-left">

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
              <div className="itinerary__cover__username color--white mrgn-right-md">
                <Link
                to={`${itinerary.createdBy.username}`}
                className="color--white">
                {itinerary.createdBy.username}
                </Link>
              </div>
              <Link to={`itinerary/${itinerary.id}`}>
              <div className="flx flx-row flx-just-end flx-align-center opa-80 color--white">
                {itinerary.reviewsCount ? itinerary.reviewsCount : 0} {itinerary.reviewsCount === 1 ? 'Tip' : 'Tips'}
              </div>
              </Link>
            </div>
            <div className="flx flx-row flx-just-end flex-item-right mrgn-right-md">
              <CommentPreview itinerary={props.itinerary} />
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
          {/** >>>>>> CLOSE USER PHOTO AND TIP COUNT **/}


          {/** <<<<<< CENTER INFO **/}
          <div className="flx flx-col flx-center-all ta-center w-100 mrgn-bottom-sm">
            
            {/** Flag and Geo **/}
            <div className={'itinerary__cover__flag mrgn-bottom-sm flx-hold flag-' + itinerary.geo.country}>
            </div>
            <div className="geo-type color--white text-shadow ellipsis mrgn-bottom-sm">
              {itinerary.geo.label}
            </div>

            {/** TITLE **/}
            <Link to={`itinerary/${itinerary.id}`}>
            <div className="itinerary__cover__title text-shadow ta-center v2-type-h2 color--white">
              {itinerary.title}
            </div>
            </Link>

            {/** DESCRIPTION **/}
            <div className="itinerary__cover__descrip text-shadow v2-type-body3 color--white mrgn-top-sm">
               <DescriptionPreview itinerary={props.itinerary}/>
            </div>

            {/** TIMESTAMP **/}
            <div className="itinerary__cover__timestamp pdding-top-sm ta-center color--white opa-30">
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

    

    
    </div>
  );
}

export default ItineraryPreview;