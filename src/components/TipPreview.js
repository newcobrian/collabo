import React from 'react';
import { Link } from 'react-router';
import LikeReviewButton from './LikeReviewButton';
import SaveReviewButton from './SaveReviewButton';
import ProxyImage from './ProxyImage';
import ImagePicker from './ImagePicker';
import { SAVE_MODAL } from '../actions';
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

  const handleSaveClick = ev => {
    ev.preventDefault();
    props.showModal(SAVE_MODAL, props.review);
  }

  return (
    <div className="tips-wrapper flx flx-col flx-col-start mrgn-bottom-lg">


      <div className="tip-container flx flx-col flx-col-top">

          { /** Hidden Delete Button **/ }
          <div className="DN delete-wrapper">
            <div className="delete-button">
              {/*<ReviewActions review={review} authenticated={props.authenticated} 
              canModify={canModify} deleteReview={props.deleteReview} reviewDetailPath={props.reviewDetailPath} />*/}
            </div>
          </div>
          

          { /** Title and Add **/ }
          <div className="tip_title-module flx flx-row-top w-100">
            <div className="flx flx-col flx-col-start">
              <Link to={`review/${review.subjectId}/${review.id}`}>
              <div className="tip__title v2-type-h2 ta-left">
                {review.title}
              </div>
              </Link>
              <div className="tip__address v2-type-mono mono-sm mrgn-bottom-sm opa-30 ta-left">
                {review.address}
              </div>
            </div>

            <div className="v-button v-button--add flex-item-right">
              <Link onClick={handleSaveClick}>
                <img className="center-img" src="../img/icon.add.png"/>Save
              </Link>
            </div>
          </div>

          { /** Image **/ }
          <Link to={`review/${review.subjectId}/${review.id}`}>
          <div className="tip__image-module mrgn-bottom-sm">
            <ImagePicker images={props.images} />
          </div>
          </Link>


          { /** Rating and Like **/ }
          <div className="tip__rating-module flx flx-row mrgn-bottom-sm mrgn-top-md w-100">
            <div className={'v2-type-rating ta-left v2-type-rating--' +  review.rating}>
              {review.rating}<div className="v2-type-rating--total opa-30"> /10</div>
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

          { /** Caption **/ }
          <div className="tip__caption-module flx flx-col w-100">
            <div className="tip__caption v2-type-body3 ta-left">
              {review.caption}
            </div>
            <div className="tip__timestamp  v2-type-caption mrgn-top-sm opa-30">
              Last updated {(new Date(review.lastModified)).toLocaleString()}
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
                deleteComment={props.deleteComment} />
            

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