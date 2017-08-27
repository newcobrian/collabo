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
  ...state.itinerary,
  currentUser: state.common.currentUser,
  authenticated: state.common.authenticated,
  userInfo: state.common.userInfo
});

/* Displays user entered caption -OR- empty message if user has not entered caption */ 
const CaptionDisplay = props => {
  if (props.tip.review.caption) {
    return (
      <div className="inline">{props.tip.review.caption}</div>
    )
  }
  else {
    return (
     <div className="inline opa-60">No review yet</div>
    )
  } 
}

const ReviewPreview = props => {
  const tip = props.tip;
      
  const handleSaveClick = ev => {
    ev.preventDefault();
    props.showModal(Constants.SAVE_MODAL, props.tip, props.tip.images);
  }

  const onInfoClick = ev => {
    ev.preventDefault();
    props.showModal(Constants.INFO_MODAL, props.tip);
  }

  return (
    <div className="tip-wrapper flx flx-col flx-col w-100 w-max">
      
      <div className="tip-container flx flx-col flx-center-all w-100">
          
        
            
            { /** Title and Address **/ }
            <div className="tip__title-module flx flx-row w-100">

              <div className="tip__right-module flx flx-col flx-align-end">


              { /** Rating **/ }
              <div className={'mobile-show tip__rating-module flx flx-row flx-align-center flx-item-right w-100 tip__rating-module--' + tip.review.rating}>
                <div className={'tip__rating flx-hold flx flx-row flx-center-all v2-type-rating--' +  tip.review.rating}>
                  {tip.review.rating}
                </div>
                <i className="rating-star-icon material-icons color--black opa-40 md-14 DN">star</i>
              </div>
              { /** END Rating **/ }
              

                { /** Image **/ }
                <div className="tip__image-module">
                  <div className="tip__photo-count">{tip.images.length > 0 ? tip.images.length : null}</div>
                  <ImagePicker images={tip.images} />
                </div>
                { /** END Image **/ }


               
                <div className="tip__timestamp v2-type-caption opa-20 mrgn-top-xs DN">
                  <DisplayTimestamp timestamp={tip.review.lastModified} />
                </div>
                
              </div>


              <div className="flx flx-col w-100">

                  <div className="tip__title-wrapper flx flx-row flx-align-top w-100 hide-in-list">
                    <div className="tip__order-count DN v2-type-h3"></div>
                  </div>

                <div className="tip__content-wrapper">

                  <div className="tip__header-wrapper flx flx-row flx-align-start flx-just-start">
                    { /** Title **/ }
                    <Link to={`/review/${tip.subjectId}/${tip.key}`}>
                    <div className="hide-in-list tip__title v2-type-h3 ta-left">
                      <div className="tip__order-count"></div> {tip.subject.title} 
                    </div>
                    </Link>
                    { /** END Title **/ }

                    { /** Rating **/ }
                    <div className={'mobile-hide tip__rating-module flx flx-row flx-align-center flx-item-right w-100 flx-hold tip__rating-module--' + tip.review.rating}>
                      <div className={'tip__rating flx-hold flx flx-row flx-center-all v2-type-rating--' +  tip.review.rating}>
                        {tip.review.rating}
                      </div>
                      <i className="rating-star-icon material-icons color--black opa-40 md-14 DN">star</i>
                    </div>
                    { /** END Rating **/ }
                </div>


                  { /** Author **/ }
                  <Link
                      to={'/' + tip.createdBy.username}
                      className="show-in-list">
                    <div className="flx flx-row flx-just-start flx-align-center mrgn-bottom-sm">
                        <div className="tip__author-photo flx-hold mrgn-right-sm">
                          <ProfilePic src={tip.createdBy.image} className="user-image user-image-sm center-img" />
                        </div> 
                        <div className="color--black v2-type-body1">
                          {tip.createdBy.username}
                        </div>
                    </div>
                  </Link>
                  { /** END Author **/ }

                  { /** Caption **/ }
                  <div className="tip__caption-module flx flx-col w-100 pdding-right-lg mrgn-bottom-sm">
                    <div className="tip__caption v2-type-body2 ta-left opa-90">
                      <CaptionDisplay tip={props.tip} />
                    </div>
                  </div>

                  {/* Itinerary links */}
                  <div>
                    IN {tip.itineraries.length} ITINERARIES:
                    {tip.itineraries.map((itinItem, index) => {
                      return (
                        <div key={index}>
                          <Link to={'/guide/' + itinItem.itineraryId}>{itinItem.title}</Link>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>

             




           
          </div> { /** End photo / copy row **/ }

          
 



      </div> 
    </div>
  );
}

export default ReviewPreview;