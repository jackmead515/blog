import React, { Component } from 'react'

export default class Controls extends Component {

  getLightsClass() {
    return "status_active"
  }

  getCamerasClass() {
    return "status_inactive"
  }

  getSoilCalibrateClass() {
    return "status_error"
  }

  getHaltedClass() {
    return "status_inactive"
  }

  render() {
    return (
      <div className="c_container">
        <div className="info">
          <p><span>version</span>{`1.2.5`}</p>
          <p><span>debug</span>{`${true}`}</p>
          <p><span>morning</span>{`5:00`}</p>
          <p><span>night</span>{`8:00`}</p>
          <p><span>temperature</span>{`71 C`}</p>
          <p><span>humidity</span>{`87%`}</p>
          <p><span>uptime</span>{`57 hours`}</p>
        </div>
        <div className="status">
          <div><div className={this.getLightsClass()}/><p>Lights</p></div>
          <div><div className={this.getCamerasClass()}/><p>Cameras</p></div>
          <div><div className={this.getSoilCalibrateClass()}/><p>Calibrating</p></div>
          <div><div className={this.getHaltedClass()}/><p>Halted</p></div>    
        </div>
      </div>
    )
  }
}
