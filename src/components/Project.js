import React from 'react';
import { connect } from 'react-redux';
import Firebase from 'firebase';
import * as Actions from '../actions';
import * as Constants from '../constants';
import { Link, browserHistory } from 'react-router';
import LoadingSpinner from './LoadingSpinner';
import ThreadList from './ThreadList';
import ProjectList from './ProjectList';
import LoggedOutMessage from './LoggedOutMessage';
import InfiniteScroll from 'react-infinite-scroller';
import ProjectInfo from './ProjectInfo';
import ProjectHeader from './ProjectHeader';
import Sidebar from 'react-sidebar';
import InvalidOrg from './InvalidOrg'

const mql = window.matchMedia(`(min-width: 800px)`);

const mapStateToProps = state => ({
  ...state.project,
  authenticated: state.common.authenticated,
  // userInfo: state.common.userInfo,
  orgUser: state.common.orgUser,
  organization: state.common.organization,
  invalidOrgUser: state.common.invalidOrgUser,
  sidebarOpen: state.common.sidebarOpen
});

const mapDispatchToProps = {
  watchThreadFeed: Actions.watchThreadFeed,
  setSidebar: Actions.setSidebar,
  setSidebarOpen: Actions.setSidebarOpen,
  showProjectInviteModal: Actions.showProjectInviteModal,
  showOrgInviteModal: Actions.showOrgInviteModal,
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
  markProjectRead: Actions.markProjectRead,
  unwatchThreadFeed: Actions.unwatchThreadFeed,
  unloadProjectNames: Actions.unloadProjectNames,
  unloadOrgList: Actions.unloadOrgList,
  unloadThreadCounts: Actions.unloadThreadCounts,
  unloadProjectList: Actions.unloadProjectList,
  unloadOrg: Actions.unloadOrg,
  unloadProjectMembers: Actions.unloadProjectMembers,
  unloadOrgMembers: Actions.unloadOrgMembers,
  setAuthRedirect: Actions.setAuthRedirect,
  notAnOrgUserError: Actions.notAnOrgUserError,
  showThreadModal: Actions.showThreadModal,
  onDeleteThreadComment: Actions.onDeleteThreadComment
}

class Project extends React.Component {
  constructor() {
    super();

    this.scrolledToBottom = () => {
      if (!this.props.isFeedLoading) {
        this.props.watchThreadFeed(this.props.authenticated, this.props.params.orgname, this.props.params.pid, this.props.feedEndValue, Constants.PROJECT_PAGE)
      }
    }

    this.mediaQueryChanged = () => {
      this.props.setSidebar(mql.matches);
    }

    this.onProjectInviteClick = (project) => {
      this.props.showProjectInviteModal(this.props.params.pid, this.props.project, this.props.orgId, this.props.params.orgname, this.props.orgMembers)
    }

    this.onOrgInviteClick = ev => {
      this.props.showOrgInviteModal(this.props.orgId, this.props.params.orgname)
    }
  }

  componentDidMount() {
    this.props.loadSidebar(mql);
    mql.addListener(this.mediaQueryChanged);

    let lowerCaseOrgName = this.props.params.orgname ? this.props.params.orgname.toLowerCase() : ''
    Firebase.database().ref(Constants.ORGS_BY_NAME_PATH + '/' + lowerCaseOrgName).once('value', orgSnap => {
      if (!orgSnap.exists()) {
        this.props.notAnOrgUserError(Constants.PROJECT_PAGE)
      }
      else {
        let orgId = orgSnap.val().orgId
        this.props.loadOrg(this.props.authenticated, orgId, this.props.params.orgname, Constants.PROJECT_PAGE);
        this.props.loadOrgUser(this.props.authenticated, orgId, Constants.PROJECT_PAGE)
        this.props.loadProjectList(this.props.authenticated, orgId, this.props.params.pid, Constants.PROJECT_PAGE)
        this.props.loadThreadCounts(this.props.authenticated, orgId)
        this.props.loadOrgList(this.props.authenticated, Constants.PROJECT_PAGE)
        this.props.loadProjectNames(orgId, Constants.PROJECT_PAGE)
        
        this.props.loadProject(this.props.params.pid, orgId, Constants.PROJECT_PAGE);
        this.props.loadProjectMembers(this.props.params.pid, Constants.PROJECT_PAGE)
        this.props.loadOrgMembers(orgId,  Constants.PROJECT_PAGE)
      }
    })
    
    // this.props.loadLikesByUser(this.props.authenticated, this.props.params.orgname)

    this.props.sendMixpanelEvent(Constants.MIXPANEL_PAGE_VIEWED, { 'page name' : 'project'});

    if (this.props.params.pid) {
      this.props.markProjectRead(this.props.authenticated, this.props.params.pid)
    }
  }

  componentWillUnmount() {
    this.props.unwatchThreadFeed(this.props.authenticated, this.props.orgId, this.props.params.pid, Constants.PROJECT_PAGE)
    this.props.unloadProjectNames(this.props.orgId, Constants.PROJECT_PAGE)
    this.props.unloadOrgList(this.props.authenticated, Constants.PROJECT_PAGE)
    this.props.unloadThreadCounts(this.props.authenticated, this.props.orgId)
    this.props.unloadProjectList(this.props.authenticated, this.props.orgId, Constants.PROJECT_PAGE)
    this.props.unloadOrg(Constants.PROJECT_PAGE);
    this.props.unloadProjectMembers(this.props.params.pid, Constants.PROJECT_PAGE)
    this.props.unloadOrgMembers(this.props.orgId, Constants.PROJECT_PAGE)
    if (!this.props.authenticated) this.props.setAuthRedirect(this.props.location.pathname);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.params.pid !== this.props.params.pid && nextProps.params.orgname === this.props.params.orgname) {
      this.props.unwatchThreadFeed(this.props.authenticated, this.props.orgId, this.props.params.pid, Constants.PROJECT_PAGE)
      this.props.unloadProjectMembers(this.props.params.pid, Constants.PROJECT_PAGE)

      this.props.loadProject(nextProps.params.pid, this.props.orgId, Constants.PROJECT_PAGE);
      this.props.loadProjectMembers(nextProps.params.pid, Constants.PROJECT_PAGE)
      // this.props.watchThreadFeed(this.props.authenticated, this.props.params.orgname, nextProps.params.pid, this.props.feedEndValue, Constants.PROJECT_PAGE)
      if (nextProps.params.pid) {
        this.props.markProjectRead(this.props.authenticated, nextProps.params.pid)
      }
    }
    else if (nextProps.params.orgname !== this.props.params.orgname) {
      this.props.unloadProjectNames(this.props.orgId, Constants.PROJECT_PAGE)
      this.props.unwatchThreadFeed(this.props.authenticated, this.props.orgId, this.props.params.pid, Constants.PROJECT_PAGE)
      this.props.unloadThreadCounts(this.props.authenticated, this.props.orgId)
      this.props.unloadProjectList(this.props.authenticated, this.props.orgId, Constants.PROJECT_PAGE)
      this.props.unloadOrg(Constants.PROJECT_PAGE);
      this.props.unloadProjectMembers(this.props.params.pid, Constants.PROJECT_PAGE)
      this.props.unloadOrgMembers(this.props.orgId, Constants.PROJECT_PAGE)


      let lowerCaseOrgName = nextProps.params.orgname ? nextProps.params.orgname.toLowerCase() : ''
      Firebase.database().ref(Constants.ORGS_BY_NAME_PATH + '/' + lowerCaseOrgName).once('value', orgSnap => {
        if (!orgSnap.exists()) {
          this.props.notAnOrgUserError(Constants.PROJECT_PAGE)
        }
        else {
          let orgId = orgSnap.val().orgId
          this.props.loadOrg(this.props.authenticated, orgId, nextProps.params.orgname, Constants.PROJECT_PAGE);
          this.props.loadProjectList(this.props.authenticated, orgId, this.props.params.pid, Constants.PROJECT_PAGE)
          this.props.loadThreadCounts(this.props.authenticated, orgId)
          this.props.loadProjectNames(orgId, Constants.PROJECT_PAGE)
          this.props.loadProject(nextProps.params.pid, orgId, Constants.PROJECT_PAGE);
          this.props.loadProjectMembers(nextProps.params.pid, Constants.PROJECT_PAGE)
          this.props.loadOrgMembers(orgId, Constants.PROJECT_PAGE)

          // this.props.watchThreadFeed(this.props.authenticated, orgId, nextProps.params.pid, Constants.PROJECT_PAGE)

          if (nextProps.params.pid) {
            this.props.markProjectRead(this.props.authenticated, nextProps.params.pid)
          }
        }
      })
    }
  }


  render() {
    // console.log(JSON.stringify(this.props.threads))
    if (!this.props.authenticated) {
      return (
        <LoggedOutMessage />
      )
    }
    else if(this.props.invalidOrgUser) {
      return (
        <InvalidOrg/>
      )
    }
    // if (this.props.projectNotFoundError) {
    //   return (
    //     <div className="error-module flx flx-col flx-center-all ta-center v2-type-body3 color--black">
    //       <div className="xiao-img-wrapper mrgn-bottom-sm">
    //         <img className="center-img" src="/img/xiaog.png"/>
    //       </div>
    //       <div className="mrgn-bottom-md">Sorry, we couldn't find this project.</div>
    //     </div>
    //   )
    // }
    // if (!this.props.project) {
    //   return (
    //     <LoadingSpinner message="Loading project" />
    //     )
    // }
    // else if (this.props.emptyThreadFeed) {
    //   return (
    //     <div className="error-module flx flx-col flx-center-all ta-center v2-type-body3 color--black">
    //       <div className="xiao-img-wrapper mrgn-bottom-sm">
    //         <img className="center-img" src="/img/xiaog.png"/>
    //       </div>
    //       <div className="mrgn-bottom-md">This project is empty. Why don't you create one</div>
    //     </div>
    //   )
    // }
    // if (!this.props.threads) {
    //   return (
    //     <div className="loading-module flx flx-col flx-center-all v2-type-body3 fill--black">
    //       <div className="loader-wrapper flx flx-col flx-center-all fill--black">
    //         <div className="loader-bird"></div>
    //         <div className="loader">
    //           <div className="bar1"></div>
    //           <div className="bar2"></div>
    //           <div className="bar3"></div>
    //         </div>
    //         <div className="v2-type-body2 color--white">Loading feed...</div>
    //       </div>
    //     </div>
    //     )
    // }
    else {
      return (
        <div>
          <Sidebar
              sidebar={<ProjectList />}
              open={this.props.sidebarOpen}
              onSetOpen={mql.matches ? this.props.setSidebarOpen : () => this.props.setSidebar(!this.props.sidebarOpen)}
              styles={{ sidebar: {
                    borderRight: "none",
                    boxShadow: "none",
                    zIndex: "100"
                  },
                  overlay: mql.matches ? {
                    backgroundColor: "rgba(255,255,255)"
                  } : {
                    zIndex: 12,
                    backgroundColor: "rgba(0, 0, 0, 0.5)"
                  },
                }}
              >

              <div className={this.props.sidebarOpen ? 'open-style' : 'closed-style'}>

                <div className="page-common page-places flx flx-row flx-align-start fill--mist">
                  
                    <ProjectHeader 
                      orgName={this.props.params.orgname}
                      projectId={this.props.params.pid}
                      project={this.props.project}
                      onProjectInviteClick={this.onProjectInviteClick}
                    />
                    <div className="threadlist-outer fill--mist flx flx-row">              
                      <div className="threadlist-wrapper fill--mist flx flx-col flx-align-start w-100 h-100">


                        <InfiniteScroll
                            pageStart={0}
                            loadMore={this.scrolledToBottom}
                            hasMore={true}
                            loader={<div className="infinite-loader loader" key={0}>Loading ...</div>}
                            useWindow={false} >

                          <ThreadList
                            authenticated={this.props.authenticated}
                            userInfo={this.props.orgUser}
                            threads={this.props.threads} 
                            orgName={this.props.params.orgname}
                            emptyThreadFeed={this.props.emptyThreadFeed}
                            projectNotFoundError={this.props.projectNotFoundError}
                            projectNames={this.props.projectNames}
                            project={this.props.project}
                            deleteComment={this.props.onDeleteThreadComment}
                            projectCheck={this.props.projectCheck}
                            orgMembers={this.props.orgMembers}
                            orgUserData={this.props.orgUserData}
                            showThreadModal={this.props.showThreadModal}
                            className={"w-100 h-100"} />


                        </InfiniteScroll>
                      </div>
                    </div>

                      <ProjectInfo 
                        className="threadlist-wrapper flx flx-col flx-align-start w-100 h-100"
                        projectMembers={this.props.projectMembers}
                        orgMembers={this.props.orgMembers}
                        project={this.props.project}
                        projectId={this.props.params.pid}
                        orgName={this.props.params.orgname}
                        onProjectInviteClick={this.onProjectInviteClick}
                        onOrgInviteClick={this.onOrgInviteClick} />
                </div>
              </div>
            </Sidebar>
          </div>
      );
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Project);