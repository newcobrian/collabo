import React from 'react';
import { Link } from 'react-router';
import ProfilePic from './ProfilePic';
import { connect } from 'react-redux';
import * as Actions from '../actions';
import * as Constants from '../constants';
import ProxyImage from './ProxyImage';
import DisplayTimestamp from './DisplayTimestamp';
import ProjectList from './ProjectList';
import OrgHeader from './OrgHeader';


const RightPic = props => {
  if (props.image) {
    return (
      <Link
      to={props.link}
      className="">
        <div className="bx-shadow bg-loading">
          <ProxyImage src={props.image} className="image--basic center-img" />
        </div>
      </Link>
    )
  }
  else return null;
}

const LeftSenderPic = props => {
  if (props.senderId && props.image) {
    return (
      <div className="mrgn-left-sm mrgn-right-md">
        <Link
        to={`${props.orgName}/user/${props.username}`}
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
  return null;
} 

const RenderUsername = props => {
  if (props.senderId) {
    return (
      <Link
          to={`${props.orgName}/user/${props.username}`}
          className="">
          {props.username}
      </Link>
    )
  }
  return null;
}

const mapStateToProps = state => ({
  ...state.inbox,
  authenticated: state.common.authenticated
});

class Inbox extends React.Component {
  componentWillMount() {
    this.props.loadOrg(this.props.authenticated, this.props.params.orgname, Constants.INBOX_PAGE);
    this.props.loadProjectList(this.props.authenticated, this.props.params.orgname, Constants.INBOX_PAGE)
    this.props.loadThreadCounts(this.props.authenticated, this.props.params.orgname)
    this.props.loadOrgList(this.props.authenticated, Constants.INBOX_PAGE)
    this.props.getInbox(this.props.authenticated, null);
    this.props.sendMixpanelEvent(Constants.MIXPANEL_PAGE_VIEWED, { 'page name' : 'inbox'});
  }

  componentDidMount() {
    this.props.updateInboxCount(this.props.authenticated);
  }

  componentWillUnmount() {
    this.props.updateInboxCount(this.props.authenticated);
    this.props.unloadInbox(this.props.authenticated);
    this.props.unloadOrgList(this.props.authenticated, Constants.INBOX_PAGE)
    this.props.unloadThreadCounts(this.props.authenticated, this.props.params.orgname)
    this.props.unloadProjectList(this.props.authenticated, this.props.params.orgname, Constants.INBOX_PAGE)
    this.props.unloadOrg(Constants.INBOX_PAGE);
    if (!this.props.authenticated) {
      this.props.setAuthRedirect(this.props.location.pathname);
    }
  }

  onLoadMoreClick = ev => {
    ev.preventDefault()
    this.props.getInbox(this.props.authenticated, this.props.dateIndex)
  }

  render() {
	  if (!this.props.inbox) {
      return (
        <div className="loading-module flx flx-col flx-center-all v2-type-body3 fill--primary">
          <div className="loader-wrapper flx flx-col flx-center-all">
            <div className="v2-type-body2 color--white">Loading Activity</div>
          </div>
        </div>
      );
    }
    if (this.props.inbox.length === 0) {
      return (
        <div className="loading-module flx flx-col flx-center-all v2-type-body3">
          <div>You don't have any messages from anyone yet</div>
          <div>Go explore the site and maybe someone will find you interesting...</div>
        </div>
      );
    }
    return (
      <div className="page-common flx flx-col flx-center-all ">
        <div className="project-header text-left flx flx-col flx-align-start w-100">
          <OrgHeader />
          {/* HEADER START */}
          <div className="co-type-h1 mrgn-top-sm mrgn-left-md">Activity</div>
        </div>
        {/* CONTAINER - START */}
          <div className="content-wrapper header-push flx flx-col ta-left">


            {
              this.props.inbox.map(inboxItem => {
                // const isUser = this.props.currentUser &&
                //   follower.userId === this.props.currentUser.uid;
                  return (
                    <Link className="flx flx-row flx-just-start brdr-bottom flx-align-center pdding-all-sm list-row" key={inboxItem.key} to={inboxItem.link}>
                      <LeftSenderPic 
                        senderId={inboxItem.senderId} 
                        username={inboxItem.senderUsername} 
                        image={inboxItem.senderImage}
                        orgName={this.props.params.orgname} />
                      <div className="flx flx-col mrgn-right-md">
                        <div className="v2-type-body1 font--alpha">
                          <strong><RenderUsername senderId={inboxItem.senderId} username={inboxItem.senderUsername} orgName={this.props.params.orgname} /></strong>
                          {inboxItem.message}<Link to={inboxItem.link}><div className="color--primary inline">{inboxItem.reviewTitle}</div></Link>
                           <div className="thread-timestamp font--alpha"><DisplayTimestamp timestamp={inboxItem.lastModified} /></div>
                        </div>
                      </div>
                    </Link>
                  )
              })
            }
              <div className="w-100 flx flx-row flx-center-all mrgn-top-lg">
              {!this.props.endOfInbox && <button className="vb vb--sm vb--outline-none fill--none" onClick={this.onLoadMoreClick}>
                <div className="mobile-hide mrgn-right-sm">Load more messages</div>
                <i className="material-icons color--primary md-32 DN">keyboard_arrow_right</i>
              </button>}
            </div>
          </div>
        </div>
        

    );
  }
}

export default connect(mapStateToProps, Actions)(Inbox);