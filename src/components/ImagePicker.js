import React from 'react';
import ProxyImage from './ProxyImage';

const ImagePicker = props => {
  if (props.images && props.images.length > 0) {
    let index = Math.floor(Math.random() * (props.images.length-1));
    return (
      <ProxyImage src={props.images[index]} className="center-img" />
    )
  }
  else {
    return (
    <img className="center-img" src="../img/views.ramen.temp.png"/>
    )
  }
}

export default ImagePicker;