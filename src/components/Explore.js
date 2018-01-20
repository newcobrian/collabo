import React from 'react';
import { connect } from 'react-redux';
import { Link, browserHistory } from 'react-router';
import * as Actions from '../actions'; 
import * as Constants from '../constants';
import ProfilePic from './ProfilePic';
import FollowUserButton from './FollowUserButton';
import * as Selectors from '../selectors/exploreSelectors';
import FirebaseSearchInput from './FirebaseSearchInput';

const mapStateToProps = state => ({
  ...state.explore,
  authenticated: state.common.authenticated
});



class Explore extends React.Component {


  componentWillMount() {
    this.props.watchAllUsers(this.props.authenticated, Constants.EXPLORE_PAGE)
    this.props.sendMixpanelEvent(Constants.MIXPANEL_PAGE_VIEWED, { 'page name' : 'explore'});
  }

  componentWillUnmount() {
    this.props.unwatchAllUsers(this.props.authenticated);
    if (!this.props.authenticated) {
      this.props.setAuthRedirect(this.props.location.pathname);
    }
  }

  render() {
    const users = Selectors.getAllUsers(this.props.usersData, this.props.isFollowingData);

    const searchInputCallback = result => {
      if (result.text) {
        browserHistory.push('/' + result.text);
      }
    }
    if (this.props.user) {
      return (
        <div className="loading-module flx flx-col flx-center-all v2-type-body3 fill--black">
          <div className="loader-wrapper flx flx-col flx-center-all fill--black">
            <div className="loader-bird"></div>
            <div className="loader">
              <div className="bar1"></div>
              <div className="bar2"></div>
              <div className="bar3"></div>
            </div>
            <div className="v2-type-body2 color--white">Loading people</div>
          </div>
        </div>
      );
    }
    
    return (
      <div className="flx flx-col page-common follow-page page-people flx-align-center flx-just-start w-100">
          
        <div className="search-wrapper-wrapper w-100 flx flx-row flx-m-col flx-align-center brdr-bottom">
          <div className="search-wrapper page-top-search short-width-search w-100 flx flx-row flx-align-center flx-hold">
            <i className="search-icon material-icons color--black md-32">search</i>
            <FirebaseSearchInput
              name="searchInput"
              callback={searchInputCallback}
              placeholder="Search for people on Views"
              type={Constants.PEOPLE_SEARCH}
              className="input--search fill--black color--white input--underline v2-type-body3" />
            </div>
          </div>


          <div className="people-list flx flx-row flx-just-center flx-align-start flx-wrap w-100">
            {
              users.map(user => {
                const isUser = this.props.authenticated &&
                  user.userId === this.props.authenticated;

                  return (
                    <div className="flx flx-row w-100 flx-just-start flx-align-center ta-left pdding-left-md pdding-right-md pdding-top-sm pdding-bottom-sm brdr-bottom list-row w-100 w-max" key={user.userId}>
                      <Link
                        to={`/${user.username}`}
                        className="mrgn-right-md">
                          <ProfilePic src={user.image} className="center-img" />
                      </Link>
                      <div className="flx flx-col">
                        <Link
                            to={`/${user.username}`}
                            className="color--primary v2-type-body1">
                            {user.username}
                        </Link>
                        <div className="v2-type-body1 font--beta mrgn-right-sm">
                          {user.bio}
                        </div>
                      </div>
                      <div className="flx-item-right">
                        <FollowUserButton
                          authenticated={this.props.authenticated}
                          isUser={isUser}
                          user={user}
                          follow={this.props.followUser}
                          unfollow={this.props.unfollowUser}
                          isFollowing={user.isFollowing}
                          className=""
                          />
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