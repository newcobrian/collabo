import React, {Component} from 'react';
import { AutoComplete } from 'material-ui';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import * as Constants from '../constants'
import 'whatwg-fetch';

class FirebaseSearchInput extends Component {
  constructor(props) {
    super(props);
    this.onUpdateInput = this.onUpdateInput.bind(this);
    this.onNewRequest = this.onNewRequest.bind(this);
    this.state = {
      dataSource : [],
      inputValue : '',
      searchTimer: undefined
    }
  }

  onUpdateInput(inputValue) {

    const self = this;
    this.setState({
      inputValue: inputValue
    }, function() {
      clearTimeout(this.state.searchTimer);
      this.state.searchTimer = setTimeout(function () { 
        self.performSearch();
      }, 200)
    })
  }

  onNewRequest(chosenRequest) {
    this.props.callback(chosenRequest);
  }

  performSearch() {
    const self = this,
      url = Constants.SUBJECT_SEARCH_URL + this.state.inputValue;

    if(this.state.inputValue !== '') {
      fetch(url).then(response => response.json())
        .then(json => {
        
        let searchResults;
        let retrievedSearchTerms = [];

        if(json.error) return json.error;

        searchResults = json.results;

        searchResults.map(function(result) {
          let searchObject = {};
          switch (result._service) {
            case '4sq':
              break;
              if (result.name && result.id) {
                searchObject.text = result.name;
                searchObject.value = result.name;
                searchObject.id = '4sq:' + result.id;
                if (result.url) searchObject.url = result.url;
                // if (result.categories && result.categories[0] && result.categories[0].icon) searchObject.image = result.categories[0].icon.prefix + result.categories[0].icon.suffix;
                if (result.location && result.location.formattedAddress) searchObject.description = result.location.formattedAddress.join(' ');
                if (result.location && result.location.address + result.location.city) searchObject.text += ' - ' + result.location.address + ', ' + result.location.city;
              }
              break;
            case 'spotify':
              break;
              if (result.name && result.id) {
                searchObject.text = result.name;
                searchObject.value = result.name;
                searchObject.id = 'spotify:' + result.id;
                if (result.external_urls && result.external_urls.spotify) searchObject.url = result.external_urls.spotify;
                if (result.type) {
                  switch (result.type) {
                    case 'album':
                      if (result.artists && result.artists[0] && result.artists[0].name) {
                        searchObject.text += ' - by ' + result.artists[0].name;
                        searchObject.description = 'Album by ' + result.artists[0].name;
                      }
                      if (result.images && result.images[0] && result.images[0].url) searchObject.image = result.images[0].url;
                      break;
                    case 'artist':
                      if (result.genres) searchObject.description = result.genres.join(', ');
                      if (result.images && result.images[0] && result.images[0].url) searchObject.image = result.images[0].url;
                      searchObject.text += ' (artist on Spotify)';
                      break;
                    case 'track':
                      if (result.album && result.album.images && result.album.images[0] && result.album.images[0].url) {
                        searchObject.image = result.album.images[0].url;
                      }
                      if (result.artists && result.artists[0] && result.artists[0].name) {
                        searchObject.description = 'by ' + result.artists[0].name;
                        searchObject.text += ' - by ' + result.artists[0].name;
                      }
                      if (result.album && result.album.name) searchObject.description += ' from the album ' + result.album.name;
                      break;
                  }
                }
              }
              break;
            case 'tmdb':
              if ((result.title || result.name) && result.id) {
                searchObject.text = result.title ? result.title : result.name;
                searchObject.text += ' (imdb)';
                searchObject.value = result.title ? result.title : result.name;
                searchObject.id = 'tmdb:' + result.id;
                if (result.url) searchObject.url = result.url;
                if (result.overview) searchObject.description = result.overview;
                
                if (result.poster_path) {
                  searchObject.image = Constants.TMDB_IMAGES_PATH + result.poster_path;
                } else if (result.backdrop_path) {
                  searchObject.image = Constants.TMDB_IMAGES_PATH + result.backdrop_path;
                }
              }
              break;
            case 'amazon':
              // if (result.title) {
              //   return { text: result.title, value: 'boo' };
              // }
              break;
          }
          if (searchObject.text) {
            searchObject._service = result._service;
            retrievedSearchTerms.push(searchObject);
          }
        });

        self.setState({
          dataSource: retrievedSearchTerms
        });
      });
    }
  }

  render() {
    return <MuiThemeProvider name={this.props.name} muiTheme={getMuiTheme()}>
      <AutoComplete
        filter={function filter(searchText, key) {
          return key.toLowerCase().includes(searchText.toLowerCase());
        }}
        fullWidth={true}
        hintText='Search for a product'
        dataSource={this.state.dataSource}
        onUpdateInput={this.onUpdateInput} 
        onNewRequest={this.onNewRequest}
        style={{
          backgroundColor: '#ffffff',
        }}
     />
      </MuiThemeProvider>
  }
}

export default FirebaseSearchInput;