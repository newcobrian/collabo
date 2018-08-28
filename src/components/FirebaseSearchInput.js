import React, {Component} from 'react';
import { connect } from 'react-redux';
import { AutoComplete } from 'material-ui';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import * as Constants from '../constants';
import * as Actions from '../actions';
import 'whatwg-fetch';

const algoliasearch = require('algoliasearch');
const client = algoliasearch('NFI90PSOIY', '03fbdcb4cee86d78bd04217626a3a52b', {protocol:'https:'});

const mapStateToProps = state => ({
  ...state.editor,
  authenticated: state.common.authenticated
});

class FirebaseSearchInput extends Component {
  constructor(props) {
    super(props);
    this.onUpdateInput = this.onUpdateInput.bind(this);
    this.onNewRequest = this.onNewRequest.bind(this);
    // this.updateAlgoliaIndex = this.updateAlgoliaIndex.bind(this);
    this.state = {
      dataSource : [],
      inputValue : '',
      searchTimer: undefined,
      index: {}
    }
  }

  componentDidMount() {
    switch(this.props.type) {
      case Constants.POSTS_SEARCH:
        this.setState({
          index: client.initIndex('posts')
        })
        break;
      case Constants.PEOPLE_SEARCH:
        this.setState({
          index: client.initIndex('views-users')
        })
        break;
      case Constants.GEO_SEARCH:
        this.setState({
          index: client.initIndex('views-geos')
        })
        break;
      default:
        break;
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

  // updateAlgoliaIndex(request) {
  //   if (request._service !== 'algolia') {
  //     this.state.index.saveObject({
  //       name: request.value,
  //       description: request.description,
  //       objectID: request.id
  //     }, function(err, content) {
  //       if (err) {
  //         console.error(err);
  //         return;
  //       }
  //     });
  //   }
  // }

  onNewRequest(chosenRequest) {
    // this.updateAlgoliaIndex(chosenRequest);
    this.props.callback(chosenRequest);
  }

  performSearch() {
    const self = this;
    // let url = Constants.SUBJECT_SEARCH_URL + this.state.inputValue;
    //   if (this.props.searchLocation && this.props.searchLocation.lat && this.props.searchLocation.lng) {
    //     url = url + '&ll=' + this.props.searchLocation.lat + ',' + this.props.searchLocation.lng;
    //   } 
      // url = Constants.SUBJECT_SEARCH_URL + this.state.inputValue + '&near=' + this.props.searchLocation.label;
      
    // console.log(url)

    // index.search(this.state.inputValue, function(err, content) {
    //   console.log(JSON.stringify(content.hits));
    // });
    // return;

    if(this.state.inputValue !== '') {
      let retrievedSearchTerms = [];
      let searchType = this.props.type;

      // search Firebase
      this.state.index.search({
        filters: 'orgName:' + this.props.orgName
      });
      this.state.index.search(this.state.inputValue, function(err, content) {
        if (err) {
          console.error(err);
          return;
        }
        content.hits.map(function(result) {
          switch (searchType) {
            case Constants.POSTS_SEARCH: {
              let algoliaSearchObject = {};
              if(result.title) {
                algoliaSearchObject.text = result.title;
                algoliaSearchObject.value = result.objectID;
                algoliaSearchObject.body = result.body;
                algoliaSearchObject.projectName = result.projectName;
                algoliaSearchObject.username = result.author ? result.author.username : '';
                retrievedSearchTerms.push(algoliaSearchObject);
              }
              break;
            }
            case Constants.PEOPLE_SEARCH: {
              let algoliaSearchObject = {};
              if(result.username) {
                algoliaSearchObject.text = result.username;
                algoliaSearchObject.value = result.username;
                algoliaSearchObject.userId = result.objectID;
                retrievedSearchTerms.push(algoliaSearchObject);
              }
              break;
            }
            case Constants.GEO_SEARCH: {
              let algoliaSearchObject = {};
              if(result.label) {
                algoliaSearchObject.text = result.label;
                algoliaSearchObject.value = result.label;
                algoliaSearchObject.placeId = result.objectID;
                algoliaSearchObject.fullCountry = result.fullCountry;
                retrievedSearchTerms.push(algoliaSearchObject);
              }
              break;
            }

            default:
              break;
          }
          
          // if (result.title && result.objectID) {
          //   algoliaSearchObject._service = 'algolia';
          //   algoliaSearchObject.text = result.title;
          //   algoliaSearchObject.value = result.title;
          //   algoliaSearchObject.id = result.objectID;
          //   if (result.description) algoliaSearchObject.description = result.description;

          //   retrievedSearchTerms.push(algoliaSearchObject);
          // }          
        })

        self.setState({
          dataSource: retrievedSearchTerms
        });
      });

      // then use the search API
      // fetch(url).then(response => response.json())
      //   .then(json => {
      //   let searchResults;

      //   if(json.error) return json.error;

      //   searchResults = json.results;

      //   searchResults.map(function(result) {
      //     let searchObject = {};
      //     switch (result._service) {
      //       case '4sq':
      //         if (result.name && result.id) {
      //           searchObject.text = result.name;
      //           searchObject.value = searchObject.title = result.name;
      //           searchObject.id = '4sq:' + result.id;
      //           if (result.url) searchObject.url = result.url;
      //           if (result.location && result.location.formattedAddress) searchObject.address = result.location.formattedAddress.join(' ');
      //           if (result.location && result.location.address + result.location.city) searchObject.text += ' - ' + result.location.address + ', ' + result.location.city;
      //         }
      //         break;
      //       default:
      //         break;
      //     }
      //     if (searchObject.text && searchObject.id) {
      //       searchObject._service = result._service;
      //       retrievedSearchTerms.push(searchObject);
      //     }
      //   });

      //   self.setState({
      //     dataSource: retrievedSearchTerms
      //   });
      // });
    }
  }

  render() {
    return (
      <MuiThemeProvider name={this.props.name} muiTheme={getMuiTheme()}>

        <AutoComplete
          filter={function filter(searchText, key) {
            return key.toLowerCase().includes(searchText.toLowerCase());
          }}
          fullWidth={true}
          placeholder={this.props.placeholder}
          dataSource={this.state.dataSource}
          onUpdateInput={this.onUpdateInput} 
          onNewRequest={this.onNewRequest}
          className={this.props.className}
          style={{
            backgroundColor: 'transparent'
          }}
          underlineFocusStyle={{
            borderColor: '#5B9D3A'
          }}
          textFieldStyle={{
            height: '40px',
            fontWeight: '400',
            lineHeight: '14px'
          }}
          menuItemStyle={{
            borderBottom: '1px solid #ccc !important',
            padding: '20px !important'
          }}
          selectedMenuItemStyle={{
            backgroundColor:'#3DCBF3 !important',
            color: 'white'
          }}
          innerDivStyle={{
            borderBottom: '1px solid #ccc !important',
            padding: '20px !important'
          }}
          underlineStyle={{
            border: 'none',
            borderBottom: '1px solid #3DCBF3'
          }}
          menuStyle={{
            overflow: 'scroll',
          }}
          hintStyle={{
            color: '#121419',
            fontSize: '14px',
            lineHeight: '20px',
            top: '10px',
            width: '100%',
            overflow:'auto',
            textAlign: 'left',
            padding: '0 0 0 8px',
            opacity: '.6'
          }}
       />
      </MuiThemeProvider>
      )
  }
}

export default connect(mapStateToProps, Actions)(FirebaseSearchInput);