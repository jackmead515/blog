import React, { Component } from 'react'

export default class Rows extends Component {
  render() {
    return (
      <div 
        className="rows"
        style={{ gridGap: this.props.gap }}
      >
        {this.props.children}
      </div>
    )
  }
}
