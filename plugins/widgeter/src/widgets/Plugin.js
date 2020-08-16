import React, { Component } from 'react'

import { Modes } from '../models';
import { getBaseUrl } from '../config';

export default class Plugin extends Component {
  static defaultProps = {
    mode: 'DEFAULT'
  };

  constructor(props) {
    super(props);

    this.id = `plugin-${Math.floor(Math.random()*10000)}`;
    this.state = {
      source: '',
      editedSource: ''
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { editedSource } = this.state;
    if (this.props.mode !== Modes.EDIT && editedSource.length && prevState.source !== editedSource) {
      this.setState({ source: '' }, () => {
        this.setState({ source: editedSource }, () => {
          this.setFrameSource();
        });
      });
    }
  }
  
  setFrameSource() {
    const { source } = this.state;
    const frame = document.getElementById(this.id);
    if (frame && source.length) {
      frame.contentWindow.location.href = frame.src;
    }
  }

  renderEdit() {
    const { mode } = this.props;
    
    if (mode === Modes.EDIT) {
      return (
        <div className="edit">
          <select
            onChange={(e) => this.setState({editedSource: e.target.value})}
            value={this.state.editedSource}
          >
            <option value="" defaultValue="" disabled> 
              Select A Source
            </option>
            <option value="sat-tester">Collision Simulator</option>
            <option value="capacitor-sensor">Capacitor Sim</option>
            <option value="d3-graphs">D3 Line Graph</option>
            <option value="covid19">COVID-19 Map</option>
          </select>
        </div>
      )
    }
  }

  renderFrame() {
    const { source } = this.state;

    if (source.length) {
      return (
        <iframe
          id={this.id}
          width='100%'
          height='100%'
          src={`${getBaseUrl()}/plugin/${source}`}
        />
      )
    } else {
      return <p>No Source Selected</p>
    }   
  }

  render() {
    return (
      <>
        {this.renderEdit()}
        {this.renderFrame()}
      </>
    )
  }
}