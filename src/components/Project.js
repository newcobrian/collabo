import React from 'react';
import { connect } from 'react-redux';
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

const mql = window.matchMedia(`(min-width: 800px)`);

const mapStateToProps = state => ({
  ...state.project,
  authenticated: state.common.authenticated,
  userInfo: state.common.userInfo,
  organization: state.common.organization,
  invalidOrgUser: state.common.invalidOrgUser,
  sidebarOpen: state.common.sidebarOpen
});

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
  }

  componentDidMount() {
    this.props.loadSidebar(mql);
    mql.addListener(this.mediaQueryChanged);

    this.props.loadOrg(this.props.authenticated, this.props.params.orgname, Constants.PROJECT_PAGE);
    this.props.loadProjectList(this.props.authenticated, this.props.params.orgname, this.props.params.pid, Constants.PROJECT_PAGE)

    this.props.loadProject(this.props.params.pid, Constants.PROJECT_PAGE);
    this.props.loadProjectMembers(this.props.params.pid, this.props.params.orgname, Constants.PROJECT_PAGE)
    // this.props.loadLikesByUser(this.props.authenticated, this.props.params.orgname)

    if (this.props.params.pid) {
      this.props.markProjectRead(this.props.authenticated, this.props.params.pid)
    }
  }

  componentWillUnmount() {
    this.props.unloadProjectList(this.props.authenticated, this.props.params.orgname, Constants.PROJECT_PAGE)

    this.props.unwatchThreadFeed(this.props.authenticated, this.props.params.orgname, this.props.params.pid, Constants.PROJECT_PAGE)
    this.props.unloadOrg(Constants.PROJECT_PAGE);
    this.props.unloadProjectMembers(this.props.params.pid, this.props.params.orgname, Constants.PROJECT_PAGE)
    if (!this.props.authenticated) this.props.setAuthRedirect(this.props.location.pathname);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.params.pid !== this.props.params.pid && nextProps.params.orgname === this.props.params.orgname) {
      this.props.unwatchThreadFeed(this.props.authenticated, this.props.params.orgname, this.props.params.pid, Constants.PROJECT_PAGE)
      this.props.unloadProjectMembers(this.props.params.pid, this.props.params.orgname, Constants.PROJECT_PAGE)

      this.props.loadProject(nextProps.params.pid, Constants.PROJECT_PAGE);
      this.props.loadProjectMembers(nextProps.params.pid, this.props.params.orgname, Constants.PROJECT_PAGE)
      // this.props.watchThreadFeed(this.props.authenticated, this.props.params.orgname, nextProps.params.pid, this.props.feedEndValue, Constants.PROJECT_PAGE)
      if (nextProps.params.pid) {
        this.props.markProjectRead(this.props.authenticated, nextProps.params.pid)
      }
    }
    else if (nextProps.params.orgname !== this.props.params.orgname) {
      this.props.unwatchThreadFeed(this.props.authenticated, this.props.params.orgname, this.props.params.pid, Constants.PROJECT_PAGE)
      
      this.props.unloadProjectList(this.props.authenticated, this.props.params.orgname, Constants.PROJECT_PAGE)
      this.props.unloadOrg(Constants.PROJECT_PAGE);
      this.props.unloadProjectMembers(this.props.params.pid, this.props.params.orgname, Constants.PROJECT_PAGE)

      this.props.loadOrg(this.props.authenticated, nextProps.params.orgname, Constants.PROJECT_PAGE);
      this.props.loadProjectList(this.props.authenticated, nextProps.params.orgname, nextProps.params.pid, Constants.PROJECT_PAGE)

      this.props.loadProject(nextProps.params.pid, Constants.PROJECT_PAGE);
      this.props.loadProjectMembers(nextProps.params.pid, nextProps.params.orgname, Constants.PROJECT_PAGE)
      // this.props.watchThreadFeed(this.props.authenticated,nextProps.params.orgname, nextProps.params.pid, this.props.feedEndValue, Constants.PROJECT_PAGE)
      if (nextProps.params.pid) {
        this.props.markProjectRead(this.props.authenticated, nextProps.params.pid)
      }
    }
  }


  render() {
    if (!this.props.authenticated) {
      return (
        <LoggedOutMessage />
      )
    }
    else if(this.props.invalidOrgUser) {
      return (
        <div>
          You don't have permission to view this team. <Link to='/'>Go Home</Link>
        </div>
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
                    borderRight: "1px solid rgba(255,171,140,.4)",
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

                <div className="page-common page-places flx flx-row flx-align-start">
                  
                    <ProjectHeader 
                      orgName={this.props.params.orgname}
                      projectId={this.props.params.pid}
                      project={this.props.project}
                    />
                    <div className="threadlist-outer flx flx-row">              
                      <div className="threadlist-wrapper flx flx-col flx-align-start w-100 h-100">


                        <InfiniteScroll
                            pageStart={0}
                            loadMore={this.scrolledToBottom}
                            hasMore={true}
                            loader={<div className="loader" key={0}>Loading ...</div>}
                            useWindow={false} >

                          <ThreadList
                            authenticated={this.props.authenticated}
                            userInfo={this.props.userInfo}
                            threads={this.props.threads} 
                            orgName={this.props.params.orgname}
                            emptyThreadFeed={this.props.emptyThreadFeed}
                            projectNotFoundError={this.props.projectNotFoundError}
                            projectNames={this.props.projectNames}
                            project={this.props.project}
                            usersList={this.props.usersList}
                            deleteComment={this.props.onDeleteThreadComment}
                            className={"w-100 h-100"} />


                        </InfiniteScroll>
                      </div>
                    </div>

                      <ProjectInfo 
                        className="threadlist-wrapper flx flx-col flx-align-start w-100 h-100"
                        projectMembers={this.props.projectMembers}
                        project={this.props.project}
                        projectId={this.props.params.pid}
                        orgName={this.props.params.orgname} />
                </div>
              </div>
            </Sidebar>
          </div>
      );
    }
  }
}

export default connect(mapStateToProps, Actions)(Project);