import React from 'react';

const ProfilePic = props => {
  if (!props.src) {
    return (
    	<div className="default-profile-wrapper">
    	 	<img src="../img/user_temp.png" className="center-img"/>
    	</div>
    	);
  }

  // const imgSrc = 'https://images.weserv.nl/?url=' + props.src.replace(/^https?\:\/\//i, "");
  const imgSrc = props.src.indexOf('http://') == 0 ? ("https://images.weserv.nl/?url=" 
  	+  encodeURIComponent(props.src.replace(/^https?\:\/\//i, ""))) : props.src;
  return (
    <div className="user-photo-wrapper">
    <img src={imgSrc} className={props.className} />
    </div>
  );
}

export default ProfilePic;