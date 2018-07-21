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

const mapStateToProps = state => ({
  ...state.project,
  authenticated: state.common.authenticated,
  organization: state.common.organization,
  invalidOrgUser: state.common.invalidOrgUser
});

class Project extends React.Component {
  constructor() {
    super();

    this.searchInputCallback = result => {
        if (result.placeId) {
          browserHistory.push('/project/' + result.projectId);
        }
      }

    this.onAddThreadClick = () => {
      this.props.goToAddThread(this.props.params.pid);
    }
  }

  componentWillMount() {
    this.props.loadOrg(this.props.authenticated, this.props.params.orgname);
    this.props.loadProject(this.props.params.pid);
    this.props.watchProjectThreads(this.props.params.pid);
    // this.props.sendMixpanelEvent(Constants.MIXPANEL_PAGE_VIEWED, { 'page name' : 'project'});
  }

  componentWillUnmount() {
    this.props.unloadProjectThreads(this.props.params.pid);
    this.props.unloadOrg();
    if (!this.props.authenticated) this.props.setAuthRedirect(this.props.location.pathname);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.params.pid !== this.props.params.pid) {
      this.props.unloadProjectThreads(this.props.params.pid);
      this.props.loadProject(nextProps.params.pid);
      this.props.watchProjectThreads(nextProps.params.pid);
    }
  }

  render() {
    if(this.props.invalidOrgUser) {
      return (
        <div>
          You don't have permission to view this team. <Link to='/'>Go Home</Link>
        </div>
      )
    }
    if (this.props.projectNotFoundError) {
      return (
        <div className="error-module flx flx-col flx-center-all ta-center v2-type-body3 color--black">
          <div className="xiao-img-wrapper mrgn-bottom-sm">
            <img className="center-img" src="/img/xiaog.png"/>
          </div>
          <div className="mrgn-bottom-md">Sorry, we couldn't find this project.</div>
        </div>
      )
    }
    if (!this.props.project) {
      return (
        <LoadingSpinner message="Loading project" />
        )
    }
    // if (!this.props.feed) {
    //   return (
    //     <div className="loading-module flx flx-col flx-center-all v2-type-body3 fill--black">
    //       <div className="loader-wrapper flx flx-col flx-center-all fill--black">
    //         <div className="loader-bird"></div>
    //         <div className="loader">
    //           <div className="bar1"></div>
    //           <div className="bar2"></div>
    //           <div className="bar3"></div>
    //         </div>
    //         <div className="v2-type-body2 color--white">Loading location</div>
    //       </div>
    //     </div>
    //     )
    // }
    // else if (this.props.feed.length === 0) {
    //   return (
    //     <div> No itineraries created for {this.props.geo.label}.</div>
    //   )
    // }
    return (
    <div>

      <div className="page-common page-places flx flx-row flx-align-start">
        
            {/*<UniversalSearchBar />*/}
        
        <ProjectList />

        <div className="thread-area flx flx-col w-100">
          <div className={"page-title-wrapper text-left country-color-"}>
            <div className="v2-type-page-header flx flx-col flx-align-start text-left invert">
              {this.props.project.name}
            </div>
            <div>
              <Link to={'/addthread/' + this.props.params.pid} activeClassName="active" className="nav-module create nav-editor flx flx-align-start text-left">
                <div className="nav-text flx flx-row flx-align-center">
                  <i className="material-icons color--success md-24 opa-100 mrgn-right-xs">add</i>
                  <div className="mrgn-left-xs">New Thread</div>
                </div>
              </Link>
            </div>
            <div className="v2-type-body2 opa-60"></div>
          </div>
          <div className="feed-wrapper">
            <ThreadList
              threads={this.props.threads} 
              authenticated={this.props.authenticated} />
          </div>
        </div>
      </div>

    </div>
    );
  }
}

export default connect(mapStateToProps, Actions)(Project);