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
      <div className="inline">{props.review.caption}</div>
    )
  }
  else {
    return (
     <div className="inline opa-20">{props.review.createdBy.username} hasn't written anything about this tip yet...</div>
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





            {/* Action Module */}
            <div className="tip__cta-box flx flx-col flx-center-all">
              <div className="flx flx-col flx-center-all">
                <div className="vb vb--save">
                  <Link onClick={handleSaveClick}>
                    <img className="center-img" src="../img/icon.add--white.png"/>
                  </Link>
                </div>
                <div className="v2-type-body0 opa-40 mrgn-top-sm">Save to</div>
              </div>

                <div className="cta-wrapper flx flx-col mrgn-top-md v2-type-body2">
                  <LikeReviewButton
                    authenticated={props.authenticated}
                    isLiked={props.review.isLiked}
                    likesCount={props.review.likesCount}
                    unLike={props.unLike}
                    like={props.like} 
                    likeObject={review}
                    itineraryId={props.itineraryId}
                    type={REVIEW_TYPE} />
                </div>
            </div>






            {/* Non-image module on right */}
            <div className="tip__data-module flx flx-col flx-align-start w-100 mrgn-left-lg">

              { /** Title and Address **/ }
              <div className="tip__title-module flx flx-row-top w-100">
                <div className="flx flx-col flx-col-start mrgn-right-md w-100">
                  <Link to={`review/${review.subjectId}/${review.id}`}>
                  <div className="tip__title v2-type-h4 ta-left">
                    {review.title}
                  </div>
                  </Link>
                  <div className="tip__address v2-type-mono mono-sm opa-70 ta-left">
                    {review.address}
                  </div>
                </div>

              </div>



              <div className="flx flx-row">
                { /** Rating and Like **/ }
                <div className="tip__rating-module flx flx-row flx-align-start mrgn-top-sm w-100">
                  
                  <div className="flx flx-row flx-align-center mrgn-bottom-sm">
                    <Link
                      to={review.createdBy.username}
                      className="">
                      <div className="tip__author-photo flx-hold">
                        <ProxyImage src={review.createdBy.image} className="user-image user-image-md center-img" />
                      </div> 
                    </Link>
                    <div className={'tip__rating mrgn-right-md v2-type-rating--' +  review.rating}>
                      {review.rating}<div className="v2-type-rating--total opa-10 DN">/10</div>
                    </div>
                  </div> 
                </div>

                { /** Caption **/ }
                <div className="tip__caption-module flx flx-col w-100 pdding-top-sm pdding-right-md">
                  <div className="flx flx-row flx-just-start flx-align-start">
                    <div className="tip__caption v2-type-body2 ta-left">
                      <strong>{review.createdBy.username}:</strong> <CaptionDisplay review={props.review} />
                    </div>
                  </div>
                  <div className="tip__timestamp v2-type-caption opa-20 mrgn-top-xs">
                    <DisplayTimestamp timestamp={review.lastModified} />
                  </div>
                  { /** Comments **/ }
                  <div className="flx flx-row flex-wrap cta-container">
                     <CommentContainer
                        authenticated={props.authenticated}
                        comments={review.comments || []}
                        errors={props.commentErrors}
                        commentObject={review}
                        itineraryId={props.itineraryId}
                        userInfo={props.userInfo}
                        type={REVIEW_TYPE}
                        deleteComment={props.deleteComment} />
                  </div> 
                </div>

              </div>
              

             
              

            

            </div> { /** End right col stack **/ }

           
          </div> { /** End photo / copy row **/ }



 



      </div> 
    </div>
  );
}

export default TipPreview;