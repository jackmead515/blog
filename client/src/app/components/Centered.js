import React, { Component } from 'react'

export default class Centered extends Component {
  render() {
    return (
      <div 
        className="centered"
        style={{gridGap: this.props.gap}}
      >
        {this.props.children}
      </div>
    )
  }
}
