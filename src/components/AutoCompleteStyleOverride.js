import React from 'react';
import { AutoComplete } from 'material-ui';

const AutoCompleteStyleOverride = props => (
  <AutoComplete
  	filter={props.filter}
  	fullWidth={true}
  	hintText='Search for a product'
  	dataSource={props.dataSource}
    onUpdateInput={props.onUpdateInput} 
    onNewRequest={props.onNewRequest}
    style={{
        list: {
            height: '400px',
            overflow: 'scroll'
        },
    }}
  />
);

export default AutoCompleteStyleOverride;