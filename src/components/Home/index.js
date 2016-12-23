import Banner from './Banner';
import MainView from './MainView';
import React from 'react';
import Tags from './Tags';
import agent from '../../agent';
import { connect } from 'react-redux';
import Firebase from 'firebase';

const AUTH_ERROR = 'AUTH_ERROR';
const AUTH_USER = 'AUTH_USER';

const Promise = global.Promise;

const mapStateToProps = state => ({
  ...state.home,
  appName: state.common.appName,
  token: state.common.token
});

const mapDispatchToProps = dispatch => ({
  onClickTag: (tag, payload) =>
    dispatch({ type: 'APPLY_TAG_FILTER', tag, payload }),
  onLoad: (tab, payload) =>
    dispatch({ type: 'HOME_PAGE_LOADED', tab, payload }),
  onUnload: () =>
    dispatch({  type: 'HOME_PAGE_UNLOADED' })
});

class Home extends React.Component {
  componentWillMount() {
    // const tab = this.props.token ? 'feed' : 'all';
    // const articlesPromise = this.props.token ?
    //   agent.Articles.feed() :
    //   agent.Articles.all();

    // this.props.onLoad(tab, Promise.all([agent.Tags.getAll(), articlesPromise]));
  }

  componentWillUnmount() {
    this.props.onUnload();
  }

  render() {
    return (
      <div className="home-page">


          <div className="page-title-wrapper roow">
            <div className="text-page-title">Inbox</div>
            <div className="text-page-title not-selected">Discover</div>
            <div className="text-page-title not-selected">Search</div>
          </div>

          <div className="reviews-wrapper roow roow-left roow-col-left">
            <div className="subject-name-container">
                <div className="text-subject-name">Wind-up Bird Chronicles by Haruki Murakami</div>
                <div className="text-category shift-up-5">Book</div>
            </div>
            <div className="review-container roow roow-center roow-row-top">
              <div className="review-image-wrapper">
                <div className="subject-image">
                  <img src="http://2.bp.blogspot.com/-qKqiE5uJIvA/UZBNAvG2-kI/AAAAAAAAJQg/D3KGsQu96jo/s1600/093.JPG"/>
                </div>
              </div>
              <div className="review-data-container roow roow-col-right">
                <div className="review-data-module gray-border roow roow-col-left">
                  <div className="reviewer-name-container">
                    <div className="reviewer-name">
                      Kiko Mizuhara
                    </div>
                  </div>
                  <div className="photo-rating-module roow">
                      <div className="reviewer-photo"><img src="http://www.kpopmusic.com/wp-content/uploads/2014/12/tumblr_mk9ghdPCaW1rexlpko1_1280.jpg"/></div>
                      <div className="rating-container roow">
                          <div className="rating-graphic">0</div>
                      </div>
                  </div>
                  <div className="info">
                    <div className="subject-caption">
                      my fav murakami so far. a lot of buddhist allegories mixed in.
                    </div>
                    <div className="review-timestamp">
                      3 days ago
                    </div>
                  </div>
                </div>
                <div className="cta-box roow gray-border">
                  <i className="icoon ion-heart"></i>
                  <i className="icoon ion-android-bookmark"></i>
                  <i className="icoon ion-android-share"></i>
                </div>
            </div>{/**** E N D subject-info-box ***/}

       </div>
  </div>


            <div className="reviews-wrapper roow roow-left roow-col-left">
            <div className="subject-name-container">
                <div className="text-subject-name">Wind-up Bird Chronicles by Haruki Murakami</div>
                <div className="text-category shift-up-5">Book</div>
            </div>
            <div className="review-container roow roow-center roow-row-top">
              <div className="review-image-wrapper">
                <div className="subject-image">
                  <img src="http://2.bp.blogspot.com/-qKqiE5uJIvA/UZBNAvG2-kI/AAAAAAAAJQg/D3KGsQu96jo/s1600/093.JPG"/>
                </div>
              </div>
              <div className="review-data-container roow roow-col-right">
                <div className="review-data-module gray-border roow roow-col-left">
                  <div className="reviewer-name-container">
                    <div className="reviewer-name">
                      Kiko Mizuhara
                    </div>
                  </div>
                  <div className="photo-rating-module roow">
                      <div className="reviewer-photo"><img src="http://www.kpopmusic.com/wp-content/uploads/2014/12/tumblr_mk9ghdPCaW1rexlpko1_1280.jpg"/></div>
                      <div className="rating-container roow">
                          <div className="rating-graphic">0</div>
                      </div>
                  </div>
                  <div className="info">
                    <div className="subject-caption">
                      my fav murakami so far. a lot of buddhist allegories mixed in.
                    </div>
                    <div className="review-timestamp">
                      3 days ago
                    </div>
                  </div>
                </div>
                <div className="cta-box roow gray-border">
                  <i className="icoon ion-heart"></i>
                  <i className="icoon ion-android-bookmark"></i>
                  <i className="icoon ion-android-share"></i>
                </div>
            </div>{/**** E N D subject-info-box ***/}

       </div>
  </div>






      </div>


    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);