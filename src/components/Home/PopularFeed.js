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
  constructor() {
    super();

    this.onPrevPageClick = () => {
      let index = 0
      let score = this.props.itineraries[index].popularityScore ? this.props.itineraries[index].popularityScore : 0
      let key = this.props.itineraries[index].id;
      this.props.watchPopularFeed(this.props.authenticated, this.props.popularPage - 1, score, key)
    }

    this.onNextPageClick = () => {
      let index = this.props.itineraries.length - 1
      let score = this.props.itineraries[index].popularityScore ? this.props.itineraries[index].popularityScore : 0
      let key = this.props.itineraries[index].id;
      this.props.watchPopularFeed(this.props.authenticated, this.props.popularPage + 1, score, key)
    }
  }

  componentWillMount() {
    this.props.watchPopularFeed(this.props.authenticated, this.props.popularPage, null, null);
    this.props.sendMixpanelEvent(Constants.MIXPANEL_PAGE_VIEWED, { 'page name' : 'popular feed'});
  }

  componentWillUnmount() {
    this.props.unwatchPopularFeed(this.props.authenticated);
  }

  

  render() {
    const renderPagination = () => {
      if (this.props.itineraries && this.props.itineraries.length > 0) {        
        return (
          <div>
            {this.props.popularPage > 1 && <button onClick={this.onPrevPageClick}>Prev</button>}
            <button onClick={this.onNextPageClick}>Next</button>
          </div>
        )
      return null;
      }
    }

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
          <div className="search-detail-bar mobile-hide flx flx-row color--white flx-just-start flx-align-center ta-center pdding-left-md w-100 v2-type-body2 color--white">
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
         

          <div className="feed-toggle friend-popular-toggle flx flx-row flx-just-center w-100">
            <ul className="nav nav-pills outline-active flx flx-row">
              <li className="nav-item">
                <Link
                  className="nav-link"
                  to="/">
                  Friends
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link active"
                  to="/popular">
                  Popular
                </Link>
              </li>
            </ul>

          </div>

          <div className="w-100 w-max flx flx-row flx-just-center flx-self-end flx-align-center flx-wrap">
              { this.props.itineraries && this.props.itineraries.length > 0 && 
                this.props.itineraries.map(itinerary => {
                  return (
                    <ItineraryPreview itinerary={itinerary}
                      key={"popular" + itinerary.id}
                      authenticated={this.props.authenticated}
                      />
                   );
                  })
                
              }
          </div>

              {/*renderPagination() */}
          </div>


          <BackToTop /> 

        </div>
    );
  }
}

export default connect(mapStateToProps, Actions)(PopularFeed);