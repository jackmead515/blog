import React, { Component } from 'react'
import * as colors from '../styles/ThemeColors';

export default class Tag extends Component {
  constructor(props) {
    super(props);

    this.state = {
      border: null
    }

    this.mouseEnter = this.mouseEnter.bind(this);
    this.mouseLeave = this.mouseLeave.bind(this);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.state.border !== nextState.border;
  }

  mouseEnter(event) {
    this.setState({
      border: `1px solid ${colors.random()}`
    })
  } 

  mouseLeave(event) {
    this.setState({
      border: null
    })
  }

  renderTag() {
    const { tag, count } = this.props;

    if (count) {
      return <p><span>{`(${count})`}</span>{` ${tag}`}</p>
    } else {
      return <p>{`${tag}`}</p>
    }
  }

  render() {
    const { tag } = this.props;
    const { border } = this.state;

    return (
      <a
        href={`/tag/${tag}`}
        onMouseEnter={this.mouseEnter}
        onMouseLeave={this.mouseLeave}
        className='blog_tag'
        style={{ border }}
      >
        {this.renderTag()}
      </a>
    );
  }
}
