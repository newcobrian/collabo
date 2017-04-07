import React from 'react';
import { Link } from 'react-router';
import LikeReviewButton from './LikeReviewButton';
import SaveReviewButton from './SaveReviewButton';
import ProxyImage from './ProxyImage';
import ReviewActions from './ReviewActions';

const RatingsButtons = props => {
  const handleClick = rating => ev => {
    ev.preventDefault();
    props.updateRating(props.authenticated, props.review.id, props.review.subjectId, rating);
  };

  if (props.authenticated && props.authenticated === props.review.reviewer.userId) {
    return (
      <div className={'rating-container roow roow-row-center rating-wrapper-' + props.review.rating}>
        <button className="rating-graphic rating-2" onClick={handleClick(2)}><ProxyImage src={props.review.reviewer.image}/></button>
        <div className="rating-divider"></div>
        <button className="rating-graphic rating-1" onClick={handleClick(1)}><ProxyImage src={props.review.reviewer.image}/></button>
        <div className="rating-divider"></div>
        <button className="rating-graphic rating-0" onClick={handleClick(0)}><ProxyImage src={props.review.reviewer.image}/></button>
        <div className="rating-divider"></div>
        <button className="rating-graphic rating--1" onClick={handleClick(-1)}><ProxyImage src={props.review.reviewer.image}/></button>
        <div className="rating-divider"></div>
        <button className="rating-graphic rating--2" onClick={handleClick(-2)}><ProxyImage src={props.review.reviewer.image}/></button>

      </div>
    )
  }
  else {
    return (
      <div className={'rating-container cannot-rate roow roow-row-center rating-wrapper-' + props.review.rating}>
          
        <div className="rating-graphic rating-2"><ProxyImage src={props.review.reviewer.image}/></div>
        <div className="rating-divider"></div>  
        <div className="rating-graphic rating-1"><ProxyImage src={props.review.reviewer.image}/></div>
        <div className="rating-divider"></div>    
        <div className="rating-graphic rating-0"><ProxyImage src={props.review.reviewer.image}/></div>
        <div className="rating-divider"></div>    
        <div className="rating-graphic rating--1"><ProxyImage src={props.review.reviewer.image}/></div>
        <div className="rating-divider"></div>
        <div className="rating-graphic rating--2"><ProxyImage src={props.review.reviewer.image}/></div>
      </div>
    )
  }
}
const RatingsNumber= props => {
  const handleClick = rating => ev => {
    props.updateRatingNumber(props.authenticated, props.review.id, props.review.subjectId, rating);
  };
  return (
 <div>{props.review.rating + 3}</div>
 )
}


const CommentPreview = props => {
  if (props.comments) {
    return (
      <Link to={`review/${props.review.subjectId}/${props.review.id}`}>
        <div className="cta-wrapper cta-wrapper-comment roow roow-col">
          <div className="cta-icon cta-comment"></div>
          {props.review.commentsCount} Comments
        </div>
      </Link>
    )
  }
  else {
    return (
      <Link to={`review/${props.review.subjectId}/${props.review.id}`}>
        <div className="cta-wrapper cta-wrapper-comment roow roow-col">
          <div className="cta-icon cta-comment comment-on"></div>
          Comment
        </div>
      </Link>
    )
  }
}

const Hashtags = props => {
  if (props.tags) {
    return (
      <div>
        {props.tags.map(tag => {
          return (
            <span key={tag}> {tag} </span> 
          )
        })
      }
      </div>
    )
  }
  return null;
}

const ReviewPreview = props => {
  const review = props.review;
  const canModify = props.authenticated &&
      props.authenticated === props.review.reviewer.userId;

  return (
      <div className="reviews-wrapper roow roow-left roow-col-left mrgn-bottom-lg bx-shadow">

          <a href={review.subject.image ? review.subject.image[0] : ""}>
            <div className="subject-image">
              <ProxyImage className="gray-border" src={review.subject.image ? review.subject.image : ""}/>
            </div>
          </a>
        <div className="review-container roow roow-center roow-col-left bottom-divider default-card-white">
          <div className="subject-name-container center-text">
            <div className="delete-wrapper">
              <div className="delete-button">
                  <ReviewActions review={review} authenticated={props.authenticated} 
                  canModify={canModify} deleteReview={props.deleteReview} reviewDetailPath={props.reviewDetailPath} />
              </div>
            </div>
            <div className="text-category v2-type-h4"><Hashtags tags={review.subject.tag}/></div>
            
            <Link to={`review/${review.subjectId}/${review.id}`}>
            <div className="text-subject-name v2-type-h2 center-text">
              {review.subject.title}
            </div>
            </Link>
              <div className="review-external-link">
            <a title={'Open link: ' + review.subject.url} target="blank" href={review.subject.url}>
              {review.subject.url}
            </a>
            </div>
          </div>{/**END subject-name-container**/}
          <div className="roow roow-row-top pic-and-review">
            <div className="review-data-container roow roow-col-center">
                
                <Link to={`@${review.reviewer.username}`}>
                      <div className="reviewer-photo DN center-img mrgn-right-lg mrgn-top-sm"><ProxyImage src={review.reviewer.image}/></div>
                  </Link>

                <div className="roow">
                  {/* Rating Stars */}
                  <div className="roow roow-col-left">
                    <Link to={`review/${review.subjectId}/${review.id}`}> 
                      <RatingsButtons review={review} authenticated={props.authenticated} updateRating={props.updateRating} />
                    </Link>
                  </div>
                  {/* Rating Number  */}
                  <div className="v2-type-h1 mrgn-left-sm mrgn-right-sm">
                      <RatingsNumber review={review} authenticated={props.authenticated} updateRatingNumber={props.updateRating} />
                  </div>
                </div>

                <div className="subject-caption v2-type-body2 center-text pdding-bottom-sm pdding-top-sm">
                  {review.caption}
                </div>
                <Link to={`@${review.reviewer.username}`}>
                  <div className="reviewer-name v2-type-h3 center-text">
                    <span className="dash"></span>{review.reviewer.username}
                  </div>
                </Link>
                <div className="review-timestamp">
                  {(new Date(review.lastModified)).toLocaleString()}
                </div>  
                <div className="bttn-style bttn-review inside mrgn-top-md">
                  <i className="ion-plus"></i> Add Your Review
                </div>
            </div>


          </div>

          <div className="roow roow-row flex-wrap cta-container">
              <div className="cta-box roow roow-row-space">
                <div className="roow roow-col-left">
                
                </div>
                <CommentPreview comments={props.review.comments} review={props.review} />
                
                <div className="roow roow-row flex-item-right">
                  <LikeReviewButton
                    authenticated={props.authenticated}
                    isLiked={props.review.isLiked}
                    likesCount={props.review.likesCount}
                    unLike={props.unLike}
                    like={props.like} 
                    review={review} />
                  <SaveReviewButton 
                    authenticated={props.authenticated}
                    isSaved={props.review.isSaved}
                    unSave={props.unSave}
                    save={props.save} 
                    review={review} />
                </div>


                  <div className="cta-wrapper roow roow-col">
                    <div className="cta-icon cta-share"></div>
                    Forward
                  </div>

                </div>
                
            </div>




        </div> 
      </div>
  );
}

export default ReviewPreview;