import React from 'react';
import { connect } from 'react-redux';
import Lightbox from 'react-image-lightbox';
import * as Actions from '../actions'

const mapStateToProps = state => ({
  authenticated: state.common.authenticated
});

class ImagePicker extends React.Component {
  constructor() {
    super();

    this.handleClick = ev => {
      ev.preventDefault();
      this.props.openLightbox(this.props.images);
    }
  }

  render() {
    let images = this.props.images;

    if (images && images.length > 0) {
      const imgSrc = images[0].indexOf('http://') == 0 ? ("https://images.weserv.nl/?url=" 
      +  encodeURIComponent(images[0].replace(/^https?\:\/\//i, ""))) : images[0];
      // let index = Math.floor(Math.random() * (props.images.length-1));

        return (
           <img src={imgSrc} className="center-img" onClick={this.handleClick} />
        )
    }
    else {
      return (
      <img className="center-img" src="../img/views.ramen.temp.png"/>
      )
    }
  }
}

export default connect(mapStateToProps, Actions)(ImagePicker);