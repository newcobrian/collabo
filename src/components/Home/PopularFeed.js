import { Home, mapStateToProps } from '/';
import React from 'react';
import { connect } from 'react-redux';
import * as Actions from '../../actions';
import * as Constants from '../../constants';
import { Link, browserHistory } from 'react-router';
import FirebaseSearchInput from '../FirebaseSearchInput';
import {BackToTop} from 'pui-react-back-to-top';
import ItineraryPreview from '../ItineraryPreview';

class PopularFeed extends Home {
  componentWillMount() {
    this.props.watchPopularFeed(this.props.authenticated);
    this.props.sendMixpanelEvent('Popular feed loaded');
  }

  componentWillUnmount() {
    this.props.unwatchPopularFeed(this.props.authenticated);
  }

  loadMoreClick() {
    console.log('loade more !')
  }

  render() {
    return (
      <div>
        {this.LoggedOutIntro(this.props.authenticated)}

        <div className="search-wrapper-wrapper w-100 flx flx-row flx-m-col flx-align-center">
          <div className="search-wrapper short-width-search page-top-search w-100 flx flx-row flx-align-center flx-hold">
            <i className="search-icon material-icons color--white md-32">search</i>
            <FirebaseSearchInput
              name="searchInput"
              callback={this.searchInputCallback}
              placeholder="Search any city or country"
              type={Constants.GEO_SEARCH}
              className="input--search fill--black color--white input--underline v2-type-body3" />
          </div>
          <div className="search-detail-bar flx flx-row color--white flx-just-start flx-align-center ta-center pdding-left-md w-100 v2-type-body2 color--white">
              <div className="label-big color--white flx-hold mrgn-right-lg opa-80">Top Cities:</div>
              
              <Link to="/places/ChIJ51cu8IcbXWARiRtXIothAS4" className="geo-type color--white opa-100">Tokyo</Link>
              <div className="middle-dot">&middot;</div>
              <Link to="/places/ChIJ5TCOcRaYpBIRCmZHTz37sEQ" className="geo-type color--white opa-100">Barcelona</Link>
              <div className="middle-dot">&middot;</div>
               <Link to="/places/ChIJmQrivHKsQjQR4MIK3c41aj8" className="geo-type color--white opa-100">Taipei</Link>
               <div className="middle-dot">&middot;</div>
              <Link to="/places/ChIJIQBpAG2ahYAR_6128GcTUEo" className="geo-type color--white opa-100">San Francisco</Link>
              <div className="middle-dot">&middot;</div>
              <Link to="/places/ChIJOwg_06VPwokRYv534QaPC8g" className="geo-type color--white opa-100">New York</Link>

          </div>
        </div>


        <div className={'home-page page-common fill--light-gray '}>

          <div className="featured-wrapper w-100 w-max flx flx-row flx-just-center flx-self-end flx-align-center flx-wrap">
            <div className="popular-box ">
              <div className="color--black section-header mrgn-bottom-md">Popular Guides</div>
                { 
                  this.props.itineraries && this.props.itineraries.length > 0 && 
                  this.props.itineraries.map(itinerary => {
                    return (
                      <ItineraryPreview itinerary={itinerary}
                        key={"popular" + itinerary.id}
                        authenticated={this.props.authenticated}
                        like={this.props.likeReview}
                        unLike={this.props.unLikeReview}
                        />
                     );
                    })
                }
              </div>
                <Link to="/explore" className="DN itinerary__cover cover--empty flx flx-col flx-center-all ta-center fill-success color--white">
                  <div className="v2-type-h1 pdding-bottom-sm color--black">
                    Follow other travelers
                  </div>
                  <div className="v2-type-body1 pdding-bottom-md color--black opa-50">
                    To see their newest guides here
                  </div>
                  <div className="vb fill--primary color--white">
                    Find travelers
                  </div>
                </Link>

                <Link to="/create" className="itinerary__cover cover--empty flx flx-col flx-center-all ta-center fill-success color--white">
             
                  <div className="v2-type-h1 pdding-bottom-lg color--black">
                    Make a travel guide
                  </div>
                  <div className="vb fill--success color--white">
                      <i className="material-icons md-32 color--white">add</i>
                  </div>
                </Link>
              </div>
              <BackToTop />
            </div>

            <div>
              <button onClick={this.onLoadMoreClick}>Load more</button>
            </div>

            <div className="DN footer fill--black color--white flx flx-col flx-center-all">
              <div className="homepage-logo mrgn-bottom-md">  
                <img className="center-img w-100" src="/img/logos/homepage-logo.png"/>
              </div>
              <div className="v2-type-intro color--white opa-70 mrgn-bottom-lg DN">
                Travel with the knowledge of your friends
              </div>
              <Link to="/register" className="DN vb vb--intro--register fill--primary color--white vb--wide">
                Sign up now
              </Link>
            </div>
          </div>



    );
  }
}

export default connect(mapStateToProps, Actions)(PopularFeed);