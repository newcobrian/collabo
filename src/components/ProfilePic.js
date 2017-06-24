import React from 'react';

const ProfilePic = props => {
  if (!props.src) {
    return null;
  }

  // const imgSrc = 'https://images.weserv.nl/?url=' + props.src.replace(/^https?\:\/\//i, "");
  const imgSrc = props.src.indexOf('http://') == 0 ? ("https://images.weserv.nl/?url=" 
  	+  encodeURIComponent(props.src.replace(/^https?\:\/\//i, ""))) : props.src;
  return (
    <img src={imgSrc} className={props.className} />
  );
}

export default ProfilePic;