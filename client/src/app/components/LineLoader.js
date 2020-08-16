import React, { Component } from 'react'

export default class LineLoader extends Component {
  render() {
    const { height } = this.props;

    return (
      <div className="loader" style={{height}}>
        <div className="loaderbar"  style={{height}}/>
      </div>
    )
  }
}
