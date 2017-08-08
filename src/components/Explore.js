import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import * as Actions from '../actions';
import * as Constants from '../constants';
import ProfilePic from './ProfilePic';
import FollowUserButton from './FollowUserButton';
import * as Selectors from '../selectors/exploreSelectors';

const mapStateToProps = state => ({
  ...state.explore,
  authenticated: state.common.authenticated
});

class Explore extends React.Component {
  componentWillMount() {
    this.props.watchAllUsers(this.props.authenticated, Constants.EXPLORE_PAGE)
    this.props.sendMixpanelEvent('Explore page loaded');
  }

  componentWillUnmount() {
    this.props.unwatchAllUsers(this.props.authenticated);
  }

  render() {
    const users = Selectors.getAllUsers(this.props.usersData, this.props.isFollowingData);
    
    return (
      <div className="flx flx-col page-common follow-page flx-just-start w-100">
        <div className="page-title-wrapper center-text">
          <div className="v2-type-page-header">Travelers</div>
          <div className="v2-type-body2 opa-60">All the special beta users right now</div>
        </div>
        <div className="flx flx-row flx-just-center flx-align-start flx-wrap w-100 pdding-top-md">
          {
            users.map(user => {
              const isUser = this.props.authenticated &&
                user.userId === this.props.authenticated;

                return (
                  <div className="flx flx-col flx-center-all ta-center pdding-all-md" key={user.userId}>
                    <Link
                      to={`/${user.username}`}
                      className="">
                      <div className="mrgn-bottom-sm">
                        <ProfilePic src={user.image} className="user-image center-img" />
                      </div>
                    </Link>
                    <div className="flx flx-col flx-align-center">
                    <div>
                      <Link
                          to={`/${user.username}`}
                          className="color--black mrgn-bottom-sm">
                          {user.username}
                      </Link>
                    </div>
                    <div>
                      <FollowUserButton
                        authenticated={this.props.authenticated}
                        isUser={isUser}
                        user={user}
                        follow={this.props.followUser}
                        unfollow={this.props.unfollowUser}
                        isFollowing={user.isFollowing}
                        />
                    </div>
                  </div>
                </div>
              )
            })
          }
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, Actions)(Explore);