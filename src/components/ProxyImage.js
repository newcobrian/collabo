import React from 'react';

const ProxyImage = props => {
  if (!props.src) {
    return null;
  }

  // const imgSrc = 'https://images.weserv.nl/?url=' + props.src.replace(/^https?\:\/\//i, "");
  // https://myviews.imgix.net/images/000oI4x85uHmmQZ?fit=crop&h=200&max-w=200
  // vs "https://firebasestorage.googleapis.com/v0/b/views-18a9f.appspot.com/o/images%2FOUpGACDsYmcvIHm?alt=media&token=fb3c148f-2016-41cf-aa81-23d5a2cccd9c"
  // decode "https://firebasestorage.googleapis.com/v0/b/views-18a9f.appspot.com/o/images/OUpGACDsYmcvIHm?alt=media&token=fb3c148f-2016-41cf-aa81-23d5a2cccd9c"
  var url = props.src

  // console.log(url)
  
  if (url.indexOf('https://firebasestorage.googleapis.com') != -1) {
    url = decodeURIComponent(url)
    var withoutParams = url.split('?')[0]
    var bits = withoutParams.split('/')
    var key = bits[bits.length-1]
    
    url = 'https://myviews.imgix.net/images/' + key + '?fit=crop&h=200&max-w=200'
  }
  
  return (
    <img src={url} className={props.className} />
  );
}

export default ProxyImage;