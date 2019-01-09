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
            return (
              <Link to={'/' + orgItem.url} className="w-100 flx flx-col flx-just-start" key={index} >
              {/*<a target="_blank" href={'/' + orgItem.url} className="w-100 flx flx-col flx-just-start" key={index}>*/}
                <div className="org-logo mrgn-bottom-md DN">
                </div>
                <div className="koi-type-org color--black">{orgItem.name}</div>
              </Link>
              )
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
      <div>
        {
          (props.invites || []).map((inviteItem, index) => {
            return (
              <Link to={'/invitation/' + inviteItem.inviteId} className="w-100 flx flx-col flx-just-start" key={inviteItem.inviteId} >
                <div className="koi-type-org color--black">{inviteItem.orgName}</div>
                <div className="koi-type-org color--black">{inviteItem.senderEmail}</div>
                <DisplayTimestamp timestamp={inviteItem.timestamp} />
              </Link>
            )
          })
        }
      </div>
    )
  }
}

const GlobalInvitesList = props => {
  if (!props.globalInvites) {
    return null
  }
  else {
    return (
      <div className="flx flx-col flx-center-all">
        <div>Invitations</div>
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
                <div className="flx flx-row flx-just-start w-100">
                  <div className="koi-type-body koi-type-bold w-100 mrgn-bottom-lg color--black opa-20 ta-left">
                    My Teams
                  </div>
                  <SignOutButton signOut={this.props.signOutUser}/>
                </div>

                <Link to='/newteam' className="flx flx-row flx-center-all mrgn-top-md">
                    <i className="material-icons color--white md-24 mrgn-right-sm opa-80 DN">add</i>
                  <div className="koi-type-org color--green">+Create New Team</div>
                </Link>

                <OrgList
                  orgList={this.props.orgList} />

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