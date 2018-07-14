import React from 'react';
import { connect } from 'react-redux';
import * as Actions from '../actions';
import * as Constants from '../constants';
import ItineraryList from './ItineraryList'; 
import { Link, browserHistory } from 'react-router';
import FirebaseSearchInput from './FirebaseSearchInput';
import UniversalSearchBar from './UniversalSearchBar';
import LoadingSpinner from './LoadingSpinner';
import ProfilePic from './ProfilePic';
import DisplayTimestamp from './DisplayTimestamp';
import RenderDebounceInput from './RenderDebounceInput';

const mapStateToProps = state => ({
  ...state.thread,
  authenticated: state.common.authenticated
})

const BodySection = props => {
  if (props.canModify) {
    return (
      <div>
        <RenderDebounceInput
          type="textarea"
          className="w-100 show-border"
          cols="10"
          wrap="hard"
          value={props.body}
          placeholder="Add notes here"
          debounceFunction={props.changeBody(props.thread)} />
      </div>
    )
  }
  else {
    return (
      <div>
        {props.body}
      </div>
    )
  }
}


class Thread extends React.Component {
  constructor() {
    super();

    this.searchInputCallback = result => {
      if (result.placeId) {
        browserHistory.push('/thread/' + result.threadId);
      }
    }

    const updateThreadFieldEvent = (field, value, thread) =>
      this.props.updateThreadField(this.props.authenticated, this.props.params.tid, thread, field, value)

    this.changeBody = thread => value => updateThreadFieldEvent('body', value, thread)
  }

  componentWillMount() {
    this.props.loadThread(this.props.params.tid);
    // this.props.getProjectFeed(this.props.authenticated, this.props.params.tid);
    // this.props.sendMixpanelEvent(Constants.MIXPANEL_PAGE_VIEWED, { 'page name' : 'project'});
  }

  componentWillUnmount() {
    this.props.unloadThread(this.props.params.tid);
    // if (!this.props.authenticated) this.props.setAuthRedirect(this.props.location.pathname);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.params.tid !== this.props.params.tid) {
      this.props.unloadThread(this.props.params.tid);
      this.props.loadThread(nextProps.params.tid);
      // this.props.getProjectFeed(this.props.authenticated, nextProps.params.tid);
    }
  }

  render() {
    if (this.props.threadNotFoundError) {
      return (
        <div className="error-module flx flx-col flx-center-all ta-center v2-type-body3 color--black">
          <div className="xiao-img-wrapper mrgn-bottom-sm">
            <img className="center-img" src="/img/xiaog.png"/>
          </div>
          <div className="mrgn-bottom-md">Sorry, we couldn't find this thread.</div>
        </div>
      )
    }
    if (!this.props.thread) {
      return (
        <LoadingSpinner message="Loading thread" />
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
    else {
      let thread = this.props.thread
      let createdBy = this.props.createdBy
      let canModify = this.props.authenticated === this.props.thread.userId ? true : false

      // const showBody = (canModify) => {
      //   if (canModify) {
      //     return (
      //       <div className="tip__caption v2-type-body2 font--beta  ta-left opa-70">
      //         <RenderDebounceInput
      //           type="textarea"
      //           className="w-100 show-border"
      //           cols="10"
      //           wrap="hard"
      //           value={thread.body}
      //           placeholder="Add notes here"
      //           debounceFunction={this.changeBody(thread)} />
      //       </div>
      //     )
      //   }
      //   else {
      //     return (
      //       <div>{thread.body}</div>
      //     )
      //   }
      // }

      return (
        <div>

          <div className="page-common page-places flx flx-col flx-align-start">
            
            <div>
              <Link onClick={browserHistory.goBack} activeClassName="active" className="nav-module create nav-editor flx flx-center-all">
                <div className="nav-text flx flx-row flx-align-center">
                  <i className="material-icons color--success md-24 opa-100 mrgn-right-xs">arrow_back_ios</i>
                  <div className="mobile-hide mrgn-left-xs">Back to Project</div>
                </div>
              </Link>
            </div>
                {/*<UniversalSearchBar />*/}
            


            <div className={"page-title-wrapper center-text country-color-"}>
              <div>Title: {thread.title}</div>
              <div>Author: {createdBy.username}
                <Link
                  to={'/' + createdBy.username}
                  className="show-in-list">
                <div className="flx flx-row flx-just-start flx-align-center mrgn-bottom-sm">
                    <div className="tip__author-photo flx-hold mrgn-right-sm">
                      <ProfilePic src={createdBy.image} className="user-image user-image-sm center-img" />
                    </div> 
                    <div className="color--black v2-type-body1">
                      {createdBy.username}
                    </div>
                </div>
              </Link> 
              </div>
              <div>Last updated: 
                <DisplayTimestamp timestamp={thread.lastModified} />
              </div>
              <div className="v2-type-body2 opa-60">
                {/*showBody(canModify, thread.body)*/}
                <BodySection body={thread.body} canModify={canModify} thread={thread} changeBody={this.changeBody} />
              </div>
            </div>
            <div className="toggle-wrapper DN">
            </div>
            {/*<div className="feed-wrapper">
              <ItineraryList
              itineraries={this.props.feed} 
              authenticated={this.props.authenticated} 
              like={this.props.likeReview} 
              unLike={this.props.unLikeReview}
              deleteItinerary={this.props.showDeleteModal} />
            </div>*/}

          </div>

        </div>
      );
    }
  }
}

export default connect(mapStateToProps, Actions)(Thread);