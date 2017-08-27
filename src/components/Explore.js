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
    this.props.sendMixpanelEvent('Explore page loaded');
  }

  componentWillUnmount() {
    this.props.unwatchAllUsers(this.props.authenticated);
  }

  render() {
    const users = Selectors.getAllUsers(this.props.usersData, this.props.isFollowingData);

    const searchInputCallback = result => {
      if (result.text) {
        browserHistory.push('/' + result.text);
      }
    }
    
    return (
      <div className="flx flx-col page-common follow-page flx-just-start w-100">
        <div className="page-title-wrapper center-text flx flx-col flx-align-center w-100">
          <div className="v2-type-page-header">Travelers</div>
          <div className="v2-type-body2 opa-60">Follow people to see them in Explore get updates on their guides.</div>
          <div className="search-wrapper">
            <i className="search-icon material-icons color--primary md-32 color--primary">search</i>
            <FirebaseSearchInput
              name="searchInput"
              callback={searchInputCallback}
              placeholder="Search for people on Views"
              type={Constants.PEOPLE_SEARCH}
              className="input--search input--underline v2-type-body3" />
          </div>
        </div>


          <div className="flx flx-row flx-just-center flx-align-start flx-wrap w-100">
            {
              users.map(user => {
                const isUser = this.props.authenticated &&
                  user.userId === this.props.authenticated;

                  return (
                    <div className="flx flx-row w-100 flx-just-start flx-align-center ta-center pdding-all-md brdr-bottom" key={user.userId}>
                      <Link
                        to={`/${user.username}`}
                        className="mrgn-right-md">
                        <div className="">
                          <ProfilePic src={user.image} className="user-image center-img" />
                        </div>
                      </Link>

                      <div>
                        <Link
                            to={`/${user.username}`}
                            className="color--black ">
                            {user.username}
                        </Link>
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