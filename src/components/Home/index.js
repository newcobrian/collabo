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
import ProjectList from '../ProjectList';

const OrgList = props => {
  if (!props.orgList) {
    return null;
  }
  else {
    return (
      <div>
        {
          props.orgList.map((orgItem, index) => {
            return (
              <div key={index}>
                <Link to={'/' + orgItem.name}>{orgItem.name}</Link>
              </div>
              )
          })
        }
      </div>
      )
  }
}

const mapStateToProps = state => ({
  ...state.home,
  appName: state.common.appName,
  authenticated: state.common.authenticated,
  orgList: state.common.orgList
});

class Home extends React.Component {
  constructor() {
    super();

    this.selectTab = tag => ev => {
      ev.preventDefault();
      this.props.applyTag(tag);
    }
  }

  componentWillMount() {
    // this.props.loadOrganizationList(this.props.authenticated)
  } 

  componentWillUnmount() {
    // this.props.unloadOrganizationList(this.props.authenticated)
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
      </div>
      );
    }
    return null;
  };



  render() {
    return (
      <div>
        {this.LoggedOutIntro(this.props.authenticated)}

        
        <div className={'home-page page-common fill--white flx flx-col flx-align-center '}>
          
          
          <h1>Pick the organization you want to work on</h1>

          <OrgList
            orgList={this.props.orgList} />

          {/*<div className="guide-feed-wrapper w-100 flx flx-row flx-just-center flx-self-end flx-align-start flx-wrap">
            
            

            <ProjectList />

            

            
          </div>*/}

          

          

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

export default connect(mapStateToProps, Actions)(Home);
export { Home as Home, mapStateToProps as mapStateToProps };