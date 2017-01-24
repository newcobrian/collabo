import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import Firebase from 'firebase';
import * as Actions from '../actions';
import * as Constants from '../constants';

const mapStateToProps = state => ({
  ...state.inbox,
  authenticated: state.common.authenticated
});

class Inbox extends React.Component {
  componentWillMount() {
    this.props.getInbox(this.props.authenticated);
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
      <div className="roow roow-col-left page-common follow-page">
        <div className="text-page-title">Inbox</div>
        {
          this.props.inbox.map(inboxItem => {
            // const isUser = this.props.currentUser &&
            //   follower.userId === this.props.currentUser.uid;
              return (
                <div className="roow roow-row list-row" key={inboxItem.key}>
                  <div className="">
                    <Link
                    to={`@${inboxItem.senderUsername}`}
                    className="comment-author">
                      <div className="reviewer-photo center-img">
                        <img src={inboxItem.senderImage} className="comment-author-img" />
                      </div>
                    </Link>
                  </div>
                  <div className="roow roow-col-left">
                    <div>
                      <Link
                          to={`@${inboxItem.senderUsername}`}
                          className="comment-author">
                          {inboxItem.senderUsername}
                      </Link>

                      {inboxItem.message} <Link to={inboxItem.link}>{inboxItem.reviewTitle}</Link>
                    </div>
                  </div>
                  <div className="">
                    <Link
                    to={inboxItem.link}
                    className="comment-author">
                      <div className="item-photo center-img">
                        <img src={inboxItem.reviewImage} className="comment-author-img" />
                      </div>
                    </Link>
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