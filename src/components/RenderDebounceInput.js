import React from 'react';
import { debounce } from 'lodash';
import Textarea from 'react-textarea-autosize';


class RenderDebounceInput extends React.Component {
  constructor(props) {
    super(props)
    this.state = {value: props.value}
    this.lastPropValue = props.value

    this.debouncedOnChange = debounce(event => {
      props.debounceFunction(event.target.value)
    }, 3000);

    this.handleOnChange = event => {
      event.persist()
      this.setState({value: event.target.value})
      // this.props.changeHandler(event.target.value);
      this.debouncedOnChange(event)
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.value !== this.props.value) {
      this.setState({value: nextProps.value});
      this.lastPropValue = this.props.value;
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
        <Textarea
          className={this.props.className}
          cols="20"
          rows="auto"
          wrap="hard"
          placeholder={this.props.placeholder}
          type={this.props.type}
          value={this.getValue()}
          onChange={this.handleOnChange}/>

    )
  }
}

export default RenderDebounceInput;