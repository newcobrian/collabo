import React from 'react';
import { Link } from 'react-router';
import LikeReviewButton from './LikeReviewButton';
import SaveReviewButton from './SaveReviewButton';
import ProxyImage from './ProxyImage';
import ProfilePic from './ProfilePic';
import ImagePicker from './ImagePicker';
import * as Constants from '../constants';
import CommentContainer from './Review/CommentContainer';
import DisplayTimestamp from './DisplayTimestamp';

const mapStateToProps = state => ({
  ...state.profile,
  currentUser: state.common.currentUser,
  authenticated: state.common.authenticated,
  userInfo: state.common.userInfo
});

/* Displays user entered caption -OR- empty message if user has not entered caption */ 
const CaptionDisplay = props => {
  if (props.review.caption) {
    return (
      <div className="inline">{props.review.caption}</div>
    )
  }
  else {
    return (
     <div className="inline opa-40">No review yet</div>
    )
  } 
} 

const ReviewPreview = props => {
  const review = props.review;
      
  const handleSaveClick = ev => {
    ev.preventDefault();
    props.showModal(Constants.SAVE_MODAL, props.review, props.review.images);
  }

  const onInfoClick = ev => {
    ev.preventDefault();
    props.showModal(Constants.INFO_MODAL, props.review);
  }

  if (!review) {
    return null;
  }
  else {
    return (
      <div className="tip-wrapper flx flx-col flx-col w-100 w-max">
        
        <div className="tip-container flx flx-col flx-center-all w-100 pdding-all-md brdr-all bx-shadow">
            
          
              
              { /** Title and Address **/ }
              <div className="tip__title-module flx flx-row w-100">

                <div className="tip__right-module flx flx-col flx-align-end DN">

                

                  { /** Image **/ }
            {/*}      <div className="tip__image-module DN">
                    <div className={"tip__photo-count tip-count-" + review.images.length}>{review.images.length > 0 ? review.images.length : null}</div>
                    <ImagePicker images={review.images} />
                  </div> */}
                  { /** END Image **/ }

                  
                </div>


                <div className="flx flx-col w-100">

                    <div className="tip__title-wrapper flx flx-row flx-align-top w-100 hide-in-list">
                      <div className="tip__order-count DN v2-type-h3"></div>
                    </div>

                  <div className="tip__content-wrapper">

                    <div className="tip__header-wrapper flx flx-row flx-align-center flx-just-start">

                      { /** Title **/ }
                      <Link to={`/review/${review.subjectId}/${review.key}`}>
                      <div className="hide-in-list tip__title v2-type-h3 ta-left">
                        <div className="tip__order-count"></div> {review.subject.title} 
                      </div>
                      </Link>
                      { /** END Title **/ }

                      { /** Author **/ }
                      <Link
                          to={'/' + review.createdBy.username}
                          className="show-in-list">
                        <div className="flx flx-row flx-just-start flx-align-center">
                            <div className="tip__author-photo flx-hold mrgn-right-sm">
                              <ProfilePic src={review.createdBy.image} className="user-image user-image-sm center-img" />
                            </div> 
                            <div className="color--black weight-400 v2-type-body1 color--primary DN">
                              {review.createdBy.username}
                            </div>
                        </div>
                      </Link>
                      { /** END Author **/ }
                      

                      { /** Rating **/ }
                      <div className={'tip__rating-module flx flx-row flx-align-center w-100 flx-hold tip__rating-module--' + review.rating}>
                        <div className={'tip__rating flx-hold flx flx-row flx-center-all v2-type-rating--' +  review.rating}>
                            {review.rating}
                        </div>
                        <i className="rating-star-icon material-icons color--black opa-40 md-14 DN">star</i>
                      </div>
                      { /** END Rating **/ }
                  </div>


                   

                    { /** Caption **/ }
                    <div className="tip__caption-module flx flx-col w-100 pdding-bottom-xs">
                      <div className="tip__caption v2-type-body3 ta-left font--beta">
                        <span className="color--black weight-500 color--black">
                           {review.createdBy.username}:&nbsp;
                         </span>
                        <CaptionDisplay review={props.review} />
                      </div>
                    </div>

                    { /** Timestamp **/ }
                    <div className="tip__timestamp v2-type-caption opa-30 font--beta">
                      <DisplayTimestamp timestamp={review.lastModified} />
                    </div>
                    { /** END Timestamp **/ }

                  </div>
                </div>

               




             
            </div> { /** End photo / copy row **/ }

            
   



        </div> 
      </div>
    );
  }
}

export default ReviewPreview;