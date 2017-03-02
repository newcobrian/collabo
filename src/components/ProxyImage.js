import React from 'react';

const ProxyImage = props => {
  if (!props.src) {
    return null;
  }

  const imgSrc = 'https://images.weserv.nl/?url=' + props.src.replace(/^https?\:\/\//i, "");
  return (
    <img src={imgSrc} />
  );
}

export default ProxyImage;