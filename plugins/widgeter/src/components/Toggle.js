

import React, { PureComponent } from 'react'

export default class Toggle extends PureComponent {
  render() {
    return (
      <label className="switch">
        <input 
          className="switch-input"
          type="checkbox"
          value={this.props.value}
          onChange={(event) => this.props.onChange(event)}
        />
        <span className="switch-label" data-on="On" data-off="Off"></span> 
        <span className="switch-handle"></span> 
      </label>
    )
  }
}