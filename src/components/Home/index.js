import React from 'react';
import {BackToTop} from 'pui-react-back-to-top';
import { connect } from 'react-redux';
import * as Actions from '../../actions';
import * as Constants from '../../constants';
import { Link, browserHistory } from 'react-router';
import UniversalSearchBar from '../UniversalSearchBar';
import ProjectList from '../ProjectList';
import LoggedOutMessage from '../LoggedOutMessage';
import DisplayTimestamp from '../DisplayTimestamp';

const SignOutButton = props => {
  return (
    <Link
      className="flx flx-align-center flx-item-right ta-right text-hover color--utsuri koi-type-body opa-40 flx-hold"
      onClick={props.signOut}>
      Log out
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
            if (orgItem.name && orgItem.url) {
              return (
                <Link to={'/' + orgItem.url} className="flx flx-row flx-just-start w-100 mrgn-bottom-md" key={index} >
                {/*<a target="_blank" href={'/' + orgItem.url} className="w-100 flx flx-col flx-just-start" key={index}>*/}
                  <div className="sidebar-icon flx flx-col flx-center-all mrgn-right-sm">
                    <div className="sidebar-dot fill--pond"></div>
                  </div>
                  <div className="koi-type-org color--black">{orgItem.name}</div>
                </Link>
              )
            }
          })
        }
      </div>
      )
  }
} 

const OrgInvitesList = props => {
  if (!props.invites) {
    return null
  }
  else {
    return (
      <div className="w-100">
        {
          (props.invites || []).map((inviteItem, index) => {
            return (
              <Link to={'/invitation/' + inviteItem.inviteId} className="w-100 flx flx-row flx-just-start mrgn-bottom-sm" key={inviteItem.inviteId} >
                <div className="sidebar-icon flx flx-col flx-center-all mrgn-right-sm">
                  <div className="sidebar-dot fill--pond"></div>
                </div>
                <div className="w-100 flx flx-col flx-just-start">
                  <div className="koi-type-org color--black">{inviteItem.orgName}</div>
                  <div className="w-100 flx flx-row koi-type-caption color--black opa-30">
                    <div className="">{inviteItem.senderEmail}</div>
                    <DisplayTimestamp timestamp={inviteItem.timestamp} />
                  </div>
                </div>
              </Link>
            )
          })
        }
      </div>
    )
  }
}

const GlobalInvitesList = props => {
  if (!props.globalInvites || Object.getOwnPropertyNames(props.globalInvites).length === 0) {
    return (
      <div className="w-100 flx flx-col mrgn-top-md">
        <div className="flx flx-row flx-just-start w-100 brdr-bottom mrgn-bottom-md pdding-bottom-sm">
          <div className="koi-type-h2b w-100 color--black opa-20 ta-left">
            Invitations
          </div>
        </div>
        <div className="koi-type-org color--black">You have no open invitations.</div>
      </div>
    )
  }
  else {
    return (
      <div className="w-100 flx flx-col mrgn-top-md">
        <div className="flx flx-row flx-just-start w-100 brdr-bottom mrgn-bottom-md pdding-bottom-sm">
          <div className="koi-type-h2b w-100 color--black opa-20 ta-left">
            Invitations
          </div>
        </div>
        {
          Object.keys(props.globalInvites || {}).map(function (orgId) {
            return (
              <OrgInvitesList invites={props.globalInvites[orgId]} key={orgId} />
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
  userInfo: state.common.userInfo
});

const mapDispatchToProps = {
  loadOrgList: Actions.loadOrgList,
  loadGlobalInvites: Actions.loadGlobalInvites,
  unloadGlobalInvites: Actions.unloadGlobalInvites,
  setSidebar: Actions.setSidebar,
  sendMixpanelEvent: Actions.sendMixpanelEvent,
  unloadOrgList: Actions.unloadOrgList,
  signOutUser: Actions.signOutUser
}

class Home extends React.Component {
  constructor() {
    super();
  }

  componentDidMount() {
    this.props.loadOrgList(this.props.authenticated, Constants.HOME_PAGE)
    let email = this.props.userInfo ? this.props.userInfo.email : ''
    this.props.loadGlobalInvites(email, Constants.HOME_PAGE)
    this.props.setSidebar(false)

    this.props.sendMixpanelEvent(Constants.MIXPANEL_PAGE_VIEWED, { 'page name' : 'homepage'});
  }

  // componentWillReceiveProps(nextProps) {
  //   if (this.props.authenticated !== nextProps.authenticated) {
  //     this.props.loadOrgList(this.props.authenticated, Constants.HOME_PAGE)
  //   }
  // }

  componentWillUnmount() {
    this.props.unloadOrgList(this.props.authenticated, Constants.HOME_PAGE)
    let email = this.props.userInfo ? this.props.userInfo.email : ''
    this.props.unloadGlobalInvites(email, Constants.HOME_PAGE)
    this.props.setSidebar(true)
  }

  render() {
    if (!this.props.authenticated) {
      return (
        <LoggedOutMessage/>
      )
    }
    else {
      return (
        <div>
          <div className="home-page page-common page-dash flx flx-row flx-m-col flx-align-center flx-just-start ta-center fill--pond">
            
            <div className="dash-left-wrapper fill--pond w-100">
              <div className="dash-inner flx flx-col flx-just-start fill--pond w-100">
                <div className="flx flx-row flx-align-center w-100 flx-hold">
                  <div className="dash-logo mobile-show mrgn-right-md flx-hold">
                    <img className="center-img" src="/img/koi-logo_a.png"/>
                  </div>
                  <div className="dash-logotext color--black w-100 ta-left">Koi</div>
                </div>
                <div className="dash-graphic mobile-hide w-100 mrgn-top-lg">
                  <img className="center-img" src="/img/dash-graphic.png"/>
                </div>
              </div>
            </div>
            <div className="dash-right-wrapper flx flx-col fill--mist w-100">
              <div className="dash-inner flx flx-col flx-just-start fill--mist w-100">
                <div className="flx flx-row flx-just-start w-100 brdr-bottom mrgn-bottom-md pdding-bottom-sm">
                  <div className="koi-type-h2b koi-type-bold w-100 color--black opa-20 ta-left w-100">
                    My Teams
                  </div>
                  <SignOutButton signOut={this.props.signOutUser}/>
                </div>

                <OrgList
                  orgList={this.props.orgList} />

                <Link to='/newteam' className="flx flx-row flx-center-all mrgn-bottom-md">
                  <div className="sidebar-icon flx flx-center-all mrgn-right-sm">
                    <div className="koi-ico --24 ico--add ico-color--seaweed"></div> 
                  </div>
                  <div className="koi-type-org color--seaweed">Create New Team</div>
                </Link>

                <GlobalInvitesList
                  globalInvites={this.props.globalInvites} />
                {/*<div className="guide-feed-wrapper w-100 flx flx-row flx-just-center flx-self-end flx-align-start flx-wrap">
                  <ProjectList />
                </div>*/}
              </div>

            </div>

            
          </div>
          
          

          
        </div>
      );
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
export { Home as Home, mapStateToProps as mapStateToProps, mapDispatchToProps as mapDispatchToProps };