import React from 'react';
import { connect } from 'react-redux';
import Lightbox from 'react-image-lightbox';
import * as Actions from '../actions'
import { EDITOR_PAGE } from '../actions'

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

           <img src={imgSrc} className="center-img cover-height" onClick={this.handleClick} />

        )
    }
    else if (this.props.source === EDITOR_PAGE) {
      return (
        <div className="default-bg">
          <img className="" src="../img/profile_temp.png"/>
      </div>
      )
    }
    else {
      return (
        <div className="default-bg">
          <img className="center-img cover-height DN" src="../img/cover_default.png"/>
      </div>
      )
    }
  }
}

export default connect(mapStateToProps, Actions)(ImagePicker);