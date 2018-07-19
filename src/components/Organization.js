import React from 'react';
import {BackToTop} from 'pui-react-back-to-top';
import { connect } from 'react-redux';
import * as Actions from '../actions';
import * as Constants from '../constants';
import { Link, browserHistory } from 'react-router';
import ProjectList from './ProjectList';

const mapStateToProps = state => ({
  ...state.organization,
  appName: state.common.appName,
  authenticated: state.common.authenticated,
  organization: state.common.organization,
  invalidOrgUser: state.common.invalidOrgUser
});

// const mapDispatchToProps = dispatch => ({
//   onClickTag: (tag, payload) =>
//     dispatch({ type: 'APPLY_TAG_FILTER', tag, payload }),
//   onLoad: (tab, payload) =>
//     dispatch({ type: 'HOME_PAGE_LOADED', tab, payload }),
//   onUnload: () =>
//     dispatch({  type: 'HOME_PAGE_UNLOADED' })
// });

const RenderFeaturedPreview = props => {
  if (props.featuredPreview) {
    return (
      
        <ItineraryPreview itinerary={props.featuredPreview}
          authenticated={props.authenticated} 
          deleteItinerary={props.deleteItinerary}
          guideLabel={"label-featured"}
          type={Constants.MEDIUM_GUIDE_PREVIEW} />

    )
  }
  return null;
}


const RenderFollowCard = props => {
  if (!props.itineraries) {
    return null
  }
  if (props.itineraries.length === 0) {
    return (
      
     <div className="itinerary__cover cover--empty flx flx-col flx-center-all ta-center color--black brdr-all fill--light-gray">
       <div className="v2-type-body4 pdding-bottom-md color--black mrgn-right-lg mrgn-left-lg">
         Your friends' travel guides show up here
       </div>
       <div className="vb vb--sm vb--outline fill--white color--black">
         <i className="material-icons md-32 color--black opa-70 mrgn-right-sm">person_add</i>
         <Link to="/explore" className="color--black">Find friends</Link>
       </div>
     </div>

    )
  }
  return null;
}

class Organization extends React.Component {
  constructor() {
    super();

    this.selectTab = tag => ev => {
      ev.preventDefault();
      this.props.applyTag(tag);
    }
  }

  componentWillMount() {
    this.props.setCurrentOrg(this.props.authenticated, this.props.params.orgname);
    // this.props.startFeedWatch(this.props.authenticated);
    // this.props.startLikesByUserWatch(this.props.authenticated);
    // this.props.startUsersFeedWatchScroller(this.props.authenticated, this.props.dateIndex);
    // this.props.getFeaturedPreview(this.props.authenticated);
    // this.props.getPopularPreview(this.props.authenticated);
    // this.props.sendMixpanelEvent(Constants.MIXPANEL_PAGE_VIEWED, { 'page name' : 'home page'});
  } 

  componentWillUnmount() {
    this.props.unsetCurrentOrg();
    // this.props.unloadFeedWatch(this.props.authenticated);
    // this.props.stopUsersFeedWatch(this.props.authenticated);
    // this.props.stopLikesByUserWatch(this.props.authenticated);
    // this.props.stopUsersFeedWatchScroller(this.props.authenticated, this.props.dateIndex);
    // if (this.props.featuredPreview && this.props.featuredPreview.itinerary) {
    //   this.props.unloadFeaturePreview(this.props.authenticated, this.props.featuredPreview.itinerary.id)
    // }
  }

  onPrevClick = ev => {
    ev.preventDefault()
    // this.props.unwatchGlobalFeed(this.props.authenticated, this.props.currentDateIndex)
    this.props.startUsersFeedWatchScroller(this.props.authenticated, this.props.dateIndex)
  }

  onAskForRecsClick = ev => {
    ev.preventDefault();
    this.props.logMixpanelClickEvent(Constants.ASK_FOR_RECS_MIXPANEL_CLICK, Constants.HOME_PAGE_MIXPANEL_SOURCE);
    this.props.showCreateRecs(null);
  }

  LoggedOutIntro(authenticated) {
    if (!authenticated) {
      return (
       <div className="hero-container logged-out flx flx-col">
        <div className="marketing-page navigation-bar flx flx-row flx-align-center flx-just-end pdding-right-md DN">
            <Link to="/login" className="nav-module nav-feed flx flx-center-all vb vb--sm fill--white color--black">
              <div className="nav-text">
                Log in
              </div>
            </Link>

            <Link to="/register" className="nav-module nav-feed flx flx-center-all vb vb--sm color--white">
              <div className="nav-text">
                Sign up
              </div>
            </Link>

        </div>
        <div className="hero-content flx flx-col flx-align-center flx-just-end ta-center">
          <div className="homepage-logo mrgn-bottom-md">  
            <img className="center-img w-100" src="/img/logos/logo_2018_400.png"/>
          </div>
          <div className="logo-main">
            VIEWS
          </div>
          <div className="v2-type-intro color--black mrgn-bottom-sm">
           Travel tips from trusted friends
          </div>
          <div className="v2-type-body4 color--black mrgn-bottom-sm opa-80">
           Easily build and share travel guides from a network of your friends and like-minded travelers
          </div>
        </div>
        
        <div className="hero-ocean flx flx-col flx-center-all">
          <Link to="/register" className="">
            <div className="vb vb--light vb--intro--register fill--primary color--white flx flx-row flx-center-all ta-center bx-shadow">
              <div className="flx-grow1">JOIN NOW</div>
              <i className="material-icons md-32 color--white flex-item-right mrgn-left-sm DN">flight_takeoff</i>
            </div>
          </Link>
          <div className="flx flx-row flx-align-center v2-type-body1 mrgn-top-md">
            <Link to="/login" className="color--primary">
                Login
            </Link>
          </div>
        </div>

         
         <div className="about-intro flx flx-row w-100 DN">
            <div className="guide-diagram flx flx-center-all w-50">
              <img className="center-img w-100" src="/img/graphics/guide-tokyo.png"/>
            </div>

            <div className="feature-list-wrapper flx flx-col w-50 flx-center-all">
              <div className="feature-list w-100 flx flx-col">
                <div className="feature-item flx flx-row">
                  <div className="feature-icon">
                    <i className="material-icons color--primary md-48">find_in_page</i>
                  </div>
                  <div className="flx flx-col">
                    <div className="tip__title v2-type-h3 ta-left">
                      Research things to do
                    </div>
                    <div className="v2-type-body3 ta-left mrgn-top-sm opa-60">
                      Collect recs from friends you trust
                    </div>
                  </div>
                </div>
                <div className="feature-item flx flx-row">
                  <div className="feature-icon">
                    <i className="material-icons color--primary md-48">chrome_reader_mode</i>
                  </div>
                  <div className="flx flx-col">
                    <div className="tip__title v2-type-h3 ta-left">
                      Build travel guides
                    </div>
                    <div className="v2-type-body3 ta-left mrgn-top-sm opa-60">
                      Itineraries, city guides, favorites lists...
                    </div>
                  </div>
                </div>
                <div className="feature-item flx flx-row">
                  <div className="feature-icon">
                    <i className="material-icons color--primary md-48">airplanemode_active</i>
                  </div>
                  <div className="flx flx-col">
                    <div className="tip__title v2-type-h3 ta-left">
                      Take it on your trip
                    </div>
                    <div className="v2-type-body3 ta-left mrgn-top-sm opa-60">
                      Mobile maps and notes
                    </div>
                  </div>
                </div>
                <div className="feature-item flx flx-row">
                  <div className="feature-icon">
                    <i className="material-icons color--primary md-48">favorite</i>
                  </div>
                  <div className="flx flx-col">
                    <div className="tip__title v2-type-h3 ta-left">
                      Share your experiences
                    </div>
                    <div className="v2-type-body3 ta-left mrgn-top-sm opa-60">
                      Help your friends travel as well as you!
                    </div>
                  </div>
                </div>
              </div>
            </div> {/* END Feature Wrapper */}
         </div> {/* END About Intro */}

         <div className="about-intro flx flx-col flx-center-all w-100 mrgn-top-md opa-100">
          <div className="v2-type-intro-2 color--black ta-center w-100 DN">
            Some cool guides we like
          </div>
          <i className="material-icons color--black md-48 mrgn-top-lg mrgn-bottom-lg DN">arrow_downward</i>
         </div>

       </div> 


      );
    }
    return null;
  };

  renderTabs() {
    return (
      <div className="flx flx-row flx-align-center">



        <div className="page-title-wrapper DN fill--primary center-text country-color-">
          <div className="v2-type-page-header flx flx-col flx-center-all color--white invert">
            Latest Travel Guides
          </div>
          <div className="v2-type-body2 opa-60"></div>
        </div>

        <ul className="nav nav-pills outline-active flx flx-row ta-center">
          <li className="nav-item brdr-right">
            <Link
              className="nav-link active"
              to="/">
              Friends
            </Link>
          </li>
          <li className="nav-item">
            <Link
              className="nav-link"
              to="/global">
              Everyone
            </Link>
          </li>
        </ul>
      </div>
    )
  }



  render() {
    const isLandingPage = (browserHistory.getCurrentLocation().pathname === '/global') && !this.props.authenticated ?
      'page-landing' : ''

    if(this.props.invalidOrgUser) {
      return (
        <div>
          You don't have permission to view this team. <Link to='/'>Go Home</Link>
        </div>
      )
    }
    else {
      return (
        <div>
          

          
          <div className={'home-page page-common fill--white flx flx-col flx-align-center ' + isLandingPage}>
            
            

            

            <div className="guide-feed-wrapper w-100 flx flx-row flx-just-center flx-self-end flx-align-start flx-wrap">
              
              

              <ProjectList />

              

              
            </div>

            <BackToTop />

            

          </div>
          

          <div className="footer fill--black color--white flx flx-col flx-center-all flx-item-bottom">
            <div className="homepage-logo mrgn-bottom-lg">  
              <img className="center-img w-100" src="/img/logos/logo_2018_400_white.png"/>
            </div>
            <div className="v2-type-body0 color--white opa-70 mrgn-bottom-md">
              &copy;2017 Views, LLC All Rights Reserved
            </div>
            <div className="flx flx-row flx-center-all mrgn-bottom-lg">
              <Link to="/terms.html" target="blank" className="v2-type-body0 color--white opa-70">
                Terms of Service
              </Link>
              <div className="middle-dot color--white flx-hold">&middot;</div>
              <Link to="/privacy.html" target="blank" className="v2-type-body0 color--white opa-70">
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      );
    }
  }
}

export default connect(mapStateToProps, Actions)(Organization);