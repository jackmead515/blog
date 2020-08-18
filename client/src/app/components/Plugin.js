import React, { Component } from 'react'

import * as config from '../../config';

export default class Plugin extends Component {
  constructor(props) {
    super(props);

    this.onLoad = this.onLoad.bind(this);
  }

  onLoad() {

  }
  
  componentDidMount() {
    const { id } = this.props;
    const frame = document.getElementById(id);
    frame.contentWindow.location.href = frame.src;
  }

  render() {
    const { source, id, width, height } = this.props;
    return (
      <iframe
        id={id}
        width={width}
        height={height}
        src={`${config.data.baseUrl}/${source}`}
        onLoad={this.onLoad}
      />
    )
  }
}
