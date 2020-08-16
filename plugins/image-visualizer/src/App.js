import React, { Component } from 'react'
import pixels from 'image-pixels';

import * as config from './config';
import ImgCrypt from './imgcrypt';

import Menu from './Menu';

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      source: 'image/generic/universe3.jpg',
      seed: ''
    }

    this.imgcrypt = null;
    this.onEnterSeed = this.onEnterSeed.bind(this);
  }

  componentDidMount() {
    
  }

  async onEnterSeed(seed) {
    const { source } = this.state;
    const pixData = await pixels(`${config.data.baseUrl}/${source}`);
    const { data, width, height } = pixData;
    const image = { data, width, height };

    if (this.imgcrypt) {
      this.imgcrypt.destroy();
    }
    this.imgcrypt = new ImgCrypt({ ...image, seed }, null);
    document.getElementById('container').appendChild(this.imgcrypt.getCanvas());

    let interval = null;
    interval = setInterval(() => {
      if (this.imgcrypt.loop()) {
        clearInterval(interval);
      }
    }, 1);

  }

  render() {
    return (
      <div id="container" className="container">
        <Menu onEnter={this.onEnterSeed} />
      </div>
    )
  }
}
