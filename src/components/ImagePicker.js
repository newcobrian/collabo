import React from 'react';
// import Lightbox from 'react-image-lightbox';

const ImagePicker = props => {
  const handleClick = ev => {
    ev.preventDefault();
  }

  if (props.images && props.images.length > 0) {
    const imgSrc = props.images[0].indexOf('http://') == 0 ? ("https://images.weserv.nl/?url=" 
    +  encodeURIComponent(props.images[0].replace(/^https?\:\/\//i, ""))) : props.images[0];
    // let index = Math.floor(Math.random() * (props.images.length-1));
    return (
       <img src={imgSrc} className="center-img" onClick={handleClick} />
    )
  }
  else {
    return (
    <img className="center-img" src="../img/views.ramen.temp.png"/>
    )
  }
}

export default ImagePicker;