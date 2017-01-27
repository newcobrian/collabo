import React, {Component} from 'react';
import { AutoComplete } from 'material-ui';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import 'whatwg-fetch';

const searchURL = 'https://searchitall-156620.appspot.com/?q=';

class FirebaseSearchInput extends Component {
  constructor(props) {
    super(props);
    this.onUpdateInput = this.onUpdateInput.bind(this);
    this.onNewRequest = this.onNewRequest.bind(this);
    this.state = {
      dataSource : [],
      inputValue : ''
    }
  }

  onUpdateInput(inputValue) {
    const self = this;
    this.setState({
      inputValue: inputValue
    }, function() {
      self.performSearch();
    })
  }

  onNewRequest(chosenRequest) {
    this.props.callback(chosenRequest);
  }

  performSearch() {
    const self = this,
      url = searchURL + this.state.inputValue;

    if(this.state.inputValue !== '') {
      fetch(url).then(response => response.json())
        .then(json => {
        
        let searchResults, retrievedSearchTerms;

        if(json.error) return json.error;

        searchResults = json.results;

        retrievedSearchTerms = searchResults.map(function(result) {
          let searchObject = {};
          switch (result._service) {
            case '4sq':
              if (result.name && result.id) {
                searchObject.text = result.name;
                searchObject.value = result.name;
                searchObject.id = '4sq:' + result.id;
                if (result.url) searchObject.url = result.url;
                // if (result.categories && result.categories[0] && result.categories[0].icon) searchObject.image = result.categories[0].icon.prefix + result.categories[0].icon.suffix;
                if (result.location && result.location.formattedAddress) searchObject.description = result.location.formattedAddress.join(' ');
              }
              break;
            case 'spotify':
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
            case 'tmbd':
              // console.log(JSON.stringify(result))
              // if (result.name) {
              //   return { text: result.name, value: 'boo' };
              // }
              break;
            case 'amazon':
              // if (result.title) {
              //   return { text: result.title, value: 'boo' };
              // }
              break;
          }
          if (searchObject) return searchObject;
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
        fullWidth={true}
        hintText='Search for a product'
        dataSource = {this.state.dataSource}
        onUpdateInput = {this.onUpdateInput} 
        onNewRequest = {this.onNewRequest} />
      </MuiThemeProvider>
  }
}

export default FirebaseSearchInput;