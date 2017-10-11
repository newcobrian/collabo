import MainView from './MainView';
import React from 'react';
import {BackToTop} from 'pui-react-back-to-top';
import { connect } from 'react-redux';
import * as Actions from '../../actions';
import * as Constants from '../../constants';
import { Link, browserHistory } from 'react-router';
import FirebaseSearchInput from '../FirebaseSearchInput';
import PopularPreview from './PopularPreview';
import ItineraryPreview from '../ItineraryPreview';

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

    this.searchInputCallback = result => {
      if (result.placeId) {
        browserHistory.push('/places/' + result.placeId);
      }
    }
  }

  componentWillMount() {
    // this.props.getUserFeed(this.props.authenticated);
    this.props.startFeedWatch(this.props.authenticated);
    this.props.getFeaturedPreview(this.props.authenticated);
    this.props.getPopularPreview(this.props.authenticated);
    this.props.getPopularGeos();
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

  renderPopularCities(popularCities) {
    if (popularCities && popularCities.length > 1) {
      return (
        <div className="search-detail-bar mobile-hide flx flx-row color--white flx-just-start flx-align-center ta-center pdding-left-md w-100 v2-type-body2 color--white">
          <div className="label-big color--white flx-hold mrgn-right-lg opa-80">Top Cities:</div>

        {popularCities.map(geo => {
          let title = geo.shortName ? geo.shortName : geo.label;
          return (
            <div className="pop-city-wrapper flx flx-row flx-center-all flx-hold">
              <Link to={"/places/" + geo.id} className="geo-type color--white opa-100 flx-hold">{title}</Link>
              <div className="middle-dot flx-hold">&middot;</div>
            </div>
          )
        })}
        </div>
      )
    }
    else {
      return (
        <div className="search-detail-bar mobile-hide flx flx-row color--white flx-just-start flx-align-center ta-center pdding-left-md w-100 v2-type-body2 color--white">
          <div className="label-big color--white flx-hold mrgn-right-lg opa-80">Top Cities:</div>

        {Constants.POPULAR_CITIES.map(geo => {
          let title = geo.shortName ? geo.shortName : geo.label;
          return (
            <div>
              <Link to={"/places/" + geo.id} className="geo-type color--white opa-100">{title}</Link>
              <div className="middle-dot">&middot;</div>
            </div>
          )
        })}
        </div>
      )
    }
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

        <div className={"search-wrapper-wrapper w-100 flx flx-row flx-m-col flx-align-center " + isLandingPage}>
          <div className="search-wrapper short-width-search page-top-search w-100 flx flx-row flx-align-center flx-hold">
            <i className="search-icon material-icons color--white md-32">search</i>
            <FirebaseSearchInput
              name="searchInput"
              callback={this.searchInputCallback}
              placeholder="Search any city or country"
              type={Constants.GEO_SEARCH}
              className="input--search fill--black color--white input--underline v2-type-body3" />
          </div>
          {this.renderPopularCities(this.props.popularGeos)}
        </div>

 
        <div className={'home-page page-common fill--light-gray ' + isLandingPage}>

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
                  to="/popular">
                  Popular
                </Link>
              </li>
            </ul>
          </div>

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
            <Link to="/create" className="itinerary__cover cover--empty flx flx-col flx-center-all ta-center fill-success color--white brdr-all">
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
        

        <div className="footer fill--black color--white flx flx-col flx-center-all flx-item-bottom">
          <div className="homepage-logo mrgn-bottom-md">  
            <img className="center-img w-100" src="/img/logos/logo_stripes_on-black.png"/>
          </div>
          <div className="v2-type-intro color--white opa-70 mrgn-bottom-lg DN">
            Travel with the knowledge of your friends
          </div>
          <Link to="/register" className="DN vb vb--intro--register fill--primary color--white vb--wide">
            Sign up now
          </Link>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, Actions)(Home);
export { Home as Home, mapStateToProps as mapStateToProps };