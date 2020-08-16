import React, { Component } from 'react'

import Toggle from './components/Toggle';

export default class Menu extends Component {
  static defaultProps = {
    onItemAdd: function() {},
    onItemRemove: function() {}
  };

  constructor(props) {
    super(props);

    this.state = {
      modeCheck: false,
    }

    this.onModeChange = this.onModeChange.bind(this);
  }

  onModeChange(e) {
    this.props.onChangeMode(e.target.checked);
    this.setState({ modeCheck: e.target.checked });
  }

  render() {
    return (
      <div className="menu">
        <button onClick={() => this.props.onItemAdd('LABEL')}>Label</button>
        <button onClick={() => this.props.onItemAdd('TICKER')}>Ticker</button>
        <button onClick={() => this.props.onItemAdd('STOCK')}>Stock</button>
        <button onClick={() => this.props.onItemAdd('STATS')}>Stats</button>
        <button onClick={() => this.props.onItemAdd('PLUGIN')}>Plugin</button>
        <div>
          <div>
            <span>Edit Mode</span>
            <Toggle value={this.state.modeCheck} onChange={this.onModeChange} />
          </div>
          <button onClick={() => {}}>Save</button>
        </div>
      </div>
    )
  }
}
