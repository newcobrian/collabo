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
         Edit Profile
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
        <div className="user-info flx flx-col flx-align-center w-100">

          <div className="profile-info flx flx-col flx-align-center mrgn-bottom-xs">
            <div className="flx flx-col flx-align-center">
              <ProfilePic src={profile.image} className="center-img" />
            </div>

            <div className="co-type-page-title mrgn-top-sm">{profile.username}</div>

            <div className="user-bio ta-left flx flx-col flx-align-center mrgn-top-sm DN">


              <div className="co-type-profile-status mrgn-top-xs mrgn-bottom-xs ta-center">
                Coding up Prototype stage DOM and style for all pages, then testing more visual styles
                {/*{profile.bio}*/}
              </div>
              
              <div className="thread-timestamp">
                Status updated 2 hours ago
              </div>
              

            </div>
          </div>
          <div className="user-action flx flx-col flx-just-start pdding-left-md pdding-right-md w-100 mobile-show">
            
            {/*<FollowUserButton
            authenticated={props.authenticated}
            isUser={isUser}
            user={profile}
            follow={props.follow}
            unfollow={props.unfollow}
            />*/}
          </div>
        </div>
    )
}

export default ProfileInfo;