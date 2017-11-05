import React from 'react';

const ProfilePic = props => {
  if (!props.src) {
    return (
    	<div className="default-profile-wrapper">
    	 	<img src="../img/user_temp.png" className="center-img"/>
    	</div>
    	);
  }

  var url = props.src

  console.log(url)
  
  if (url.indexOf('https://firebasestorage.googleapis.com') != -1) {
    url = decodeURIComponent(url)
    var withoutParams = url.split('?')[0]
    var bits = withoutParams.split('/')
    var key = bits[bits.length-1]
    
    url = 'https://myviews.imgix.net/images/' + key + '?fit=crop&h=64&max-w=64'
  }
  
  return (
    <div className="user-photo-wrapper flx-hold invert">
      <img src={url} className={props.className} />
    </div>
  );
}

export default ProfilePic;