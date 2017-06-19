import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import * as Actions from '../actions';
import ProxyImage from './ProxyImage';

const RightPic = props => {
  if (props.image) {
    return (
      <Link
      to={props.link}
      className="comment-author">
        <div className="item-photo center-img">
          <ProxyImage src={props.image} className="comment-author-img" />
        </div>
      </Link>
    )
  }
  else return null;
}

const LeftSenderPic = props => {
  if (props.senderId) {
    return (
      <div className="">
        <Link
        to={`${props.username}`}
        className="comment-author">
          <div className="reviewer-photo center-img">
            <ProxyImage src={props.image} className="comment-author-img" />
          </div>
        </Link>
      </div>
    )
  }
  else {
    return (
      <div className="">
       <div className="reviewer-photo center-img">
        <img src="../img/someone_temp.png"/>
       </div>
      </div>
    )
  }
  return null;
}

const RenderUsername = props => {
  if (props.senderId) {
    return (
      <Link
          to={`${props.username}`}
          className="comment-author">
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
    this.props.sendMixpanelEvent('Inbox page loaded');
  }

  componentWillUnmount() {
    this.props.updateInboxCount(this.props.authenticated);
    this.props.unloadInbox(this.props.authenticated);
  }

  render() {
	  if (!this.props.inbox) {
      return (
        <div className="article-preview">Loading...</div>
      );
    }
    if (this.props.inbox.length === 0) {
      return (
        <div className="article-preview">
          You have no messages in your inbox.
        </div>
      );
    }

    return (
      <div className="page-common no-feed-toggle inbox-page">
        <div className="page-title-wrapper center-text">
          <div className="v2-type-h2 subtitle">Stuff people do to you is here 👋</div>
         </div>
          {
            this.props.inbox.map(inboxItem => {
              // const isUser = this.props.currentUser &&
              //   follower.userId === this.props.currentUser.uid;
                return (
                  <div className="roow roow-row mrgn-bottom-sm pdding-all-sm list-row default-card-white bx-shadow" key={inboxItem.key}>
                    <LeftSenderPic senderId={inboxItem.senderId} username={inboxItem.senderUsername} image={inboxItem.senderImage} />
                    <div className="roow roow-col-left">
                      <div className="v2-type-body1">
                        <RenderUsername senderId={inboxItem.senderId} username={inboxItem.senderUsername} />
                        {inboxItem.message} <Link to={inboxItem.link}>{inboxItem.reviewTitle}</Link>
                      </div>
                    </div>
                    <div className="flex-item-right">
                      <RightPic link={inboxItem.link} image={inboxItem.reviewImage} />
                    </div>
                    
                  </div>
                )
            })
          }
        </div>

    );
  }
}

export default connect(mapStateToProps, Actions)(Inbox);