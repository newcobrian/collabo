import React from 'react';
import { connect } from 'react-redux';
import * as Actions from '../actions';
import * as Constants from '../constants';
import {BackToTop} from 'pui-react-back-to-top';
import TipList from './TipList';
import ProfilePic from './ProfilePic';
import ImagePicker from './ImagePicker';
import { browserHistory, Link } from 'react-router';
import LikeReviewButton from './LikeReviewButton';
import CommentContainer from './Review/CommentContainer'
import { ITINERARY_TYPE, ITINERARY_PAGE } from '../constants';
import ItineraryActionsButton from './ItineraryActionsButton';
import DisplayTimestamp from './DisplayTimestamp';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import Dropzone from 'react-dropzone';
import ItineraryForm from './ItineraryForm';
import * as Selectors from '../selectors/itinerarySelectors';
import { isEmpty, find } from 'lodash';
import MapContainer from './MapContainer';
import scrollToElement from 'scroll-to-element';
import RelatedItineraries from './RelatedItineraries';
import SEO from './SEO';

var Scroll = require('react-scroll');
var scroller = Scroll.scroller;

const UpdateCoverPhoto = props => {
  if (props.isUser) {
    const dropHandler = (fileToUpload, e) => {
      if (fileToUpload && fileToUpload[0]) {
        props.uploadCoverPhoto(props.authenticated, fileToUpload[0], props.itinerary, props.itineraryId)
      }
    }

    return (
      <div >
        <Dropzone
          onDrop={dropHandler}
          disablePreview={false}
          multiple={false}
          accept="image/*"
          className="edit-tip__dropzone__touch flx flx-col flx-align-center flx-just-start ta-center">
          <div className="vb vb--sm vb--shadow-none fill--white color--black opa-80">
            <i className="material-icons color--primary md-24">add_a_photo</i>
          </div>

        </Dropzone>
        
      </div>
    );
  }
  return null;
}

const EditItineraryLink = props => {
  if (props.isUser || Constants.SHARED_ITINERARIES.indexOf(props.itineraryId) > -1) {
    return (
      <Link
        to={'/edit/' + props.itineraryId}
        className="vb vb--sm vb--outline fill--white color--black mrgn-right-sm">
         <div>Edit</div>
      </Link>
    );
  }
  return null;
};

const mapStateToProps = state => ({
  ...state.itinerary,
  currentUser: state.common.currentUser,
  authenticated: state.common.authenticated,
  userInfo: state.common.userInfo
});

class Itinerary extends React.Component {
  constructor() {
    super();

    this.loadItinerary = iid => {
      // if (iid) {
      //   this.props.getItinerary(this.props.authenticated, iid);
      //   this.props.getItineraryComments(iid);
      // }
      if (iid) {
        this.props.watchItinerary(this.props.authenticated, iid);
      }
      this.props.sendMixpanelEvent(Constants.MIXPANEL_PAGE_VIEWED, { 'page name' : 'itinerary'});
    }

    this.unloadItinerary = itineraryId => {
      this.props.unwatchItinerary(this.props.authenticated, itineraryId);
      // this.props.onItineraryUnload(this.props.authenticated, itineraryId);
      // this.props.unloadItineraryComments(itineraryId);
    }

    this.onMapToggle = ev => {
      this.props.toggleMapView()
    }
  }

  componentWillMount() {
    this.loadItinerary(this.props.params.iid);
    this.props.loadRelatedItineraries(this.props.authenticated, this.props.params.iid);
    this.jumpToHash();
  }

  componentDidUpdate() {
    this.jumpToHash();
  }

  componentWillUnmount() {
    this.unloadItinerary(this.props.itineraryId);
    this.props.unloadRelatedItineraries(this.props.authenticated);
    if (!this.props.authenticated) {
      this.props.setAuthRedirect(this.props.location.pathname);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.params.iid !== this.props.params.iid) {
      this.unloadItinerary(this.props.itineraryId);
      this.loadItinerary(nextProps.params.iid);
      this.props.loadRelatedItineraries(this.props.authenticated, nextProps.params.iid);
    }
  }

  jumpToHash = () => {
    let hash = browserHistory.getCurrentLocation().hash;
    if (hash) {
      // scroller.scrollTo(hash, {duration: 3000, offset: -70});
      scrollToElement(hash, { offset: -70 });
    }
  }

  render() {
    if (this.props.itineraryNotFound) {
      return (
        <div className="error-module flx flx-col flx-center-all ta-center v2-type-body3 color--black">
          <div className="xiao-img-wrapper mrgn-bottom-sm">
            <img className="center-img" src="/img/xiaog.png"/>
          </div>
          <div className="mrgn-bottom-md">The guide you're looking for doesn't exist, <br/>but here's a panda with chicken legs.</div>
          <Link to="/" className="vb vb--sm fill--primary color--white">More guides</Link>
        </div>
      )
    }
    // if (!this.props.itinerary || !this.props.itinerary.createdBy || !this.props.itinerary.geo) {
    else if (!this.props.itinerary || !this.props.itinerary.geo) {
      return (
        <div className="loading-module flx flx-col flx-center-all v2-type-body3 fill--black">
          <div className="loader-wrapper flx flx-col flx-center-all fill--black">
            <div className="loader-bird"></div>
            <div className="loader">
              <div className="bar1"></div>
              <div className="bar2"></div>
              <div className="bar3"></div>
            </div>
            <div className="v2-type-body2 color--white">Loading guide</div>
          </div>
        </div>
      );
    }
    else {
      const itinerary = this.props.itinerary;
      itinerary.tips = this.props.tips;
      const createdByUsername = Selectors.getCreatedByUsername(this.props.itinerary);
      const createdByImage = Selectors.getCreatedByUserImage(this.props.itinerary);

      const isUser = this.props.authenticated &&
      this.props.itinerary.userId === this.props.authenticated;

      const canModify = (this.props.authenticated && 
      this.props.authenticated === this.props.itinerary.userId) || (Constants.SHARED_ITINERARIES.indexOf(itinerary.id) !== -1);

      if (canModify) {
        return (
          <ItineraryForm initialValues={itinerary} />
          )
      }
      else {
        return (
          <div className="flx flx-col flx-align-start page-common page-itinerary">

            <div className="content-wrapper itinerary flx flx-col flx-align-center map-on">



              {/** Cover Image **/}
              <div className="itinerary__big-photo bg-loading">
                <ImagePicker images={itinerary.images ? [itinerary.images] : null} />
                <div className={'flx flx-col flx-center-all v2-type-body3 cover__loading loading-done-' + this.props.coverPicProgress}>
                  Uploading New Cover Photo...
                </div> 
                <div className="vb--change-cover">
                <UpdateCoverPhoto isUser={isUser} itinerary={itinerary} itineraryId={itinerary.id} 
                  uploadCoverPhoto={this.props.uploadCoverPhoto} authenticated={this.props.authenticated} />
                </div>
              </div>


              

              {/** Cover Content **/}
              <div className="itinerary__cover__text w-100">
                <div className="it__cover__inner flx flx-row flx-just-start ta-left w-100 w-max">
                  <div className="it__author-wrapper flx flx-col flx-center-all mrgn-bottom-sm">
                    <div className="itinerary__summary__author-photo">
                        <Link
                        to={`/${createdByUsername}`}
                        className="">
                        <ProfilePic src={createdByImage} className="center-img" />
                        </Link>
                    </div>
                    <div className="itinerary-username">
                      <Link
                      to={`/${createdByUsername}`}
                      className="">
                      {createdByUsername}
                      </Link>
                    </div>
                  </div>
                 


                {/** <<<<<< CENTER INFO **/}
                <div className="it__title-module flx flx-col flx-just-start ta-center w-100">
                
                 
                  {/** Flag and Geo **/}
                  <Link to={`/places/${itinerary.geo.placeId}`}>
                  <div className="flx flx-row flx-just-start flx-align-center mrgn-bottom-sm mrgn-top-xs">
                    <div className={'itinerary__cover__flag flx-hold flag-' + itinerary.geo.country}>
                    </div>
                    <div className="geo-type ellipsis opa-30">
                    {itinerary.geo.label}
                    </div>
                  </div>
                  </Link>

                  {/** TITLE **/}
                  <Link to={`/guide/${this.props.itineraryId}`}>
                  <div className="guide-title ta-left">
                    {itinerary.title}
                  </div>
                  </Link>

                  {/** DESCRIPTION **/}
                  <div className="itinerary__cover__descrip v2-type-body2 ta-left mrgn-top-xs mrgn-bottom-xs opa-80">
                     {itinerary.description}
                  </div>

                  {/** TIMESTAMP **/}
                  <div className="itinerary__cover__timestamp ta-center pdding-top-sm opa-30 DN">
                    <DisplayTimestamp timestamp={itinerary.lastModified} />
                    {/*(new Date(itinerary.lastModified)).toLocaleString()*/}
                  </div> 



                  {/** -------- AUTHOR CONTROLS **/}
                  <div className="it-author-controls w-100 w-max flx flx-row flx-just-start flx-align-center ta-center pdding-top-sm pdding-bottom-sm">
                    <div className="w-100 w-max flx flx-row flx-just-start flx-align-center ta-center">
                      <div className="flx flx-row flx-center-all">
                        <div className="vb vb--outline vb--round it__tip-count vb--sm mrgn-right-sm">
                          {itinerary.reviewsCount ? itinerary.reviewsCount : 0}
                        </div>

                        {/*<EditItineraryLink isUser={isUser} itineraryId={this.props.itineraryId} />*/}

                        <ItineraryActionsButton 
                          itinerary={itinerary} 
                          authenticated={this.props.authenticated} 
                          canModify={canModify} 
                          deleteItinerary={this.props.showDeleteModal} 
                          redirectPath="/" />

                      </div>


                      {/* Like */}
                      <div className="cta-wrapper flx flx-row vb vb--sm vb--outline fill--white color--black">
                        <LikeReviewButton
                          authenticated={this.props.authenticated}
                          isLiked={this.props.itinerary.isLiked}
                          likesCount={itinerary.likesCount}
                          unLike={this.props.unLikeReview}
                          like={this.props.likeReview} 
                          likeObject={itinerary}
                          itineraryId={this.props.itineraryId}
                          type={ITINERARY_TYPE} />
                      </div>

                      <div className="vb vb--sm vb--outline fill--white color--black flx-item-right">
                        <div className="mrgn-right-sm" onClick={this.onMapToggle}>Share Guide</div>
                        <i className="material-icons color--primary md-18">share</i>
                      </div>


                    </div>{/** END MAX div **/}

                  </div>
                  {/** AUTHOR CONTROLS >>>>>> **/}

                  </div>

                </div>
                {/** >>>>>> CLOSE CENTER INFO **/}

              </div>
              {/** Close Cover Text DIV >>>>>> **/}  





                

             

            


             






              <div className="itinerary__tipslist flx flx-col flx-align-center fill--light-gray w-100 pdding-bottom-lg">
                  <TipList
                    tipList={this.props.tips}
                    reviewsCount={itinerary.reviewsCount}
                    authenticated={this.props.authenticated}
                    userInfo={this.props.userInfo}
                    showModal={this.props.showModal}
                    deleteComment={this.props.onDeleteComment}
                    itineraryId={this.props.itinerary.id}
                    itinerary={itinerary}
                    canModify={canModify}
                    selectedMarker={this.props.selectedMarker}
                    onSelectActiveTip={this.props.onSelectActiveTip}

                    updateRating={this.props.onUpdateRating}
                    onSetPage={this.onSetPage}
                    deleteReview={this.props.onDeleteReview} />
              </div>

              <div className="itinerary__comments-module flx flx-col flx-align-start flx-just-start w-max-2">
                <div className="comments-section-title mrgn-bottom-md ta-left w-100">
                  Discussion
                </div>

                <CommentContainer
                authenticated={this.props.authenticated}
                userInfo={this.props.userInfo}
                type={ITINERARY_TYPE}
                comments={Selectors.getItineraryComments(this.props.commentsData, this.props.itinerary.id) || []}
                errors={this.props.commentErrors}
                commentObject={itinerary}
                deleteComment={this.props.onDeleteComment}
                itineraryId={this.props.itinerary.id} />
                </div>

                <div className="itinerary__related-module flx flx-col flx-align-center fill--light-gray w-100 pdding-bottom-lg">
                  <RelatedItineraries
                    relatedItineraries={this.props.relatedItineraries} 
                    numRelated={this.props.numRelated}
                    authenticated={this.props.authenticated}
                    like={this.props.likeReview}
                    unLike={this.props.unLikeReview} />
                </div>


            </div> {/*Content Wrapper*/}
            
            <div className="it-map-container fill--primary">
              <MapContainer itinerary={itinerary} google={this.props.google} />
            </div>
            {/*<div className="it-map-container">
              <div className="it-map-overlay flx flx-center-all">
                <div className="v2-type-body2 color--white">
                  Map coming soon
                </div>
              </div>
            </div> */}
            <BackToTop />

            <SEO
              schema="Guide"
              title={itinerary.title}
              description={itinerary.description}
              path={`/guides/${this.props.itineraryId}`}
              contentType="article"
              published={{}}
              updated={{}}
              category={{}}
              tags={{}}
              twitter={{}}
            />

          </div>
        )
      }
    }
  }
}

export default connect(mapStateToProps, Actions)(Itinerary);