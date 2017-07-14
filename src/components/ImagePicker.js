import React from 'react';
import { connect } from 'react-redux';
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
      if (images[0].url) {
        const imgSrc = images[0].url.indexOf('http://') == 0 ? ("https://images.weserv.nl/?url=" 
        +  encodeURIComponent(images[0].url.replace(/^https?\:\/\//i, ""))) : images[0].url;

        return (
             <img src={imgSrc} className="center-img cover-height" onClick={this.handleClick} />
          )
      }
      // else if ((typeof images[0] === 'string' || images[0] instanceof String)) {
      //   const imgSrc = images[0].indexOf('http://') == 0 ? ("https://images.weserv.nl/?url=" 
      //   +  encodeURIComponent(images[0].replace(/^https?\:\/\//i, ""))) : images[0];
      //   // let index = Math.floor(Math.random() * (props.images.length-1));

      //     return (
      //        <img src={imgSrc} className="center-img cover-height" onClick={this.handleClick} />
      //     )
      // }
      else if (images[0].preview) {
        return (
          <img src={images[0].preview} className="center-img cover-height" onClick={this.handleClick} />
          )
      }
      else return null;
    }
    else if (this.props.source === EDITOR_PAGE) {
      return (
        <div className="default-bg--white flx flx-center-all">
          <div className="v2-type-body3 ta-center opa-20">
          No<br/>
          Photo
          </div>
          <img className="DN" src="/img/profile_temp.png"/>
      </div>
      )
    }
    else {
      return (
        <div className="default-bg">
          <img className="center-img cover-height" src="/img/cover__default.png"/>
      </div>
      )
    }
  }
}

export default connect(mapStateToProps, Actions)(ImagePicker);