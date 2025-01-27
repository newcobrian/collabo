import React from 'react';
import { Link } from 'react-router';
import Firebase from 'firebase';
import ProfilePic from './ProfilePic';
import { connect } from 'react-redux';
import * as Actions from '../actions';
import * as Constants from '../constants';
import ProxyImage from './ProxyImage';
import DisplayTimestamp from './DisplayTimestamp';
import ProjectList from './ProjectList';
import OrgHeader from './OrgHeader';
import Sidebar from 'react-sidebar';
import LoggedOutMessage from './LoggedOutMessage'
import InvalidOrg from './InvalidOrg'

const mql = window.matchMedia(`(min-width: 800px)`);

const LeftSenderPic = props => {
  if (props.senderId && props.image) {
    return (
      <div className="mrgn-left-sm mrgn-right-md">
        <Link
        to={`${props.orgURL}/user/${props.username}`}
        className="">
          <ProfilePic src={props.image} className="center-img" />
        </Link>
      </div>
    ) 
  }
  else {
    return (
      <div className="mrgn-left-sm mrgn-right-md default-profile-wrapper flx-hold">
        <img src="../img/user_temp.png" className="center-img"/>
      </div>
    )
  }
} 

const RenderUsername = props => {
  if (props.senderId) {
    return (
      <Link
          to={`${props.orgURL}/user/${props.username}`}
          className="color--black">
          {props.username}
      </Link>
    )
  }
  return null;
}

const mapStateToProps = state => ({
  ...state.inbox,
  authenticated: state.common.authenticated,
  sidebarOpen: state.common.sidebarOpen,
  invalidOrgUser: state.common.invalidOrgUser
});

const mapDispatchToProps = {
  setSidebar: Actions.setSidebar,
  setSidebarOpen: Actions.setSidebarOpen,
  loadSidebar: Actions.loadSidebar,
  loadOrg: Actions.loadOrg,
  loadOrgUser: Actions.loadOrgUser,
  unloadOrgUser: Actions.unloadOrgUser,
  loadProjectList: Actions.loadProjectList,
  loadThreadCounts: Actions.loadThreadCounts,
  loadOrgList: Actions.loadOrgList,
  loadProjectNames: Actions.loadProjectNames,
  loadProject: Actions.loadProject,
  loadProjectMembers: Actions.loadProjectMembers,
  loadOrgMembers: Actions.loadOrgMembers,
  sendMixpanelEvent: Actions.sendMixpanelEvent,
  unloadProjectNames: Actions.unloadProjectNames,
  unloadOrgList: Actions.unloadOrgList,
  unloadThreadCounts: Actions.unloadThreadCounts,
  unloadProjectList: Actions.unloadProjectList,
  unloadOrg: Actions.unloadOrg,
  unloadProjectMembers: Actions.unloadProjectMembers,
  unloadOrgMembers: Actions.unloadOrgMembers,
  setAuthRedirect: Actions.setAuthRedirect,
  notAnOrgUserError: Actions.notAnOrgUserError,
  getInbox: Actions.getInbox,
  updateInboxCount: Actions.updateInboxCount,
  unloadInbox: Actions.unloadInbox
}

class Inbox extends React.Component {
  componentDidMount() {
    this.props.loadSidebar(mql);
    mql.addListener(this.mediaQueryChanged);

    let lowerCaseOrgURL = this.props.params.orgurl ? this.props.params.orgurl.toLowerCase() : ''
    Firebase.database().ref(Constants.ORGS_BY_URL_PATH + '/' + lowerCaseOrgURL).once('value', orgSnap => {
      if (!orgSnap.exists()) {
        this.props.notAnOrgUserError(Constants.INBOX_PAGE)
      }
      else {
        let orgId = orgSnap.val().orgId
        let orgName = orgSnap.val().name
        this.props.loadOrg(this.props.authenticated, orgId, this.props.params.orgurl, orgName, Constants.INBOX_PAGE);
        this.props.loadOrgUser(this.props.authenticated, orgId, Constants.INBOX_PAGE)
        this.props.loadProjectList(this.props.authenticated, orgId, Constants.INBOX_PAGE)
        this.props.loadThreadCounts(this.props.authenticated, orgId)
        this.props.loadOrgList(this.props.authenticated, Constants.INBOX_PAGE)
        this.props.loadProjectNames(orgId, Constants.INBOX_PAGE)

        this.props.getInbox(this.props.authenticated, null, null, this.props.params.orgurl);
        this.props.updateInboxCount(this.props.authenticated, orgId);

        this.props.sendMixpanelEvent(Constants.MIXPANEL_PAGE_VIEWED, { 'page name' : 'inbox', 'orgId': orgId });
      }
    })
  }

  componentWillUnmount() {
    this.props.updateInboxCount(this.props.authenticated);
    this.props.unloadInbox(this.props.authenticated, this.props.orgId);

    this.props.unloadProjectNames(this.props.orgId, Constants.INBOX_PAGE)
    this.props.unloadOrgList(this.props.authenticated, Constants.INBOX_PAGE)
    this.props.unloadThreadCounts(this.props.authenticated, this.props.orgId)
    this.props.unloadProjectList(this.props.authenticated, this.props.orgId, Constants.INBOX_PAGE)
    this.props.unloadOrgUser(this.props.authenticated, this.props.orgId, Constants.INBOX_PAGE)
    this.props.unloadOrg(this.props.authenticated, this.props.orgId, Constants.INBOX_PAGE);
    if (!this.props.authenticated) {
      this.props.setAuthRedirect(this.props.location.pathname);
    }
  }

  onLoadMoreClick = ev => {
    ev.preventDefault()
    this.props.getInbox(this.props.authenticated, this.props.dateIndex, this.props.orgId, this.props.params.orgurl)
  }

  render() {
    if (!this.props.authenticated) {
      return (
        <LoggedOutMessage />
      )
    }
    if(this.props.invalidOrgUser) {
      return (
        <InvalidOrg/>
      )
    }
    if (this.props.inboxIsEmpty) {
      return (
        <div>
        <Sidebar
            sidebar={<ProjectList />}
            open={this.props.sidebarOpen}
            onSetOpen={mql.matches ? this.props.setSidebarOpen : () => this.props.setSidebar(!this.props.sidebarOpen)}
            styles={{ sidebar: {
                  borderRight: "1px solid rgba(0,0,0,.1)",
                  boxShadow: "none",
                  zIndex: "100"
                },
                overlay: mql.matches ? {
                  backgroundColor: "rgba(255,255,255,1)"
                } : {
                  zIndex: 12,
                  backgroundColor: "rgba(0, 0, 0, 0.5)"
                },
              }}
            >
          <div className={this.props.sidebarOpen ? 'open-style' : 'closed-style'}>
            <div className="page-common page-activity flx flx-col flx-center-all ">
              <div className="project-header brdr-bottom brdr-color--primary--10 text-left flx flx-col flx-align-start w-100">
                <OrgHeader />
                {/* HEADER START */}
              </div>
              {/* CONTAINER - START */}
                <div className="koi-view header-push flx flx-col ta-left">
                  <div className="co-post-title mrgn-bottom-md">Activity</div>

                  No activity messages
                </div>
              </div>
            </div>
          </Sidebar>
        </div>
      );
    }
	  if (!this.props.inbox) {
      return (
        <div className="loading-module flx flx-col flx-center-all v2-type-body3 fill--primary">
          <div className="loader-wrapper flx flx-col flx-center-all">
            <div className="loading-koi mrgn-bottom-lg">
              <img className="center-img" src="/img/logomark.png"/>
            </div>
            <div className="co-type-body color--white">Loading Activity</div>
          </div>
        </div>
      );
    }
    return (
      <div>
        <Sidebar
            sidebar={<ProjectList />}
            open={this.props.sidebarOpen}
            onSetOpen={mql.matches ? this.props.setSidebarOpen : () => this.props.setSidebar(!this.props.sidebarOpen)}
            styles={{ sidebar: {
                  borderRight: "1px solid rgba(0,0,0,.1)",
                  boxShadow: "none",
                  zIndex: "100"
                },
                overlay: mql.matches ? {
                  backgroundColor: "rgba(255,255,255,1)"
                } : {
                  zIndex: 12,
                  backgroundColor: "rgba(0, 0, 0, 0.5)"
                },
              }}
            >
          <div className={this.props.sidebarOpen ? 'open-style' : 'closed-style'}>
            <div className="page-common page-activity flx flx-col flx-center-all ">
              <div className="project-header brdr-bottom brdr-color--primary--10 text-left flx flx-col flx-align-start w-100">
                <OrgHeader />
                {/* HEADER START */}
              </div>
              {/* CONTAINER - START */}
                <div className="koi-view header-push flx flx-col ta-left">
                  <div className="co-post-title mrgn-bottom-md">Activity</div>


                  {
                    this.props.inbox.map(inboxItem => {
                      // const isUser = this.props.currentUser &&
                      //   follower.userId === this.props.currentUser.uid;
                        return (
                          <Link className="flx flx-row brdr-bottom flx-align-start pdding-all-sm list-row" key={inboxItem.key} to={'/' + this.props.params.orgurl + inboxItem.link}>
                            <LeftSenderPic 
                              senderId={inboxItem.senderId} 
                              username={inboxItem.senderUsername} 
                              image={inboxItem.senderImage}
                              orgURL={this.props.params.orgurl} />
                            <div className="flx flx-col mrgn-right-md">
                              <div className="co-type-body color--black">
                                <strong><RenderUsername senderId={inboxItem.senderId} username={inboxItem.senderUsername} orgURL={this.props.params.orgurl} /></strong>
                                {inboxItem.message}

                                <Link to={'/' + this.props.params.orgurl + inboxItem.link}><span className="color--primary inline">{inboxItem.reviewTitle}</span></Link>

                              </div>
                              <div className="thread-timestamp color--black"><DisplayTimestamp timestamp={inboxItem.lastModified} /></div>

                            </div>
                          </Link>
                        )
                    })
                  }
                    <div className="w-100 flx flx-row flx-center-all mrgn-top-lg">
                    {!this.props.endOfInbox && <button className="vb vb--sm vb--outline-none fill--white" onClick={this.onLoadMoreClick}>
                      <div className="mobile-hide mrgn-right-sm">Load more messages</div>
                      <i className="material-icons color--primary md-32 DN">keyboard_arrow_right</i>
                    </button>}
                  </div>
                </div>
              </div>
            </div>
          </Sidebar>
        </div>

    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Inbox);