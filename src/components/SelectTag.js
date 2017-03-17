import React from 'react';

const SelectTag = props => {
  const handleChange = ev => {
    ev.preventDefault();
    props.handler(ev.target.value);
  };
                    
  return (
  	<span>
      
	    <select className='react-textselect-input' onChange={handleChange} value={props.value}>
	    	{props.options.map(item => {
	    		return (
		            <option value={item} key={item}>{item}</option>
		        );
	    	})}
	    </select>
	</span>
  );
};

export default SelectTag;