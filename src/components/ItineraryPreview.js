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
        <div className="cta-wrapper flx flx-row flx-just-end flex-item-right flx-row-reverse">
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
        <div className="cta-wrapper flx flx-row flx-just-end flex-item-right flx-row-reverse">
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
    <div className="itinerary__cover flx flx-row flx-just-start">
      {/** Cover Image **/}
      <Link to={`itinerary/${itinerary.id}`}>
      <div className="itinerary__cover__image">
        <ImagePicker images={itinerary.images} />
      </div>
      </Link>

      <div className="itinerary__cover__text flx flx-col flx-align-start ta-left">
        
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
        <div className="flx flx-col flx-just-start ta-left w-100">
          
          <div className="flx flx-row flx-align-center flx-just-start v2-type-body1 mrgn-bottom-md w-100">
            <div className="itinerary__cover__author-photo mrgn-right-md">
              <ProxyImage src={itinerary.createdBy.image} className="center-img" />
            </div>
            <div className="itinerary__cover__username opa-60 mrgn-right-md">
              {itinerary.createdBy.username}
            </div>
            <div className="itinerary__cover__flag mrgn-right-md">
            </div>
            <div className="opa-60 geo-type mrgn-right-md">
              {itinerary.geo.label}
            </div>

            {/** TIMESTAMP **/}
            <div className="itinerary__cover__timestamp ta-center opa-30 flx-item-right flx-self-end">
              2h{/*{(new Date(itinerary.lastModified)).toLocaleString()}*/}
            </div> 

          </div>
          

          {/** TITLE **/}
          <Link to={`itinerary/${itinerary.id}`}>
          <div className="itinerary__cover__title ta-center v2-type-h2 mrgn-top-sm">
            {itinerary.title}
          </div>
          </Link>

          {/** DESCRIPTION **/}
          <div className="itinerary__cover__descrip v2-type-body1 opa-60 mrgn-top-sm">
            {itinerary.description}
          </div>
         

          {/** CTA **/}
          <div className="flx flx-row flx-align-center w-100 flx-just-center">
            <div className="cta-box flx flx-row">
              <div className="cta-wrapper flx flx-row flx-just-end flex-item-right flx-row-reverse mrgn-right-md">
                <LikeReviewButton
                  authenticated={props.authenticated}
                  isLiked={props.itinerary.isLiked}
                  likesCount={props.itinerary.likesCount}
                  unLike={props.unLike}
                  like={props.like} 
                  likeObject={itinerary}
                  type={ITINERARY_TYPE} />
              </div>
              <CommentPreview comments={props.itinerary.comments} itinerary={props.itinerary} />
            </div>
           
            <div className="tips-count flx-item-right flx-self-end">
              <Link to={`itinerary/${itinerary.id}`}>
              <div className="flx flx-row flx-just-end flx-align-center">
                {itinerary.reviewsCount}
                <div className="cta-wrapper opa-30">
                  <div className="cta-icon cta-arrow--r">
                  </div>
                </div>
              </div>
              </Link>
            </div>            
          </div>


        </div>
        
        

      </div> {/** ----- Close Cover Text DIV ----- **/}

    

    {/** ----- Close itinerary__cover DIV ----- **/}  
    </div>
  );
}

export default ItineraryPreview;