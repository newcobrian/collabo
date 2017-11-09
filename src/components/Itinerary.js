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
import LoadingSpinner from './LoadingSpinner';
import { ShareButtons, ShareCounts, generateShareIcon } from 'react-share';

const {
  FacebookShareButton,
  TwitterShareButton
} = ShareButtons;

const {
  FacebookShareCount
} = ShareCounts;

const FacebookIcon = generateShareIcon('facebook');
const TwitterIcon = generateShareIcon('twitter');


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

    this.shareGuide = ev => {
      ev.preventDefault();
      this.props.showShareModal(this.props.itinerary);
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
        <LoadingSpinner message="Loading guide" />
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

      const openFilter = ev => {
        ev.preventDefault()
        this.props.showFilterModal(itinerary, this.props.visibleTags, this.props.showAllFilters);
      }

      const getVisibleTips = (tips, visibleTags) => {
      if (this.props.showAllFilters) {
        return tips;
      }
      else {
        return tips.filter(function(tip) {
          for (var tagName in tip.tags) {
            if (visibleTags.hasOwnProperty(tagName) && visibleTags[tagName].checked) {
              return true;
            }
          }
          return false;
        })
      }
    }
    // console.log('visible tags = ' + JSON.stringify(this.props.visibleTags))
    // console.log('show allfilter = ' + JSON.stringify(this.props.showAllFilters))
    const visibleTips = getVisibleTips(itinerary.tips, this.props.visibleTags);

      if (canModify) {
        return (
          <ItineraryForm initialValues={itinerary} visibleTips={visibleTips} />
          )
      }
      else {
        return (
          <div className={this.props.mapViewToggle ? 'flx flx-col flx-align-start page-common page-itinerary not-my-guide show-map' : 'flx flx-col flx-align-start page-common not-my-guide page-itinerary'}>

            <button className="floating-map-toggle vb vb--sm vb--round vb--outline flx flx-row bx-shadow flx-align-center fill--white color--black mrgn-left-n-1 button-map-toggle"
              onClick={this.onMapToggle}>
              <i className="material-icons color--black md-18 opa-80">map</i>
              <div className="mobile-hide color--black mrgn-left-sm">Full Map</div>
            </button>

            {/*<button className="mobile-show vb vb--sm vb--outline vb--round flx flx-row flx-align-center fill--white color--black button-filter-map bx-shadow"
             onClick={openFilter}>
              <i className="material-icons color--black md-18 opa-80 DN">filter_list</i>
              <div className="color--black">Filter</div>
            </button>*/}


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
              <div className={"itinerary__cover__text w-100 country-color-" + itinerary.geo.country}>
                <div className="it__cover__inner flx flx-col flx-just-start ta-left w-100 w-max">
                  <div className="flx flx-row w-100 flx-center-all mrgn-bottom-sm">

                    <div className="it__author-wrapper flx flx-col flx-center-all mrgn-bottom-sm w-50">
                      <div className="itinerary__summary__author-photo">
                          <Link
                          to={`/${createdByUsername}`}
                          className="invert">
                          <ProfilePic src={createdByImage} className="center-img" />
                          </Link>
                      </div>
                      <div className="itinerary-username v2-type-body1">
                        <Link
                        to={`/${createdByUsername}`}
                        className="invert">
                        {createdByUsername}
                        </Link>
                      </div>
                    </div>
                   
                    {/** Flag and Geo **/}
                      <Link to={`/places/${itinerary.geo.placeId}`} className="flx flx-col flx-just-start flx-align-center mrgn-bottom-sm mrgn-top-xs w-50">
                        <div className={'itinerary__cover__flag mrgn-bottom-sm flx-hold invert flag-' + itinerary.geo.country}>
                        </div>
                        <div className="geo-type ellipsis ta-center invert">
                        {itinerary.geo.label}
                        </div>
                      </Link>

                  </div>


                {/** <<<<<< CENTER INFO **/}
                <div className="it__title-module flx flx-col flx-just-start ta-center w-100">
                
                 

                  {/** TITLE **/}
                  
                  <Link to={`/guide/${this.props.itineraryId}`} className="guide-title ta-center w-100 invert">
                    {itinerary.title}
                  </Link>

                  {/** DESCRIPTION **/}
                  <div className="itinerary__cover__descrip v2-type-body3 font--beta ta-center mrgn-top-xs mrgn-bottom-xs opa-80 invert">
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

                      {/* Share */}
                      <div className="cta-wrapper flx flx-row vb vb--sm vb--outline fill--white color--black flx-item-right"
                        onClick={this.shareGuide} >
                        <div className="color--black mrgn-right-sm">Share Guide</div>
                        <i className="material-icons color--primary">play_arrow</i>
                        <i className="material-icons color--primary">accessibility</i>
                      </div>


                      <div className="flx-item-right flx flx-row DN">
                        <div className="vb vb--sm vb--outline fill--white color--black">
                          <FacebookShareButton
                            url={Constants.VIEWS_URL + `/guides/${this.props.itineraryId}`}
                            quote={'Check out my travel guide "' + itinerary.title + '" for '}
                            hashtag={'#views'}
                            className="Demo__some-network__share-button">
                            <FacebookIcon
                              size={24}
                              round />
                          </FacebookShareButton>

                          <FacebookShareCount
                            url={Constants.VIEWS_URL + `/guide/${this.props.itineraryId}`}
                            className="mrgn-left-sm">
                            {count => count}
                          </FacebookShareCount>
                        </div>

                        <div className="vb vb--sm vb--outline fill--white color--black mrgn-left-n-1">
                          <TwitterShareButton
                            url={Constants.VIEWS_URL + `/guide/${this.props.itineraryId}`}
                            title={'Check out my travel guide "' + itinerary.title + '" for ' + ':'}
                            hashtags={['views']}
                            className="Demo__some-network__share-button">
                            <TwitterIcon
                              size={24}
                              round />
                          </TwitterShareButton>
                          <div className="mrgn-right-sm DN" onClick={this.shareGuide}>Share Guide</div>
                          <i className="material-icons color--primary md-18 DN">share</i>
                        </div>
                      </div>


                    </div>{/** END MAX div **/}

                  </div>
                  {/** AUTHOR CONTROLS >>>>>> **/}

                  </div>

                </div>
                {/** >>>>>> CLOSE CENTER INFO **/}

              </div>
              {/** Close Cover Text DIV >>>>>> **/}

              <div className="w-100 flx flx-row flx-center-all pdding-all-sm">
                <Link className="vb vb--md fill--white color--black w-100 flx flx-row flx-center-all vb--outline ta-center" onClick={openFilter}>
                  <i className="material-icons color--black opa-60 mrgn-right-sm">filter_list</i>
                    Filter by tags {/*Showing 4/10 Categories */}
                </Link>
              </div>

              <div className="itinerary__tipslist flx flx-col flx-align-center fill--light-gray w-100 pdding-bottom-lg">
                  <div className="flx flx-row w-100 flx-align-center pdding-left-md pdding-right-md pdding-top-md">
                    <div className="v2-type-body1 color--black">{itinerary.reviewsCount ? itinerary.reviewsCount : 0} Items</div>
                  </div>
                  <TipList
                    tipList={visibleTips}
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

                <div className="itinerary__related-module flx flx-col flx-align-center fill--white w-100 pdding-bottom-lg">
                  <RelatedItineraries
                    relatedItineraries={this.props.relatedItineraries} 
                    numRelated={this.props.numRelated}
                    authenticated={this.props.authenticated}
                    like={this.props.likeReview}
                    unLike={this.props.unLikeReview} />
                </div>

                <BackToTop />
                
            </div> {/*Content Wrapper*/}
            
            <div className="it-map-container fill--primary">
              <MapContainer itinerary={itinerary} visibleTips={visibleTips} google={this.props.google} />
            </div>

        

            <SEO
              schema="Guide"
              title={itinerary.title}
              description={itinerary.description}
              path={`/guides/${this.props.itineraryId}`}
              contentType="article"
              published={itinerary.createdOn ? (new Date(itinerary.createdOn)).toISOString() : (new Date(itinerary.lastModified)).toISOString()}
              updated={(new Date(itinerary.lastModified)).toISOString()}
              category={''}
              tags={[]}
              twitter={''}
              image={itinerary.images ? itinerary.images.url : null}
            />

          </div>
        )
      }
    }
  }
}

export default connect(mapStateToProps, Actions)(Itinerary);