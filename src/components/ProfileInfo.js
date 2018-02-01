import React from 'react';
import FollowUserButton from './FollowUserButton'
import ProfilePic from './ProfilePic';
import { Link } from 'react-router';

const EditProfileSettings = props => {
  if (props.isUser) {
    return (
      <Link
        to="/settings"
        className="vb vb--sm vb--outline fill--white mrgn-top-xs color--black w-100 mrgn-right-sm mrgn-right-m-none">
         <i className="material-icons mrgn-right-sm color--black opa-60 md-18">mode_edit</i>Edit Profile
      </Link>
    );
  }
  return null;
};

const SignOutButton = props => {
  if (props.isUser) {
    return (
      <button
        className="vb vb--sm vb--outline fill--white mrgn-top-xs color--black w-100"
        onClick={props.signOut}>
        Log out
      </button>
    )
  }
  return null;
}

const ProfileInfo = props => {
    if (!props.profile) {
      return null;
    }

    let profile = props.profile;
    const isUser = props.authenticated &&
      props.profile.userId === props.authenticated;

    return (
        <div className="user-info flx flx-col flx-just-start">

          <div className="profile-info flx flx-row flx-just-start mrgn-bottom-xs">
            <div className="flx flx-col flx-align-center mrgn-right-md">
              <ProfilePic src={profile.image} className="user-img" />
            </div>
            <div className="user-bio ta-left flx flx-col flx-align-start mrgn-bottom-sm">
              <div className="flx flx-row flx-just-start flx-align-center">
                <div className="user-name">{profile.username}</div>
              </div>
              <div className="v2-type-body3 font--beta">{profile.bio}</div>
              <div className="user-action flx flx-row flx-just-start w-100 mobile-hide mrgn-top-sm flx-wrap">
                <EditProfileSettings isUser={isUser} />
                <SignOutButton isUser={isUser} signOut={props.signOut}/>
                <FollowUserButton
                authenticated={props.authenticated}
                isUser={isUser}
                user={profile}
                follow={props.follow}
                unfollow={props.unfollow}
                />
              </div>
            </div>
          </div>
          <div className="user-action flx flx-col flx-just-start pdding-left-md pdding-right-md w-100 mobile-show">
            <EditProfileSettings isUser={isUser} />
            <SignOutButton isUser={isUser} signOut={props.signOut}/>
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