import SubjectMeta from './SubjectMeta';
import CommentContainer from './CommentContainer';
import { Link } from 'react-router';
import React from 'react';
import { connect } from 'react-redux';
import * as Actions from '../../actions';
import LikeReviewButton from '../LikeReviewButton';
import ReviewPreview from '../ReviewPreview';

const DisplayAppUserReview = props => {
  if (props.review) {
    let review = props.review;
    review.subject = props.subject;
    review.reviewer = props.userInfo;
    return (
      <div>
      Review from the app user is here...
        <ReviewPreview review={review} 
          userId={props.userId} 
          like={props.like} 
          unLike={props.unLike}
          updateRating={props.updateRating} />
      </div>
    )
  }
  else {
    return (
      <div> Prompt user to enter view here.... </div>
    )
  }
}

const DisplayFollowingReviews = props => {
  if (props.reviews) {
    return (
      <div>
      Reviews from your friends...
      {
        props.reviews.map(review => {
          review.subject = props.subject;
          return (
            <ReviewPreview review={review} 
              key={review.id}
              userId={props.userId} 
              like={props.like} 
              unLike={props.unLike}
              updateRating={props.updateRating} />
          )
        })
      }
      </div>
    )
  }
  else {
    return (
      <div> None of your friends have reviewed this yet... </div>
    )
  }
}

const mapStateToProps = state => ({
  ...state.review,
  currentUser: state.common.currentUser,
  userInfo: state.common.userInfo
});

/*const mapDispatchToProps = dispatch => ({
  onLoad: payload =>
    dispatch({ type: 'ARTICLE_PAGE_LOADED', payload }),
  onUnload: () =>
    dispatch({ type: 'ARTICLE_PAGE_UNLOADED' })
    // fetchArticle: payload =>
    //   dispatch({ type: 'FETCH_ARTICLE', payload }),
});*/

class Review extends React.Component {
  componentWillMount() {
    // this.props.onLoad(Promise.all([
    //   agent.Articles.get(this.props.params.id),
    //   agent.Comments.forArticle(this.props.params.id)
    // ]));
    this.props.getSubject(this.props.params.sid);
    this.props.getReview(this.props.currentUser.uid, this.props.params.rid);
    this.props.getComments(this.props.params.rid);
    this.props.getAppUserReview(this.props.currentUser.uid, this.props.userInfo, this.props.params.sid);
    this.props.getFollowingReviews(this.props.currentUser.uid, this.props.params.sid, this.props.params.rid);
  }

  componentWillUnmount() {
    this.props.unloadSubject(this.props.params.sid);
    this.props.unloadReview(this.props.params.rid);
    this.props.unloadComments(this.props.params.rid);
    this.props.unloadAppUserReview(this.props.currentUser.uid, this.props.params.sid);
    this.props.unloadFollowingReviews(this.props.currentUser.uid, this.props.params.sid);
  }

  render() {
    if (!this.props.review) {
      return null;
    }

    // const markup = { __html: marked(this.props.article.body) };
    const canModify = false;
    // const canModify = this.props.currentUser &&
      // this.props.currentUser.username === this.props.article.author.username;
    return (


    <div className="page-common article-page">



      <div className="reviews-wrapper roow roow-col">
          
          <div className="subject-name-container">
                <div className="text-subject-name">{this.props.subject.title}</div>
                <div className="text-category shift-up-5">Book, Movie, Restaurant, Cool</div>
          </div>


<div className="roow roow-col flex-wrap">
          <div className="review-container roow roow-row">
            
            <div className="review-image-wrapper">
              <SubjectMeta
              subject={this.props.subject}
              canModify={canModify} />
            </div>

            <div className="review-data-container roow roow-col-left">
              <div className="review-data-module gray-border roow roow-col-left box-shadow">
                <Link to={`@${this.props.review.reviewer.username}`} className="author">
                <div className="photo-rating-module roow">
                  <div className="reviewer-photo center-img"><img src={this.props.review.reviewer.image} /></div>
                    <div className={'rating-container roow roow-row-center rating-wrapper-' + this.props.review.rating}>
                        <div className="rating-graphic rating--2"></div>
                        <div className="rating-graphic rating--1"></div>
                        <div className="rating-graphic rating-0"></div>
                        <div className="rating-graphic rating-1"></div>
                        <div className="rating-graphic rating-2"></div>
                    </div>
                </div>
                </Link>
                <div className="info">
                  <div className="subject-caption">
                    {this.props.review.caption}
                  </div>
                  <div className="reviewer-name-container">
                  <Link to={`@${this.props.review.reviewer.username}`}>
                  <div className="reviewer-name">
                    <span className="dash">-</span>{this.props.review.reviewer.username}
                  </div>
                  </Link>
                </div>
                <div className="review-timestamp">
                  {new Date(this.props.review.lastModified).toLocaleString([], {year: '2-digit', month: '2-digit', day: '2-digit', hour: '2-digit', minute:'2-digit'})}
                </div>
              </div>
              </div>
              
              <div className="roow roow-row flex-wrap">
                <div className="cta-box roow roow-row-space gray-border">
                    <LikeReviewButton
                      userId={this.props.currentUser.uid}
                      isLiked={this.props.review.isLiked}
                      likesCount={this.props.review.likesCount}
                      unLike={this.props.unLikeReview}
                      like={this.props.likeReview} 
                      review={this.props.review} />
                  <div className="cta-wrapper roow roow-col">
                          <div className="cta-icon cta-save"></div>
                          12 Saves
                  </div>
                  <div className="cta-wrapper roow roow-col">
                        <div className="cta-icon cta-share"></div>
                          Share
                  </div>
                </div>   
            </div>
          
          </div>
          
        </div>
        <div className="roow roow-center comments-container">
         <CommentContainer
            comments={this.props.comments || []}
            errors={this.props.commentErrors}
            review={this.props.review}
            currentUser={this.props.currentUser} />
        </div>
      </div>
</div>
    {/****

     PUT OTHER PEOPLES' REVIEWS HERE 

      ****/}

    <DisplayAppUserReview 
      review={this.props.appUserReview}
      subject={this.props.subject}
      userId={this.props.currentUser.uid}
      userInfo={this.props.userInfo}
      like={this.props.likeReview} 
      unLike={this.props.unLikeReview}
      updateRating={this.props.onUpdateRating} />

    <DisplayFollowingReviews
      reviews={this.props.followingReviews}
      subject={this.props.subject}
      userId={this.props.currentUser.uid}
      userInfo={this.props.userInfo}
      like={this.props.likeReview} 
      unLike={this.props.unLikeReview}
      updateRating={this.props.onUpdateRating} />

</div>/* END - PAGE-WRAPPER */
    
    );
  }
}

export default connect(mapStateToProps, Actions)(Review);