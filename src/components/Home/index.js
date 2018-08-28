import React from 'react';
import {BackToTop} from 'pui-react-back-to-top';
import { connect } from 'react-redux';
import * as Actions from '../../actions';
import * as Constants from '../../constants';
import { Link, browserHistory } from 'react-router';
import UniversalSearchBar from '../UniversalSearchBar';
import ProjectList from '../ProjectList';

const OrgList = props => {
  if (!props.orgList) {
    return null;
  }
  else {
    return (
      <div className="flx flx-row flx-m-col flx-center-all">
        {
          props.orgList.map((orgItem, index) => {
            return (
              <a target="_blank" href={Constants.COLLABO_URL + '/' + orgItem.name} className="org-block flx flx-col flx-center-all bx-shadow" key={index}>
                <div className="org-logo mrgn-bottom-md">
                </div>
                <div className="co-type-org">{orgItem.name}</div>
              </a>
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

  componentDidMount() {
    this.props.loadOrganizationList(this.props.authenticated)
    this.props.setSidebar(false)
  } 

  componentWillUnmount() {
    this.props.unloadOrganizationList(this.props.authenticated)
    this.props.setSidebar(true)
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

        <div className="error-module flx flx-col flx-center-all ta-center v2-type-body3 color--black">
          <div className="xiao-img-wrapper mrgn-bottom-sm">
            <img className="center-img" src="/img/xiaog.png"/>
          </div>
          <div className="mrgn-bottom-md">Some cool marketing copy goes here</div>
            
          <Link to="/register" className="">
            <div className="vb vb--light vb--intro--register fill--primary color--white flx flx-row flx-center-all ta-center bx-shadow">
              <div className="flx-grow1">JOIN NOW</div>
              <i className="material-icons md-32 color--white flex-item-right mrgn-left-sm DN">flight_takeoff</i>
            </div>
          </Link>
          <div className="flx flx-row flx-align-center v2-type-body1 mrgn-top-md">
            <Link to="/login" className="color--primary">
              login
            </Link>
          </div>
        </div>         
      </div>
      );
    }
    return null;
  };



  render() {
    if (!this.props.authenticated) {
      return (
        <div>
          {this.LoggedOutIntro(this.props.authenticated)}
        </div>
      )
    }
    else {
      return (
        <div>
          <div className={'home-page page-common fill--white flx flx-col flx-center-all ta-center'}>
            
            <div className="co-logo large-logo">
              <img className="center-img" src="/img/logo_temp.png"/>
            </div>
            <div className="co-type-logotype w-100">Koi</div>
            <div className="co-type-tagline w-100 mrgn-bottom-md">Focus. Relax. Get Shit Done.</div>

            <OrgList
              orgList={this.props.orgList} />
              <Link target="blank" to='/neworg' className="org-block flx flx-col flx-center-all bx-shadow">
                <div className="org-logo mrgn-bottom-md fill--white flx flx-col flx-center-all">
                  <i className="material-icons color--black md-48 opa-20">add</i>
                </div>
                <div className="co-type-normal co-type-org opa-40">Create New Team</div>
              </Link>
              {/*<div className="guide-feed-wrapper w-100 flx flx-row flx-just-center flx-self-end flx-align-start flx-wrap">
                
                

                <ProjectList />

                

                
              </div>*/}

            

            

          </div>
          

          <div className="footer fill--black color--white flx flx-col flx-center-all flx-item-bottom">
            <div className="homepage-logo mrgn-bottom-lg DN">  
            </div>
            <div className="v2-type-body0 color--white opa-70 mrgn-bottom-md">
              &copy;2018 Futurehumans, LLC All Rights Reserved
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

export default connect(mapStateToProps, Actions)(Home);
export { Home as Home, mapStateToProps as mapStateToProps };