import React from 'react';
import FollowUserButton from './FollowUserButton'
import ProfilePic from './ProfilePic';
import { Link } from 'react-router';

const EditProfileSettings = props => {
  if (props.isUser) {
    return (
      <Link
        to="settings"
        className="v-button v-button--light vb--no-outline vb-sm">
         {/*<i className="ion-gear-a"></i>*/}Edit Profile
      </Link>
    );
  }
  return null;
};

const ProfileInfo = props => {
    if (!props.profile) {
      return null;
    }

    let profile = props.profile;
    const isUser = props.authenticated &&
      props.profile.userId === props.authenticated;

    return (
        <div className="user-info w-100 w-max">

          <div className="profile-info flx flx-row flx-align-start flx-just-start w-100 w-max">
            <div className="flx flx-col flx-align-center mrgn-right-md">
              <ProfilePic src={profile.image} className="user-img" />
            </div>
            <div className="user-bio ta-left flx flx-col flx-align-start">
              <div className="flx flx-row flx-just-start flx-align-center">
                <div className="user-name">{profile.username}</div>
              </div>
              <div>{profile.bio}</div>
              <div className="user-action flx flx-row-top">
                <EditProfileSettings isUser={isUser} />
                <FollowUserButton
                authenticated={props.authenticated}
                isUser={isUser}
                user={profile}
                follow={props.follow}
                unfollow={props.unfollow}
                />
              </div>
            </div>
              {/*}
              <div className="flx flx-row-left profile-followers-wrapper">
                <Link to={`followers/${profile.username}`}>
                  <div className="profile-data-module">{this.props.followerCount} followers</div>
                </Link>
                <Link to={`followings/${profile.username}`}>
                  <div className="profile-data-module">{this.props.followingCount} following</div>
                </Link>
              </div>
            */}
            </div>
          </div>
    )
}

export default ProfileInfo;