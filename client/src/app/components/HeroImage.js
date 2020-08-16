import React, { Component } from 'react'

import LineLoader from './LineLoader';

export default class HeroImage extends Component {
  constructor(props){
    super(props);

    this.state = {
      loading: true,
      errored: false
    }

    this.onImageError = this.onImageError.bind(this);
    this.onImageLoad = this.onImageLoad.bind(this);
  }

  onImageLoad() {
    this.setState({ loading: false });
  }

  onImageError() {
    this.setState({ loading: false, errored: true });
  }

  renderImage() {
    const { loading } = this.state;
    const { source } = this.props;

    const classes = loading ? "image_content blur" : "image_content";

    return (
      <img
        className={classes}
        src={source}
        alt=""
        onLoad={this.onImageLoad}
        onError={this.onImageError}
      />
    )
  }

  renderLoading() {
    return (
      <div className="image_loading">
        <LineLoader />
      </div>
    )
  }

  renderErrored() {
    return (
      <div className="image_errored" />
    )
  }

  renderOverlay() {
    const { loading, errored } = this.state;

    if(loading) {
      return this.renderLoading();
    }

    if(errored) {
      return this.renderErrored();
    }
  }

  render() {
    const { width, height } = this.props;

    return (
      <div className="image_hero" style={{ width, height }}>
        {this.renderImage()}
        {this.renderOverlay()}
      </div>
    )
  }
}

