import React, { Component } from 'react'

import TempHumid from './TempHumid';
import Soil from './Soil';
import Controls from './Controls';
import Navigation from './Navigation';

export default class App extends Component {
  render() {
    return (
      <div className="container">
        <Navigation />
        <Controls />
        <TempHumid />
        <Soil />
      </div>
    )
  }
}
