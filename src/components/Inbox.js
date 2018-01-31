import React from 'react';
import { Link } from 'react-router';
import ProfilePic from './ProfilePic';
import { connect } from 'react-redux';
import * as Actions from '../actions';
import * as Constants from '../constants';
import ProxyImage from './ProxyImage';
import DisplayTimestamp from './DisplayTimestamp';

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
        to={`/${props.username}`}
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
          to={`/${props.username}`}
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
    this.props.getInbox(this.props.authenticated, null);
    this.props.sendMixpanelEvent(Constants.MIXPANEL_PAGE_VIEWED, { 'page name' : 'inbox'});
  }

  componentDidMount() {
    this.props.updateInboxCount(this.props.authenticated);
  }

  componentWillUnmount() {
    this.props.updateInboxCount(this.props.authenticated);
    this.props.unloadInbox(this.props.authenticated);
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
        <div className="loading-module flx flx-col flx-center-all v2-type-body3 fill--black">
          <div className="loader-wrapper flx flx-col flx-center-all fill--black">
            <div className="loader-bird"></div>
            <div className="loader">
              <div className="bar1"></div>
              <div className="bar2"></div>
              <div className="bar3"></div>
            </div>
            <div className="v2-type-body2 color--white">Loading inbox</div>
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
      <div className="page-common no-feed-toggle inbox-page flx flx-col flx-just-start">
        <div className="page-title-wrapper center-text">
          <div className="v2-type-page-header">Recent Activity</div>
          <div className="v2-type-body2 opa-60 mrgn-top-sm DN"></div>
        </div>
          {
            this.props.inbox.map(inboxItem => {
              // const isUser = this.props.currentUser &&
              //   follower.userId === this.props.currentUser.uid;
                return (
                  <Link className="flx flx-row flx-just-start brdr-bottom flx-align-center pdding-all-sm list-row w-100 w-max" key={inboxItem.key} to={inboxItem.link}>
                    <LeftSenderPic senderId={inboxItem.senderId} username={inboxItem.senderUsername} image={inboxItem.senderImage} />
                    <div className="flx flx-col mrgn-right-md">
                      <div className="v2-type-body1 font--alpha">
                        <strong><RenderUsername senderId={inboxItem.senderId} username={inboxItem.senderUsername} /></strong>
                        {inboxItem.message}<Link to={inboxItem.link}><div className="color--primary inline">{inboxItem.reviewTitle}</div></Link>
                         <div className="itinerary__cover__timestamp font--alpha"><DisplayTimestamp timestamp={inboxItem.lastModified} /></div>
                      </div>
                    </div>
                    <div className="feed-pic-wrapper mrgn-right-md flx-item-right"><RightPic link={inboxItem.link} image={inboxItem.reviewImage} /></div>

                  </Link>
                )
            })
          }
            <div className="w-100 flx flx-row flx-center-all mrgn-top-lg">
            {!this.props.endOfInbox && <button className="vb vb--sm vb--outline-none fill--none" onClick={this.onLoadMoreClick}>
              <div className="mobile-hide mrgn-right-sm">Load more messages</div>
              <i className="material-icons color--primary md-32">keyboard_arrow_right</i>
            </button>}
          </div>
        </div>
        

    );
  }
}

export default connect(mapStateToProps, Actions)(Inbox);