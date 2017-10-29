import CommentContainer from './CommentContainer';
import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import * as Actions from '../../actions';
import * as Constants from '../../constants';
import TipList from '../TipList';
import TipPreview from '../TipPreview';
import ReviewList from '../ReviewList';
import ReviewPreview from '../ReviewPreview';
import ImagePicker from '../ImagePicker'


const ShowWeekDayText = props => {
  if (!props.subject || !props.subject.hours || !props.subject.hours.weekdayText) {
    return (<div className="v2-type-body2 opa-40">N/A</div>);
  }
    else {
      return (
        <ul className="v2-type-body2">
          {
            props.subject.hours.weekdayText.map((day, index) => {
              return (
                <li key={index}>{day}</li>
                )
            })
          } 
        </ul>
      )
    }
}

const ShowWebsite = props => {
  if (!props.subject || !props.subject.website) {
    return (<div className="v2-type-body2 opa-40">N/A</div>);
  }
    else {
      return (
        <a href={props.subject.website} target='_blank' className="v2-type-body2 color--primary">{props.subject.website}</a>
      )
    }
}

const ShowPhoneNumber = props => {
  if (!props.subject || !props.subject.internationalPhoneNumber) {
    return (<div className="v2-type-body2 opa-40">N/A</div>);
  }
    else {
      return (
        <div className="v2-type-body2">
          {props.subject.internationalPhoneNumber}
        </div>
      )
    }
}



const DisplayAppUserReview = props => {
  if (props.tip && props.authenticated) {
    // if (props.currentReviewId !== props.review.reviewId) {
      let tip = props.tip;
      return (
        <div className="reviewpreview-wrapper your-review roow roow-col-center">
          <ReviewPreview tip={tip}
            authenticated={props.authenticated} 
            userInfo={props.userInfo}
            save={props.save}
            unSave={props.unSave}
            showModal={props.showModal} />
        </div>
      )
    // }
    // else return null;
  }
  else {
    return null;
    // return (
    //   <div className="DN roow roow-col-center your-review empty-prompt">
    //     <a className="review-prompt gray-border" href="">+ Add Your Review</a>
    //   </div>
    // )
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
      this.props.showModal(Constants.SAVE_MODAL, Object.assign({}, {subjectId: this.props.params.sid}, {subject: this.props.subject}), this.props.subject.images);
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
    this.props.getUserReview(this.props.authenticated, this.props.authenticated, this.props.params.sid);
    this.props.getFollowingReviews(this.props.authenticated, this.props.params.sid);
    this.props.getAllReviews(this.props.authenticated, this.props.params.sid);
    this.props.sendMixpanelEvent(Constants.MIXPANEL_PAGE_VIEWED, { 'page name' : 'review page'});
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
    this.props.unloadUserReview(this.props.authenticated, this.props.authenticated, this.props.params.sid);
    this.props.unloadFollowingReviews(this.props.authenticated, this.props.params.sid);
    this.props.unloadAllReviews(this.props.authenticated, this.props.params.sid);
  }

  render() {
    if (!this.props.subject) {
      return null;
    }
    let subject = this.props.subject;

    let googleMapLink = (this.props.subject.googleMapsURL ? this.props.subject.googleMapsURL :
        'https://maps.google.com/maps?q=' + this.props.subject.location.lat + ',' + this.props.subject.location.lng)

    const showWeekdayText = subject => {
      if (!subject || !subject.hours || !subject.weekdayText) return null;
      subject.hours.weekdayText.map(hoursItem => {
        return (
            <div>{hoursItem}</div>
          );
      })
    }

    return (
      <div className="page-subject page-common flx flx-row">
          

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

          <div className="tip-info-col flx flx-row flx-just-start w-100 flx-hold">
            <div className="tip-container tip-subject flx flx-col flx-align-center">
              <div className="tip-inner flx flx-row flx-just-start w-100 w-max">

                { /** Image **/ }
                <div className="tip__image-module mrgn-right-lg DN">
                  <div className="tip__photo-count">{subject.images.length}</div>
                  <ImagePicker images={subject.images} />
                </div>
     

                {/* Non-image module on right */}
                <div className="flx flx-col flx-align-start w-100">

                  { /** Title and Add **/ }
                    
                    <div className="flx flx-col w-100">
                      
                      <div className="pdding-all-md w-100">
                        <div className="tip__title-module flx flx-row flx-just-start flx-align-center w-100 mrgn-bottom-md">
                          <div className="tip__title v2-type-h2 ta-left">
                            {subject.title}
                          </div>
                        </div>
                        
                        <Link onClick={this.handleSaveClick} className="vb vb--md fill--primary flx flx-row flx-align-center flx-just-center vb--mobile-full">
                          <i className="material-icons mrgn-right-sm color--white">get_app</i>
                          <div className="color--white">Save to a guide</div>
                        </Link>
                      </div>



                      <div className="tip__info-module flx flx-col w-100 font--alpha">

                        <div className="tip__data tip__address flx flx-col flx-align-start v2-type-body2 ta-left">
                          <div className="flx flx-row flx-align-start">
                            <i className="material-icons mrgn-right-md color--black opa-60 md-24">&#xE55F;</i>
                            <div className="flx flx-col">
                              <div className="v2-type-body2">{subject.address}</div>
                              <a target='_blank' className="color--primary v2-type-body2" href={googleMapLink}>Get Directions</a>
                            </div>
                          </div>
                        </div>
                        <div className="tip__data tip__address flx flx-col flx-align-start v2-type-body2 ta-left">
                          <div className="flx flx-row flx-align-start">
                            <i className="material-icons mrgn-right-md color--black opa-60 md-24">link</i>
                            <div className="v2-type-body2"><ShowWebsite subject={subject} /></div>
                          </div>
                        </div>
                        <div className="tip__data tip__phone flx flx-col flx-align-start v2-type-body2 ta-left">
                          <div className="flx flx-row flx-align-start">
                            <i className="material-icons mrgn-right-md color--black opa-60 md-24">phone</i>
                            <div className="v2-type-body2"><ShowPhoneNumber subject={subject} /></div>
                          </div>
                        </div>
                        <div className="tip__data tip__hours flx flx-col flx-align-start v2-type-body2 ta-left">
                          <div className="flx flx-row flx-align-start">
                            <i className="material-icons mrgn-right-md color--black opa-60 md-24">schedule</i>
                          <div className="v2-type-body2"><ShowWeekDayText subject={subject} /></div>
                          </div>
                        </div>
                      </div>

                      


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
        <div className="itinerary__tipslist flx flx-col flx-align-center pdding-all-md w-100">
          <div className="w-100">
            <DisplayAppUserReview 
              tip={this.props.appUserReview}
              subject={this.props.subject}
              authenticated={this.props.authenticated}
              userInfo={this.props.userInfo}
              save={this.props.saveReview}
              unSave={this.props.unSaveReview}
              showModal={this.props.showModal} />
            <div className="label-big pdding-left-lg mrgn-top-md DN">Friends</div>

            <ReviewList
              itinerary={this.props.itinerary}
              reviewList={this.props.followingReviews} 
              authenticated={this.props.authenticated}
              userInfo={this.props.userInfo}
              showModal={this.props.showModal}
               />

            <div className="label-big pdding-left-lg">More reviews</div>
            <ReviewList
              itinerary={this.props.itinerary}
              reviewList={this.props.allReviews} 
              authenticated={this.props.authenticated}
              userInfo={this.props.userInfo}
              showModal={this.props.showModal}
               />
          </div>
        </div>
      </div>
    
    );
  }
}

export default connect(mapStateToProps, Actions)(Review);