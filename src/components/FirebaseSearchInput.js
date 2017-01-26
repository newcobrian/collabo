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
    // this.onNewRequest = this.onNewRequest.bind(this);
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

  // onNewRequets(inputValue) {
    
  // }

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
                // console.log(JSON.stringify(result))
                searchObject.text = result.name;
                searchObject.value = '4sq:' + result.id;
                if (result.url) searchObject.url = result.url;
                if (result.icon) searchObject.image = result.icon.prefix + result.icon.suffix;
                if (result.location && result.location.formattedAddress) searchObject.description = result.location.formattedAddress.join(' ');
              }
              break;
            case 'spotify':
              if (result.name && result.id) {
                // console.log(JSON.stringify(result))
                searchObject.text = result.name;
                searchObject.value = 'spotify:' + result.id;
                if (result.external_urls && result.external_urls.spotify) searchObject.url = result.external_urls.spotify;
                if (result.images && result.images[0] && result.images[0].url) searchObject.image = result.images[0].url;
                if (result.type) {
                  switch (result.type) {
                    case 'album':
                      if (result.artists && result.artists.name) searchObject.description = 'Album by ' + result.artists.name;
                      break;
                    case 'artist':
                      if (result.genres) searchObject.description = result.genres.join(', ');
                      break;
                    case 'track':
                    if (result.artists && result.artists.name) searchObject.description = 'By ' + result.artists.name;
                    if (result.album && result.album.name) searchObject.description += ', from the album ' + result.album.name;
                      break;
                  }
                }
              }
              break;
            case 'tmbd':
              if (result.name) {
                return { text: result.name, value: 'boo' };
              }
              break;
            case 'amazon':
              if (result.title) {
                return { text: result.title, value: 'boo' };
              }
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
    console.log(this.state.inputValue)
    return <MuiThemeProvider name={this.props.name} muiTheme={getMuiTheme()}>
      <AutoComplete
        fullWidth={true}
        hintText='Search for a product or enter a new product name'
        dataSource    = {this.state.dataSource}
        onUpdateInput = {this.onUpdateInput} />
      </MuiThemeProvider>
  }
}

export default FirebaseSearchInput;