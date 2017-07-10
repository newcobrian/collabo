import React from 'react';
import { connect } from 'react-redux';
import Lightbox from 'react-image-lightbox';
import * as Actions from '../actions';

const mapStateToProps = state => ({
  ...state.lightboxComponent,
  authenticated: state.common.authenticated
});

class LightboxComponent extends React.Component {
  constructor() {
    super();
  }

  render() {
    let images = this.props.images;
    let photoIndex = this.props.photoIndex;
    // let deleteButton = isUser ? [<button className="vb" type="button" onClick={console.log('hihi')}><img className="center-img" src="../img/icon.add--white.png"/> Add Tip</button>] : [];
    // toolbarButtons={buttons}
    
    if (this.props.showLightbox) {
      return (
          <Lightbox
            mainSrc={images[photoIndex]}
            nextSrc={images[(photoIndex + 1) % images.length]}
            prevSrc={images[(photoIndex + images.length - 1) % images.length]}
            onCloseRequest={() => this.props.closeLightbox()}
            onMovePrevRequest={() => this.props.prevLightbox((photoIndex + images.length - 1) % images.length)}
            onMoveNextRequest={() => this.props.nextLightbox((photoIndex + 1) % images.length)}
          />
      )
    }
    else return null;
  }
}

export default connect(mapStateToProps, Actions)(LightboxComponent);