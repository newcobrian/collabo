import React from 'react';
import FollowUserButton from './FollowUserButton'
import ProfilePic from './ProfilePic';
import { Link } from 'react-router';

const EditProfileSettings = props => {
  if (props.isUser) {
    return (
      <Link
        to="/settings"
        className="vb vb--sm fill--primary mrgn-top-xs vb--mobile-full">
         <i className="material-icons mrgn-right-sm color--white md-18">mode_edit</i>Edit Profile
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
        <div className="user-info flx flx-col flx-just-start w-100 w-max">

          <div className="profile-info flx flx-row flx-just-start mrgn-bottom-xs">
            <div className="flx flx-col flx-align-center mrgn-right-md">
              <ProfilePic src={profile.image} className="user-img" />
            </div>
            <div className="user-bio ta-left flx flx-col flx-align-start mrgn-bottom-sm">
              <div className="flx flx-row flx-just-start flx-align-center">
                <div className="user-name">{profile.username}</div>
              </div>
              <div>{profile.bio}</div>
            </div>
          </div>
          <div className="user-action flx flx-col flx-just-start pdding-left-md pdding-right-md w-100">
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
    )
}

export default ProfileInfo;