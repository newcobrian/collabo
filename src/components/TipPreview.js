import React from 'react';
import { Link } from 'react-router';
import LikeReviewButton from './LikeReviewButton';
import SaveReviewButton from './SaveReviewButton';
import ProxyImage from './ProxyImage';
import ReviewActions from './ReviewActions';
import FORWARD from '../constants';
import { FORWARD_MODAL, REVIEW_MODAL } from '../actions';
import { REVIEW_TYPE } from '../constants';
import CommentContainer from './Review/CommentContainer'

const CommentPreview = props => {
  if (props.comments) {
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

const TipPreview = props => {
  const review = props.review;
  const canModify = props.authenticated &&
      props.authenticated === review.userId;

  return (
    <div className="tip-wrapper flx flx-row-start flx-col-start mrgn-bottom-lg">

      <Link to={`review/${review.subjectId}/${review.id}`}>
      <div className="subject-image">
        <img className="center-img" src="../img/views.ramen.temp.png"/>
      </div>
      </Link>

      <div className="review-container flx flx-col flx-col-top">
        <div className="subject-name-container center-text">
          
          { /** Hidden Delete Button **/ }
          <div className="delete-wrapper">
            <div className="delete-button">
              <ReviewActions review={review} authenticated={props.authenticated} 
              canModify={canModify} deleteReview={props.deleteReview} reviewDetailPath={props.reviewDetailPath} />
            </div>
          </div>
          

          { /** Title and Add **/ }
          <div className="flx flx-row-top">
            <Link to={`review/${review.subjectId}/${review.id}`}>
            <div className="v2-type-h2 ta-left">
              {review.title}
            </div>
            </Link>
            <div className="v-button v-button--add flex-item-right">
              <img className="center-img" src="../img/icon.add.png"/>Save
            </div>
          </div>
          <div className="tip__address v2-type-mono mono-sm ta-left">
            {review.address}
          </div>

        { /** Rating and Like **/ }
          <div className="flx flx-row">
            <div className={'v2-type-rating ta-left v2-type-rating--' +  review.rating}>
              {review.rating}<div className="v2-type-rating--total"> /10</div>
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

        </div>{/**END subject-name-container**/}

      { /** Caption **/ }

          <div className="review-data-container flx flx-col">
            <div className="subject-caption v2-type-body2 ta-left">
              {review.caption}
            </div>
            <div className="review-timestamp">
              {(new Date(review.lastModified)).toLocaleString()}
            </div> 
          </div>


        <div className="flx flx-row flex-wrap cta-container">
          <div className="cta-box flx flx-row-space">
            <div className="flx flx-col-left">
              
            </div>

             <CommentContainer
                authenticated={props.authenticated}
                comments={props.comments || []}
                errors={props.commentErrors}
                commentObject={props.review}
                userInfo={props.userInfo}
                type={REVIEW_TYPE}
                delete={props.onDeleteComment} />
            

{/**}            <input type="text" placeholder="Add a comment..." className="input--overline mrgn-top-md" />

           <CommentPreview comments={props.review.comments} review={props.review} />
              
            <div className="flx flx-row flex-item-right">
            </div>

            <Link className="cta-wrapper flx flx-col" onClick={handleForwardClick}>
              <div className="cta-icon cta-share"></div>
                Forward
            </Link>
**/}
          </div>             
        </div>



      </div> 
    </div>
  );
}

export default TipPreview;