import React, { Component } from 'react'

function applyStyles(props) {
  const { gap, minChildWidth } = props;

  const styles = {};

  if (gap) {
    styles.gridGap = gap;
  }

  if (minChildWidth) {
    styles.gridTemplateColumns = `repeat(auto-fit, minmax(${minChildWidth}px, 1fr))`;
  }

  return styles;
}

export default class Inline extends Component {
  render() {
    return (
      <div
        className="inline"
        style={{...applyStyles(this.props)}}
      >
        {this.props.children}
      </div>
    )
  }
}