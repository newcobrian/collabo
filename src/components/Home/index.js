import MainView from './MainView';
import React from 'react';
import {BackToTop} from 'pui-react-back-to-top';
import { connect } from 'react-redux';
import * as Actions from '../../actions';
import * as Constants from '../../constants';
import { Link, browserHistory } from 'react-router';
import FirebaseSearchInput from '../FirebaseSearchInput'

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
    this.props.sendMixpanelEvent('Friend feed loaded');
  } 

  componentWillUnmount() {
    // this.props.unloadUserFeed(this.props.authenticated);
    this.props.unloadFeedWatch(this.props.authenticated);
  }

  renderTabs() {
    return (         
      <div className="feed-toggle w-max flx flx-row flx-just-start w-100 w-max">
        <ul className="nav nav-pills outline-active flx flx-row">
          <li className="nav-item">
            <Link
              className="nav-link active"
              to="/">
              Global
            </Link>
          </li>
        </ul>
      </div>
    );
  }

  LoggedOutIntro(authenticated) {
    if (!authenticated) {
      return (
       <div className="hero-container logged-out flx flx-col">
        <div className="marketing-page navigation-bar flx flx-row flx-align-center flx-just-end pdding-right-md">
            <Link to="/login" className="nav-module nav-feed flx flx-center-all">
              <div className="nav-text">
                Log in
              </div>
            </Link>

            <Link to="/register" className="nav-module nav-feed flx flx-center-all">
              <div className="nav-text">
                Sign up
              </div>
            </Link>

        </div>
        <div className="hero-content flx flx-col flx-align-center flx-just-end ta-center">
          <div className="homepage-logo mrgn-bottom-md">  
            <img className="center-img w-100" src="/img/logos/homepage-logo.png"/>
          </div>
          <div className="v2-type-intro color--white opa-70 mrgn-bottom-lg">
           Create and share travel guides
          </div>
        </div>
        
        <div className="hero-ocean flx flx-col flx-center-all">
          <Link to="/register" className="">
            <div className="vb vb--light vb--intro--register flx flx-row flx-center-all ta-center">
              <div className="flx-grow1 mrgn-left-md">MAKE YOUR FIRST TRAVEL GUIDE</div>
              <i className="material-icons md-32 color--white flex-item-right mrgn-left-sm">flight_takeoff</i>
            </div>
          </Link>
        </div>

         
         <div className="about-intro flx flx-row w-100">
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

         <div className="about-intro flx flx-col flx-center-all w-100 mrgn-top-md opa-30">
          <div className="v2-type-intro color--black ta-center w-100">
            Some recent travel guides we like
          </div>
          <i className="material-icons color--black md-48 mrgn-top-lg mrgn-bottom-lg">arrow_downward</i>
         </div>

       </div> 


      );
    }
    return null;
  };

  render() {
    const isLandingPage = (browserHistory.getCurrentLocation().pathname === '/global') && !this.props.authenticated ?
      'page-landing' : ''

    return (
      <div>
        {this.LoggedOutIntro(this.props.authenticated)}
        <div className={'home-page page-common ' + isLandingPage}>
          <div className="page-title-wrapper center-text flx flx-col flx-align-center w-100">
            <div className="v2-type-page-header">Explore</div>
            <div className="v2-type-body2 opa-60">All the latest travel guides from people you follow</div>
            <div className="search-wrapper">
              <i className="search-icon material-icons color--primary md-32 color--primary">search</i>
              <FirebaseSearchInput
                name="searchInput"
                callback={this.searchInputCallback}
                placeholder="Search any city or country"
                type={Constants.GEO_SEARCH}
                className="input--search input--underline v2-type-body3" />
            </div>
          </div>
          
          <MainView />

          <BackToTop />
        </div>
        <div className="footer fill--black color--white flx flx-col flx-center-all">
          <div className="homepage-logo mrgn-bottom-md">  
            <img className="center-img w-100" src="/img/logos/homepage-logo.png"/>
          </div>
          <div className="v2-type-intro color--white opa-70 mrgn-bottom-lg DN">
            Travel with the knowledge of your friends
          </div>
          <Link to="/register" className="vb vb--intro--register fill--primary color--white vb--wide">
            Sign up now
          </Link>
        </div>
      </div>



    );
  }
}

export default connect(mapStateToProps, Actions)(Home);
export { Home as Home, mapStateToProps as mapStateToProps };