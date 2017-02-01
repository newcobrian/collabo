import SubjectMeta from './SubjectMeta';
import CommentContainer from './CommentContainer';
import { Link } from 'react-router';
import React from 'react';
import { connect } from 'react-redux';
import * as Actions from '../../actions';
import LikeReviewButton from '../LikeReviewButton';
import ReviewPreview from '../ReviewPreview';

const DisplayAppUserReview = props => {
  if (props.review && props.authenticated) {
    let review = props.review;
    review.subject = props.subject;
    review.reviewer = props.userInfo;
    return (
      <div className="reviewpreview-wrapper your-review roow roow-col-center">

        <ReviewPreview review={review} 
          authenticated={props.authenticated} 
          like={props.like} 
          unLike={props.unLike}
          updateRating={props.updateRating} />
      </div>
    )
  }
  else {
    return (
      <div> Prompt user to enter review here.... </div>
    )
  }
}

const DisplayFollowingReviews = props => {
  if (props.reviews) {
    return (
      <div className="reviewpreview-wrapper other-review roow roow-col-center">
      {
        props.reviews.map(review => {
          review.subject = props.subject;
          return (
            <ReviewPreview review={review} 
              key={review.id}
              authenticated={props.authenticated} 
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
  authenticated: state.common.authenticated,
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
    this.props.getAppUserReview(this.props.authenticated, this.props.userInfo, this.props.params.sid);
    this.props.getFollowingReviews(this.props.authenticated, this.props.params.sid, this.props.params.rid);
  }

  componentWillUnmount() {
    this.props.unloadSubject(this.props.params.sid);
    this.props.unloadReview(this.props.params.rid);
    this.props.unloadComments(this.props.params.rid);
    if (this.props.authenticated) {
      this.props.unloadAppUserReview(this.props.authenticated, this.props.params.sid);
      this.props.unloadFollowingReviews(this.props.authenticated, this.props.params.sid);
    }
  }

  render() {
    if (!this.props.review) {
      return null;
    }
    let reviewObject = this.props.review;
    reviewObject.subject = this.props.subject;

    // const markup = { __html: marked(this.props.article.body) };
    const canModify = false;
    // const canModify = this.props.currentUser &&
      // this.props.currentUser.username === this.props.article.author.username;
    return (


    <div className="page-common article-page">
    <div className="reviewpreview-wrapper main-review roow roow-col-center">
      <ReviewPreview review={reviewObject} 
              authenticated={this.props.authenticated} 
              like={this.props.likeReview} 
              unLike={this.props.unLikeReview}
              updateRating={this.props.onUpdateRating} />
              <div className="roow roow-center comments-container">
       <CommentContainer
          authenticated={this.props.authenticated}
          comments={this.props.comments || []}
          errors={this.props.commentErrors}
          review={this.props.review}
          currentUser={this.props.currentUser} />
      </div>
</div>

      
        
    
    
    {/****

     PUT OTHER PEOPLES' REVIEWS HERE 

      ****/}

    <DisplayAppUserReview 
      review={this.props.appUserReview}
      subject={this.props.subject}
      authenticated={this.props.authenticated}
      userInfo={this.props.userInfo}
      like={this.props.likeReview} 
      unLike={this.props.unLikeReview}
      updateRating={this.props.onUpdateRating} />

    <DisplayFollowingReviews
      reviews={this.props.followingReviews}
      subject={this.props.subject}
      authenticated={this.props.authenticated}
      userInfo={this.props.userInfo}
      like={this.props.likeReview} 
      unLike={this.props.unLikeReview}
      updateRating={this.props.onUpdateRating} />

</div>/* END - PAGE-WRAPPER */
    
    );
  }
}

export default connect(mapStateToProps, Actions)(Review);