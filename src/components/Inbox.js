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
  if (props.senderId) {
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
      <div className="mrgn-left-sm mrgn-right-md">
        <img className="center-img" src="../img/someone_temp.png"/>
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
    this.props.getInbox(this.props.authenticated);
    this.props.sendMixpanelEvent(Constants.MIXPANEL_PAGE_VIEWED, { 'page name' : 'inbox'});
  }

  componentWillUnmount() {
    this.props.updateInboxCount(this.props.authenticated);
    this.props.unloadInbox(this.props.authenticated);
  }

  render() {
	  if (!this.props.inbox) {
      return (
        <div className="loading-module flx flx-col flx-center-all v2-type-body3 fill--black">
          <div className="earth-graphic w-100">  
            <img className="center-img" src="../img/globe01.gif"/>
          </div>
          <div>Loading inbox...</div>
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
                      <div className="v2-type-body1">
                        <strong><RenderUsername senderId={inboxItem.senderId} username={inboxItem.senderUsername} /></strong>
                        {inboxItem.message}<Link to={inboxItem.link}><div className="color--primary inline">{inboxItem.reviewTitle}</div></Link>
                         <div className="itinerary__cover__timestamp"><DisplayTimestamp timestamp={inboxItem.lastModified} /></div>
                      </div>
                    </div>
                    <div className="feed-pic-wrapper mrgn-right-md flx-item-right"><RightPic link={inboxItem.link} image={inboxItem.reviewImage} /></div>

                  </Link>
                )
            })
          }
        </div>

    );
  }
}

export default connect(mapStateToProps, Actions)(Inbox);