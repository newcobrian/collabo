import MainView from './MainView';
import React from 'react';
import {BackToTop} from 'pui-react-back-to-top';
import { connect } from 'react-redux';
import * as Actions from '../../actions';
import * as Constants from '../../constants';
import { Link, browserHistory } from 'react-router';
import PopularPreview from './PopularPreview';
import ItineraryPreview from '../ItineraryPreview';
import UniversalSearchBar from '../UniversalSearchBar';

const mapStateToProps = state => ({
  ...state.home,
  appName: state.common.appName,
  authenticated: state.common.authenticated
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
      
       <div>
       <Link to="/explore" className="itinerary__cover cover--empty flx flx-col flx-center-all ta-center fill-success color--white">
              <div className="v2-type-h1 pdding-bottom-sm color--black">
                Follow more travelers
              </div>
              <div className="v2-type-body1 pdding-bottom-md color--black opa-50">
                To see their newest guides here
              </div>
              <div className="vb fill--primary color--white">
                Find travelers
              </div>
            </Link>
       </div>

    )
  }
  return null;
}

class Home extends React.Component {
  constructor() {
    super();

    this.selectTab = tag => ev => {
      ev.preventDefault();
      this.props.applyTag(tag);
    }
  }

  componentWillMount() {
    // this.props.getUserFeed(this.props.authenticated);
    this.props.startFeedWatch(this.props.authenticated);
    this.props.getFeaturedPreview(this.props.authenticated);
    this.props.getPopularPreview(this.props.authenticated);
    this.props.sendMixpanelEvent(Constants.MIXPANEL_PAGE_VIEWED, { 'page name' : 'home page'});
  } 

  componentWillUnmount() {
    // this.props.unloadUserFeed(this.props.authenticated);
    this.props.unloadFeedWatch(this.props.authenticated);
    if (this.props.featuredPreview && this.props.featuredPreview.itinerary) {
      this.props.unloadFeaturePreview(this.props.authenticated, this.props.featuredPreview.itinerary.id)
    }
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
            <img className="center-img w-100" src="/img/logos/logo_stripes_lg.png"/>
          </div>
          <div className="logo-main">
            VIEWS
          </div>
          <div className="v2-type-intro color--black mrgn-bottom-lg">
           Save and share travel guides
          </div>
        </div>
        
        <div className="hero-ocean flx flx-col flx-center-all">
          <Link to="/register" className="">
            <div className="vb vb--light vb--intro--register fill--primary color--white flx flx-row flx-center-all ta-center bx-shadow">
              <div className="flx-grow1">Get Started</div>
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
      <div className="feed-toggle friend-popular-toggle flx flx-row flx-just-center w-100">
        <ul className="nav nav-pills outline-active flx flx-row">
          <li className="nav-item">
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

    if (!this.props.itineraries || (this.props.itineraries.length === 0 && !this.props.feedWatchLoaded)) {
      return (
        <div className="loading-module flx flx-col flx-center-all v2-type-body3 fill--black">
          <div className="loader-wrapper flx flx-col flx-center-all fill--black">
            <div className="loader-bird"></div>
            <div className="loader">
              <div className="bar1"></div>
              <div className="bar2"></div>
              <div className="bar3"></div>
            </div>
            <div className="v2-type-body2 color--white">Loading home</div>
          </div>
        </div>
        )
    }

    return (
      <div>
        {this.LoggedOutIntro(this.props.authenticated)}

        <UniversalSearchBar />
 
        <div className={'home-page page-common fill--light-gray ' + isLandingPage}>

          {this.renderTabs()}

          <div className="w-100 w-max flx flx-row flx-just-center flx-self-end flx-align-center flx-wrap">
            <div className="popular-box brdr-all flx flx-col DN">
              <div className="color--black section-header mrgn-bottom-md">Popular Guides</div>
              <PopularPreview 
                popularList={this.props.popularPreview}
                authenticated={this.props.authenticated} 
                deleteItinerary={this.props.deleteItinerary} />
                <Link className="color--primary v2-type-body0 flx-item-bottom" to="/popular">See all popular guides</Link>
            </div>
            <RenderFeaturedPreview
               featuredPreview={this.props.featuredPreview}
               authenticated={this.props.authenticated} 
               deleteItinerary={this.props.deleteItinerary} 
               />
            { this.props.itineraries && this.props.itineraries.length > 0 && 
              this.props.itineraries.map(itinerary => {
                return (
                  <ItineraryPreview itinerary={itinerary}
                    key={'guide' + itinerary.id}
                    authenticated={this.props.authenticated}
                    />
                 );
                })
            }
            {/*<RenderFollowCard
              itineraries={this.props.itineraries}
            />*/}
            <Link to="/create" className="DN itinerary__cover cover--empty flx flx-col flx-center-all ta-center fill-success color--white brdr-all">
              <div className="v2-type-h1 pdding-bottom-lg color--black">
                Create a new travel guide
              </div>
              <div className="v2-type-body2 pdding-bottom-md color--black opa-50">
                Upcoming trip or recommendations for friends?
              </div>
              <div className="vb fill--success color--white">
                  <i className="material-icons md-32 color--white">add</i>
              </div>
            </Link>
          </div>
          <BackToTop />
        </div>
        <div>
          <button className="DN" onClick={this.onNextClick}>Newer Posts</button>
          <button className="DN" onClick={this.onPrevClick}>Older Posts</button>
        </div>

        <div className="footer fill--black color--white flx flx-col flx-center-all flx-item-bottom">
          <div className="homepage-logo mrgn-bottom-md">  
            <img className="center-img w-100" src="/img/logos/logo_stripes_on-black.png"/>
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

export default connect(mapStateToProps, Actions)(Home);
export { Home as Home, mapStateToProps as mapStateToProps };