import React, { Component } from 'react'

import Navigation from './Navigation';
import Footer from './Footer';

export default class Template extends Component {
  render() {
    return (
      <>
        <Navigation />
        <div className="padded_container">
          {this.props.children}
        </div>
        <Footer />
      </>
    );
  }
}
