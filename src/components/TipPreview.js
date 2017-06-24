import React from 'react';
import { Link } from 'react-router';
import LikeReviewButton from './LikeReviewButton';
import SaveReviewButton from './SaveReviewButton';
import ProxyImage from './ProxyImage';
import ImagePicker from './ImagePicker';
import { SAVE_MODAL } from '../actions';
import { REVIEW_TYPE } from '../constants';
import CommentContainer from './Review/CommentContainer';
import DisplayTimestamp from './DisplayTimestamp';

const CommentPreview = props => {
  if (props.comments) {
    // console.log('comments = ' + JSON.stringify(props.comments))
    return (
      <Link to={`review/${props.review.subjectId}/${props.review.id}`}>
        <div className="cta-wrapper cta-wrapper-comment flx flx-col">
          <div className="cta-icon cta-comment"></div>
          {props.review.commentsCount} Comments
        </div>
      </Link>
    )
  }
  else {
    return (
      <Link to={`review/${props.review.subjectId}/${props.review.id}`}>
        <div className="cta-wrapper cta-wrapper-comment flx flx-col">
          <div className="cta-icon cta-comment comment-on"></div>
          Comment
        </div>
      </Link>
    )
  }
}

/* Displays user entered caption -OR- empty message if user has not entered caption */ 
const CaptionDisplay = props => {
  if (props.review.caption) {
    return (
      <div>{props.review.caption}</div>
    )
  }
  else {
    return (
     <div className="opa-30">{props.review.createdBy.username} hasn't written anything about this tip yet...</div>
    )
  }
}

const TipPreview = props => {
  const review = props.review;
  const canModify = props.authenticated &&
      props.authenticated === review.userId;
      
  const handleSaveClick = ev => {
    ev.preventDefault();
    props.showModal(SAVE_MODAL, props.review, props.review.images);
  }

  return (
    <div className="tip-wrapper flx flx-col flx-col-start">
      <div className="tip-container flx flx-col flx-align-center">
          
          <div className="tip-inner flx flx-row flx-just-start w-100 w-max-2">

            { /** Image **/ }
            <div className="tip__image-module mrgn-right-lg">
              <div className="tip__photo-count">{review.images.length > 0 ? review.images.length : null}</div>
              <ImagePicker images={review.images} />

            </div>


            {/* Non-image module on right */}
            <div className="flx flx-col flx-align-start w-100">

              { /** Title and Add **/ }
              <div className="tip_title-module flx flx-row-top w-100">
                <div className="flx flx-col flx-col-start mrgn-right-md w-100">
                  <Link to={`review/${review.subjectId}/${review.id}`}>
                  <div className="tip__title v2-type-h3 ta-left">
                    {review.title}
                  </div>
                  </Link>
                  <div className="tip__address v2-type-mono mono-sm mrgn-bottom-sm opa-30 ta-left">
                    {review.address}
                  </div>
                </div>

                <div className="vb flex-item-right">
                  <Link onClick={handleSaveClick}>
                    <img className="center-img" src="../img/icon.add--white.png"/>Save
                  </Link>
                </div>

              </div>

              { /** Rating and Like **/ }
              <div className="tip__rating-module flx flx-row flx-align-start mrgn-bottom-sm w-100">
                
                <div className="flx flx-row flx-align-center mrgn-bottom-sm">
                  <div className="user-image tip__author-photo mrgn-right-md flx-hold">
                    <ProxyImage src={review.createdBy.image} className="center-img" />
                  </div>
                  <div className={'v2-type-rating ta-right mrgn-right-md v2-type-rating--' +  review.rating}>
                    {review.rating}<div className="v2-type-rating--total opa-10">/10</div>
                  </div>
                  
                </div> 
                { /** Caption **/ }
                <div className="tip__caption-module flx flx-col w-100">
                  <div className="flx flx-row flx-just-start flx-align-start">
                    <div className="tip__caption v2-type-body2 opa-80 ta-left">
                      <CaptionDisplay review={props.review} />
                    </div>
                  </div>
                  <div className="tip__timestamp v2-type-caption opa-30">
                    <DisplayTimestamp timestamp={review.lastModified} />
                  </div>

                </div>

                <div className="flx flx-row flex-item-right v2-type-body2">
                  <div className="cta-wrapper">
                    <LikeReviewButton
                      authenticated={props.authenticated}
                      isLiked={props.review.isLiked}
                      likesCount={props.review.likesCount}
                      unLike={props.unLike}
                      like={props.like} 
                      likeObject={review}
                      type={REVIEW_TYPE} />
                  </div>
                </div>
              </div>

              { /** Comments **/ }
              <div className="flx flx-row flex-wrap cta-container">
                 <CommentContainer
                    authenticated={props.authenticated}
                    comments={review.comments || []}
                    errors={props.commentErrors}
                    commentObject={review}
                    userInfo={props.userInfo}
                    type={REVIEW_TYPE}
                    deleteComment={props.deleteComment} />
              </div> 

              

            

            </div> { /** End right col stack **/ }
          </div> { /** End photo / copy row **/ }



 



      </div> 
    </div>
  );
}

export default TipPreview;