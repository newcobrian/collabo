import React from 'react';
import {BackToTop} from 'pui-react-back-to-top';
import { connect } from 'react-redux';
import * as Actions from '../../actions';
import * as Constants from '../../constants';
import { Link, browserHistory } from 'react-router';
import UniversalSearchBar from '../UniversalSearchBar';
import ProjectList from '../ProjectList';
import LoggedOutMessage from '../LoggedOutMessage';

const SignOutButton = props => {
  return (
    <Link
      className="flx flx-align-center mrgn-right-md w-100 mrgn-bottom-lg"
      onClick={props.signOut}>
      <div className="flx-item-right color--white co-type-label">Log out</div>
    </Link>
  )
}

const OrgList = props => {
  if (!props.orgList) {
    return null;
  }
  else {
    return (
      <div className="flx flx-col flx-center-all">
        {
          props.orgList.map((orgItem, index) => {
            return (
              <a target="_blank" href={'/' + orgItem.name} className="org-block flx flx-col flx-center-all" key={index}>
              {/*<a target="_blank" href={Constants.COLLABO_URL + '/' + orgItem.name} className="org-block flx flx-col flx-center-all" key={index}>*/}
                <div className="org-logo mrgn-bottom-md DN">
                </div>
                <div className="co-type-org color--white">{orgItem.name}</div>
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

    this.props.sendMixpanelEvent(Constants.MIXPANEL_PAGE_VIEWED, { 'page name' : 'homepage'});
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
       <div className="home-page page-common flx flx-col flx-center-all flx-align-center flx-just-start ta-center">
        

        <div className="error-module flx flx-col flx-center-all ta-center co-type-body color--black">
           <div className="co-logo large-logo mrgn-top-md">
              <img className="center-img" src="/img/logomark.png"/>
            </div>
            <div className="co-logotype w-100 mrgn-top-lg">
              <img className="center-img" src="/img/logotype.png"/>
            </div>
          <div className="co-type-tagline w-100 mrgn-bottom-lg mrgn-top-lg color--white">Harmonious Team Communication</div>
            
          <Link to="/register" className="">
            <div className="vb fill--secondary color--white">
              Sign up
            </div>
          </Link>
          <div className="flx flx-row flx-align-center co-type-body mrgn-top-md">
            <Link to="/login" className="color--tertiary">
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
    if (!this.props.authenticated) {
      return (
        <LoggedOutMessage/>
      )
    }
    else {
      return (
        <div>
          <div className="home-page page-common flx flx-col flx-align-center flx-just-start ta-center">

            <SignOutButton signOut={this.props.signOutUser}/>
            
            <div className="co-logo large-logo mrgn-top-lg">
              <img className="center-img" src="/img/logomark.png"/>
            </div>
            <div className="co-logotype w-100 mrgn-top-lg">
              <img className="center-img" src="/img/logotype.png"/>
            </div>
            <div className="co-type-tagline w-100 mrgn-bottom-lg mrgn-top-lg color--white">Work Together in Harmony</div>

            <OrgList
              orgList={this.props.orgList} />
              <Link target="blank" to='/newteam' className="org-block flx flx-row flx-center-all">
                  <i className="material-icons color--white md-24 mrgn-right-sm opa-80">add</i>
                <div className="co-type-org color--white">Create New Team</div>
              </Link>
              {/*<div className="guide-feed-wrapper w-100 flx flx-row flx-just-center flx-self-end flx-align-start flx-wrap">
                
                

                <ProjectList />

                

                
              </div>*/}

            

            
          </div>
          <div className="footer color--white flx flx-col flx-center-all flx-item-bottom co-type-data pdding-top-lg">
            <div className="co-type-data color--white opa-70 mrgn-bottom-md">
              &copy; 2018 Futurehumans, LLC All Rights Reserved
            </div>
            <div className="flx flx-row flx-center-all mrgn-bottom-lg">
              <Link to="/terms.html" target="blank" className="color--white opa-70">
                Terms of Service
              </Link>
              <div className="middle-dot color--white flx-hold">&middot;</div>
              <Link to="/privacy.html" target="blank" className="color--white opa-70">
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