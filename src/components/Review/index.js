import CommentContainer from './CommentContainer';
import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import * as Actions from '../../actions';
import TipList from '../TipList';
import ImagePicker from '../ImagePicker'

// const DisplayAppUserReview = props => {
//   if (props.review && props.authenticated) {
//     if (props.currentReviewId !== props.review.reviewId) {
//       let review = props.review;
//       review.subject = props.subject;
//       review.reviewer = props.userInfo;
//       return (
//         <div className="reviewpreview-wrapper your-review roow roow-col-center">

//           <Tip review={review} 
//             authenticated={props.authenticated} 
//             like={props.like} 
//             unLike={props.unLike}
//             save={props.save}
//             unSave={props.unSave}
//             updateRating={props.updateRating}
//             showModal={props.showModal} />
//         </div>
//       )
//     }
//     else return null;
//   }
//   else {
//     return (
//       <div className="DN roow roow-col-center your-review empty-prompt">
//         <a className="review-prompt gray-border" href="">+ Add Your Review</a>
//       </div>
//     )
//   }
// }

const DisplayFollowingReviews = props => {
  if (props.reviews) {
    return (
      <div className="reviewpreview-wrapper other-review roow roow-col-center">
      {
        props.reviews.map(review => {
          review.subject = props.subject;
          return (
            <TipList review={review} 
              key={review.id}
              authenticated={props.authenticated} 
              like={props.like} 
              unLike={props.unLike} />
          )
        })
      }
      </div>
    )
  }
  else {
    return (
      <div className="roow roow-col-center other-review empty-prompt"> </div>
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
  constructor() {
    super();

    this.handleSaveClick = ev => {
      ev.preventDefault();
      // props.showModal(SAVE_MODAL, props.review, props.review.images);
    }
  }
  componentWillMount() {
    // this.props.getSubject(this.props.params.sid);
    // if (this.props.params.rid) {
    //   this.props.getReview(this.props.authenticated, this.props.params.rid);
    //   this.props.getComments(this.props.params.rid);
    //   // this.props.getAppUserReview(this.props.authenticated, this.props.userInfo, this.props.params.sid);
    //   // this.props.getFollowingReviews(this.props.authenticated, this.props.params.sid, this.props.params.rid);
    //   this.props.sendMixpanelEvent('Review page loaded');
    // }

    this.props.getSubject(this.props.params.sid);
    this.props.getFollowingReviews(this.props.authenticated, this.props.params.sid);
    this.props.sendMixpanelEvent('Review page loaded');
  }

  componentWillUnmount() {
    // this.props.unloadSubject(this.props.params.sid);
    // if (this.props.params.rid) {
    //   this.props.unloadReview(this.props.authenticated, this.props.params.rid, this.props.params.sid);
    //   this.props.unloadComments(this.props.params.rid);
    // }
    // if (this.props.authenticated) {
    //   this.props.unloadAppUserReview(this.props.authenticated, this.props.params.sid);
    //   this.props.unloadFollowingReviews(this.props.authenticated, this.props.params.sid);
    // }
    this.props.unloadSubject(this.props.params.sid);
    this.props.unloadFollowingReviews(this.props.authenticated, this.props.params.sid);
  }

  render() {
    if (!this.props.subject) {
      return null;
    }
    let subject = this.props.subject;

    return (
      <div className="page-subject flx flx-col flx-col-start">
          

          {/*}      <ReviewPreview review={reviewObject} 
              authenticated={this.props.authenticated} 
              like={this.props.likeReview} 
              unLike={this.props.unLikeReview}
              save={this.props.saveReview}
              unSave={this.props.unSaveReview}
              updateRating={this.props.onUpdateRating}
              deleteReview={this.props.onDeleteReview}
              reviewDetailPath={true}
              showModal={this.props.showModal} />
      <div className="roow roow-center comments-container default-card-white pdding-all-sm bx-shadow">
       <CommentContainer
          authenticated={this.props.authenticated}
          comments={this.props.comments || []}
          errors={this.props.commentErrors}
          review={this.props.review}
          currentUser={this.props.currentUser}
          delete={this.props.onDeleteComment} />
        </div>
      </div>
      */}

          <div className="flx flx-row flx-just-start w-100">
            <div className="tip-container flx flx-col flx-align-center">
              <div className="tip-inner flx flx-row flx-just-start w-100 w-max-2">

                { /** Image **/ }
                <div className="tip__image-module mrgn-right-lg DN">
                  <div className="tip__photo-count">{subject.images.length}</div>
                  <ImagePicker images={subject.images} />
                </div>
     

                {/* Non-image module on right */}
                <div className="flx flx-col flx-align-start w-100">

                  { /** Title and Add **/ }
                  <div className="tip_title-module flx flx-row-top w-100">
                    <div className="flx flx-col flx-col-start mrgn-right-md w-100">
                      <Link to={`review/${subject.id}`}>
                      <div className="tip__title v2-type-h3 ta-left">
                        {subject.title}
                      </div>
                      </Link>

                      <div className="tip_info-module flx flx-row-top w-100 pdding-all-md">
                        <div className="tip__data tip__address col-md-4 flx flx-row flx-center-all v2-type-body1 ta-left">
                          <img className="v-icon mrgn-right-md center-img" src="../img/icons/icon32--geo.png"/>
                          <div className="">{subject.address}</div>
                        </div>
                        <div className="tip__data tip__hours col-md-4 flx flx-row flx-center-all v2-type-body1 ta-left">
                          <img className="v-icon mrgn-right-md center-img" src="../img/icons/icon32--hours.png"/>
                          <div className="">Mon: 5:00 - 8:00 PM</div>
                        </div>
                        <div className="tip__data tip__phone col-md-4 flx flx-row flx-center-all v2-type-body1 ta-left">
                          <img className="v-icon mrgn-right-md center-img" src="../img/icons/icon32--phone.png"/>
                          <div className="">+1 (530) 219-9931</div>
                        </div>
                      </div>
                    </div>

               {/*}     <div className="vb flex-item-right">
                      <Link onClick={this.handleSaveClick}>
                        <img className="center-img" src="../img/icon.add--white.png"/>Save
                      </Link>
                    </div>*/}

                  </div>
              </div>
            </div>
            </div>

{/*}    <DisplayAppUserReview 
      currentReviewId={this.props.params.rid}
      review={this.props.appUserReview}
      subject={this.props.subject}
      authenticated={this.props.authenticated}
      userInfo={this.props.userInfo}
      like={this.props.likeReview} 
      unLike={this.props.unLikeReview}
      save={this.props.saveReview}
      unSave={this.props.unSaveReview}
      updateRating={this.props.onUpdateRating}
      showModal={this.props.showModal} />

        <DisplayFollowingReviews
          reviews={this.props.followingReviews}
          subject={this.props.subject}
          authenticated={this.props.authenticated}
          userInfo={this.props.userInfo}
          like={this.props.likeReview} 
          unLike={this.props.unLikeReview}

          showModal={this.props.showModal} />
*/}
          
        </div>
        <div className="itinerary__tipslist flx flx-col flx-align-center w-100">
          <div className="w-100">
          <TipList
              reviewList={this.props.followingReviews} 
              authenticated={this.props.authenticated}
              like={this.props.likeReview} 
              unLike={this.props.unLikeReview}
              userInfo={this.props.userInfo}
              showModal={this.props.showModal}
              deleteComment={this.props.onDeleteComment} />
          </div>
        </div>
      </div>
    
    );
  }
}

export default connect(mapStateToProps, Actions)(Review);