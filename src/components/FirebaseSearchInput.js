import React, {Component} from 'react';
import { connect } from 'react-redux';
import { AutoComplete } from 'material-ui';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import * as Constants from '../constants';
import * as Actions from '../actions';
import 'whatwg-fetch';

var algoliasearch = require('algoliasearch');
var client = algoliasearch('2OEMW8KEZS', '62e17a3113351343399fad062d3cbca5', {protocol:'https:'});

var index = client.initIndex('whatsgood-subjects');

const mapStateToProps = state => ({
  ...state.editor,
  authenticated: state.common.authenticated
});

class FirebaseSearchInput extends Component {
  constructor(props) {
    super(props);
    this.onUpdateInput = this.onUpdateInput.bind(this);
    this.onNewRequest = this.onNewRequest.bind(this);
    this.updateAlgoliaIndex = this.updateAlgoliaIndex.bind(this);
    this.state = {
      dataSource : [],
      inputValue : '',
      searchTimer: undefined
    }
  }

  onUpdateInput(inputValue) {
    const self = this;
    this.props.onUpdateField('title', inputValue)
    this.setState({
      inputValue: inputValue
    }, function() {
      clearTimeout(this.state.searchTimer);
      this.state.searchTimer = setTimeout(function () { 
        self.performSearch();
      }, 200)
    })
  }

  updateAlgoliaIndex(request) {
    if (request._service !== 'algolia') {
      index.saveObject({
        name: request.value,
        description: request.description,
        objectID: request.id
      }, function(err, content) {
        if (err) {
          console.error(err);
          return;
        }
      });
    }
  }

  onNewRequest(chosenRequest) {
    this.updateAlgoliaIndex(chosenRequest);
    this.props.callback(chosenRequest);
  }

  performSearch() {
    const self = this,
      url = Constants.SUBJECT_SEARCH_URL + this.state.inputValue + '&ll=' + this.props.searchLocation.lat + ',' + this.props.searchLocation.lng;
      // url = Constants.SUBJECT_SEARCH_URL + this.state.inputValue + '&near=' + this.props.searchLocation.label;
      
    // console.log(url)

    // index.search(this.state.inputValue, function(err, content) {
    //   console.log(JSON.stringify(content.hits));
    // });
    // return;

    if(this.state.inputValue !== '') {
      let retrievedSearchTerms = [];

      // search Firebase
      index.search(this.state.inputValue, function(err, content) {
        if (err) {
          console.error(err);
          return;
        }
        content.hits.map(function(result) {
          let algoliaSearchObject = {};
          if (result.title && result.objectID) {
            algoliaSearchObject._service = 'algolia';
            algoliaSearchObject.text = result.title;
            algoliaSearchObject.value = result.title;
            algoliaSearchObject.id = result.objectID;
            if (result.description) algoliaSearchObject.description = result.description;

            retrievedSearchTerms.push(algoliaSearchObject);
          }          
        })
      });

      // then use the search API
      fetch(url).then(response => response.json())
        .then(json => {
        let searchResults;

        if(json.error) return json.error;

        searchResults = json.results;

        searchResults.map(function(result) {
          let searchObject = {};
          switch (result._service) {
            case '4sq':
              if (result.name && result.id) {
                searchObject.text = result.name;
                searchObject.value = searchObject.title = result.name;
                searchObject.id = '4sq:' + result.id;
                if (result.url) searchObject.url = result.url;
                if (result.location && result.location.formattedAddress) searchObject.address = result.location.formattedAddress.join(' ');
                if (result.location && result.location.address + result.location.city) searchObject.text += ' - ' + result.location.address + ', ' + result.location.city;
              }
              break;
            default:
              break;
          }
          if (searchObject.text && searchObject.id) {
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
        hintText={this.props.placeholder}
        dataSource={this.state.dataSource}
        onUpdateInput={this.onUpdateInput} 
        onNewRequest={this.onNewRequest}
        className={this.props.className}
        style={{
          backgroundColor: '',
        }}
        underlineFocusStyle={{
          borderColor: '#5B9D3A'
        }}
        textFieldStyle={{
          height: '50px',
          marginBottom: '40px'
        }}
        underlineStyle={{borderColor: '#5B9D3A'}}
        menuStyle={{
          height: '400px',
          overflow: 'scroll'
        }}
     />
      </MuiThemeProvider>
  }
}

export default connect(mapStateToProps, Actions)(FirebaseSearchInput);
// export default FirebaseSearchInput;