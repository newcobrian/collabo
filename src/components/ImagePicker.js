import React from 'react';
import { connect } from 'react-redux';
import * as Actions from '../actions'
import { EDITOR_PAGE } from '../actions'

const mapStateToProps = state => ({
  authenticated: state.common.authenticated
});

const IMAGE_WIDTH = 400
const IMAGE_HEIGHT = 200

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
      var url = images[0].url ? images[0].url : (images[0].preview ? images[0].preview : null)

      console.log(url)
      
      if (url) {
        if (url.indexOf('https://firebasestorage.googleapis.com') != -1) {
          url = decodeURIComponent(url)
          var withoutParams = url.split('?')[0]
          var bits = withoutParams.split('/')
          var key = bits[bits.length-1]
          var width = this.props['max-w'] ? this.props['max-w'] : IMAGE_WIDTH
          var height = this.props.h ? this.props.h : IMAGE_HEIGHT
          
          url = 'https://myviews.imgix.net/images/' + key + '?fit=crop&h=' + height + '&max-w=' + width
        }  
        
        return (
          <div className="default-bg">
            <img src={url} className="center-img header-height" onClick={this.handleClick} />
          </div>
        )        
      }
      
      return null;
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
          <img className="center-img" src="/img/cover__default.png"/>
      </div>
      )
    }
  }
}

export default connect(mapStateToProps, Actions)(ImagePicker);