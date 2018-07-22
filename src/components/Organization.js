import React from 'react';
import {BackToTop} from 'pui-react-back-to-top';
import { connect } from 'react-redux';
import * as Actions from '../actions';
import * as Constants from '../constants';
import { Link, browserHistory } from 'react-router';
import ProjectList from './ProjectList';
import ThreadList from './ThreadList';

const mapStateToProps = state => ({
  ...state.organization,
  appName: state.common.appName,
  authenticated: state.common.authenticated,
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

class Organization extends React.Component {
  constructor() {
    super();

    this.selectTab = tag => ev => {
      ev.preventDefault();
      this.props.applyTag(tag);
    }
  }

  componentWillMount() {
    this.props.loadOrg(this.props.authenticated, this.props.params.orgname);
    this.props.loadProjectList(this.props.authenticated, this.props.params.orgname)
    this.props.watchOrgFeed(this.props.authenticated, this.props.params.orgname)
    // this.props.startFeedWatch(this.props.authenticated);
    // this.props.startLikesByUserWatch(this.props.authenticated);
    // this.props.startUsersFeedWatchScroller(this.props.authenticated, this.props.dateIndex);
    // this.props.getFeaturedPreview(this.props.authenticated);
    // this.props.getPopularPreview(this.props.authenticated);
    // this.props.sendMixpanelEvent(Constants.MIXPANEL_PAGE_VIEWED, { 'page name' : 'home page'});
  } 

  componentWillUnmount() {
    this.props.unloadOrg();
    this.props.unloadProjectList(this.props.authenticated, this.props.params.orgname)
    this.props.unwatchOrgFeed(this.props.params.orgname)
    // this.props.unloadFeedWatch(this.props.authenticated);
    // this.props.stopUsersFeedWatch(this.props.authenticated);
    // this.props.stopLikesByUserWatch(this.props.authenticated);
    // this.props.stopUsersFeedWatchScroller(this.props.authenticated, this.props.dateIndex);
    // if (this.props.featuredPreview && this.props.featuredPreview.itinerary) {
    //   this.props.unloadFeaturePreview(this.props.authenticated, this.props.featuredPreview.itinerary.id)
    // }
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
       </div> 


      );
    }
    return null;
  };

  render() {
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
          

          
          <div className={'home-page page-common fill--white flx flx-col flx-align-center'}>
            
            

            

            <div className="guide-feed-wrapper w-100 flx flx-row flx-just-center flx-self-end flx-align-start flx-wrap">
              
              

              <ProjectList 
                org={this.props.org} />

              <div className="thread-area flx flx-col w-100">
                <div className={"page-title-wrapper text-left country-color-"}>
                  <div className="v2-type-page-header flx flx-col flx-align-start text-left invert">
                    "All" Feed
                  </div>
                  <div className="v2-type-body2 opa-60"></div>
                </div>
                <div className="feed-wrapper">
                  <ThreadList
                    threads={this.props.threads} 
                    authenticated={this.props.authenticated}
                    orgName={this.props.params.orgname}
                    />
                </div>
              </div>
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