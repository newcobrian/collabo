import React from 'react';
import { debounce } from 'lodash';

class RenderDebounceInput extends React.Component {
  constructor(props) {
    super(props)
    this.state = {value: props.value}
    this.lastPropValue = props.value

    this.debouncedOnChange = debounce(event => {
      props.debounceFunction(event.target.value)
    }, 1000);

    this.handleOnChange = event => {
      event.persist()
      this.setState({value: event.target.value})
      // this.props.changeHandler(event.target.value);
      this.debouncedOnChange(event)
    }
  }

  getValue() {
    const value = this.props.value !== this.lastPropValue ?
      this.props.value :
      this.state.value

    this.lastPropValue = this.props.value

    return value
  }

  render() {
    return (
        <textarea
          className={this.props.className}
          cols="20"
          wrap="hard"
          forceNotifyByEnter = {false}
          placeholder={this.props.placeholder}
          type={this.props.type}
          value={this.getValue()}
          onChange={this.handleOnChange}/>

    )
  }
}

export default RenderDebounceInput;