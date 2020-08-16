import React, { Component } from 'react'

export default class Menu extends Component {
  constructor(props) {
    super(props);

    this.state = {
      seed: ''
    }

    this.onChangeSeed = this.onChangeSeed.bind(this);
    this.onEnter = this.onEnter.bind(this);
  }

  onChangeSeed(e) {
    const { value } = e.target;

    if (value.match(/^([a-z]|[A-Z]|[0-9])+$/g) && value.length <= 50) {
      this.setState({ seed: value });
    }
  }

  onEnter(e) {
    const { seed } = this.state;
    if (e.keyCode == 13 && seed.length) {
      this.props.onEnter(this.state.seed);
    }
  }

  render() {
    return (
      <div className="menu">
        <input
          type="text"
          maxLength={50}
          value={this.state.seed}
          onChange={this.onChangeSeed}
          onKeyDown={this.onEnter}
        />
      </div>
    )
  }
}
