import React from 'react';
import { connect } from 'react-redux';
import * as Actions from '../actions';
import * as Constants from '../constants';
import { Link, browserHistory } from 'react-router';
import FirebaseSearchInput from './FirebaseSearchInput';
import UniversalSearchBar from './UniversalSearchBar';
import LoadingSpinner from './LoadingSpinner';
import ThreadList from './ThreadList';
import ProjectList from './ProjectList';
import LoggedOutMessage from './LoggedOutMessage';
import InfiniteScroll from 'react-infinite-scroller';

const ProjectHeader = props => {
  if (props.projectId) {
    if (!props.project) return null
    else return (
      <div className={"project-header text-left flx flx-row flx-align-start"}>
        <div className="co-type-h1 flx flx-row flx-align-start text-left invert">
          {props.project.name}
        </div>
        <div className="flx flx-align-start flx-item-right DN">
          <Link to={'/' + props.orgName + '/' + props.projectId + '/addthread'} activeClassName="active" className="flx flx-align-center flx-item-right">
              <div className="mrgn-left-xs color--primary label-big flx-item-right mrgn-right-sm">New Thread</div>
              <div className="icon-wrapper brdr--primary flx flx-center-all">
                <i className="material-icons color--primary md-24 opa-100">add</i>
              </div>
          </Link>
        </div>
      </div>
    )
  }
  else return (
    <div className={"project-header text-left flx flx-row flx-align-start"}>
        <div className="co-type-h1 flx flx-row flx-align-start text-left invert">
          All
        </div>
      </div>
  )
}

const mapStateToProps = state => ({
  ...state.project,
  authenticated: state.common.authenticated,
  organization: state.common.organization,
  invalidOrgUser: state.common.invalidOrgUser
});

class Project extends React.Component {
  constructor() {
    super();

    // this.searchInputCallback = result => {
    //     if (result.placeId) {
    //       browserHistory.push('/project/' + result.projectId);
    //     }
    //   }

    this.scrolledToBottom = () => {
      if (!this.props.isFeedLoading) {
        this.props.watchThreadFeed(this.props.authenticated, this.props.params.orgname, this.props.params.pid, this.props.feedEndValue, Constants.PROJECT_PAGE)
      }
    }
  }

  componentWillMount() {
    this.props.loadOrg(this.props.authenticated, this.props.params.orgname, Constants.PROJECT_PAGE);
    this.props.loadProjectList(this.props.authenticated, this.props.params.orgname, Constants.PROJECT_PAGE)
    this.props.loadThreadCounts(this.props.authenticated, this.props.params.orgname)
    this.props.loadOrgList(this.props.authenticated, Constants.PROJECT_PAGE)
    this.props.loadProject(this.props.params.pid);
    // this.props.watchProjectThreads(this.props.params.pid);
    // this.props.watchThreadFeed(this.props.authenticated, this.props.params.orgname, this.props.params.pid, this.props.feedEndValue, Constants.PROJECT_PAGE)
    // this.props.sendMixpanelEvent(Constants.MIXPANEL_PAGE_VIEWED, { 'page name' : 'project'});
  }

  componentDidMount() {
    this.props.markProjectRead(this.props.authenticated, this.props.params.pid)
  }

  componentWillUnmount() {
    this.props.unwatchThreadFeed(this.props.authenticated, this.props.params.orgname, this.props.params.pid, Constants.PROJECT_PAGE)
    this.props.unloadOrgList(this.props.authenticated, Constants.PROJECT_PAGE)
    this.props.unloadThreadCounts(this.props.authenticated, this.props.params.orgname)
    this.props.unloadProjectList(this.props.authenticated, this.props.params.orgname, Constants.PROJECT_PAGE)
    this.props.unloadOrg(Constants.PROJECT_PAGE);
    if (!this.props.authenticated) this.props.setAuthRedirect(this.props.location.pathname);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.params.pid !== this.props.params.pid && nextProps.params.orgname === this.props.params.orgname) {
      this.props.unwatchThreadFeed(this.props.authenticated, this.props.params.orgname, this.props.params.pid, Constants.PROJECT_PAGE)
      this.props.loadProject(nextProps.params.pid);
      // this.props.watchThreadFeed(this.props.authenticated, this.props.params.orgname, nextProps.params.pid, this.props.feedEndValue, Constants.PROJECT_PAGE)
      this.props.markProjectRead(this.props.authenticated, nextProps.params.pid)
    }
    else if (nextProps.params.orgname !== this.props.params.orgname) {
      this.props.unwatchThreadFeed(this.props.authenticated, this.props.params.orgname, this.props.params.pid, Constants.PROJECT_PAGE)
      this.props.unloadThreadCounts(this.props.authenticated, this.props.params.orgname)
      this.props.unloadProjectList(this.props.authenticated, this.props.params.orgname, Constants.PROJECT_PAGE)
      this.props.unloadOrg(Constants.PROJECT_PAGE);
      this.props.loadOrg(this.props.authenticated, nextProps.params.orgname, Constants.PROJECT_PAGE);
      this.props.loadProjectList(this.props.authenticated, nextProps.params.orgname, Constants.PROJECT_PAGE)
      this.props.loadThreadCounts(this.props.authenticated, nextProps.params.orgname)
      this.props.loadProject(nextProps.params.pid);
      // this.props.watchThreadFeed(this.props.authenticated,nextProps.params.orgname, nextProps.params.pid, this.props.feedEndValue, Constants.PROJECT_PAGE)
      this.props.markProjectRead(this.props.authenticated, nextProps.params.pid)
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

          <div className="page-common page-places flx flx-row flx-align-start">
            
                {/*<UniversalSearchBar />*/}
            
            {/*<ProjectList 
              threadCounts={this.props.threadCounts}
              projectId={this.props.params.pid}
              source={Constants.PROJECT_PAGE} />*/}

            <div className="thread-area flx flx-col w-100">
              
                <ProjectHeader 
                  orgName={this.props.params.orgname}
                  projectId={this.props.params.pid}
                  project={this.props.project}
                />
                
              <div className="threadlist-wrapper flx flx-col flx-align-start w-100">

                <InfiniteScroll
                  pageStart={0}
                  loadMore={this.scrolledToBottom}
                  hasMore={true}
                  loader={<div className="loader" key={0}>Loading ...</div>} >
                  
                  <Link to={'/' + this.props.params.orgname + '/' + this.props.params.pid + '/addthread'} className="thread-preview-container flx flx-row flx-align-center w-100">
                    <div className="thread-icon flx flx-center-all flx-hold mrgn-right-md">
                      <div className="co-icon-wrapper flx flx-center-all">
                        <div className="feed-gem circle gem-create"></div>
                      </div>
                    </div>
                    <div className="color--black co-type-body flx flx-row">
                      New Thread
                    </div>
                  </Link>

                  <ThreadList
                    threads={this.props.threads} 
                    authenticated={this.props.authenticated}
                    orgName={this.props.params.orgname}
                    emptyThreadFeed={this.props.emptyThreadFeed}
                    projectNotFoundError={this.props.projectNotFoundError}
                    className={"w-100"} />


                </InfiniteScroll>

              </div>
            </div>
          </div>

      );
    }
  }
}

export default connect(mapStateToProps, Actions)(Project);