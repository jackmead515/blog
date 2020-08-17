import React, { Component } from 'react';

import LineLoader from './LineLoader';

import * as config from '../../config';

function disableGlobalScrolling() {
  document.body.className = 'disable_scroll';
}

function enableGlobalScrolling() {
  document.body.className = '';
}

function globalScrollToTop() {
  if (window && window.scrollTo) {
    window.scrollTo(0, 0);
  }
}

export default class Image extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      zoomed: false,
      zoom: 0,
      errored: false,
    };

    this.onImageError = this.onImageError.bind(this);
    this.onImageLoad = this.onImageLoad.bind(this);
    this.onClick = this.onClick.bind(this);
    this.onWheel = this.onWheel.bind(this);
  }

  onImageLoad() {
    this.setState({ loading: false });
  }

  onImageError() {
    this.setState({ loading: false, errored: true });
  }

  onClick() {
    const { zoomable } = this.props;

    if (zoomable) {
      const z = !this.state.zoomed;

      if (z) {
        disableGlobalScrolling();
      } else {
        enableGlobalScrolling();
      }

      this.setState({ zoomed: z });
    }
  }

  // eslint-disable-next-line complexity
  onWheel(e) {
    let delta = null;
    const mx = e.clientX?e.clientX:0;
    const my = e.clientY?e.clientY:0;
    if (e.delta) {
      delta = e.delta;
    } else if (e.wheelDelta) {
      delta = e.wheelDelta;
    } else if (e.deltaY) {
      delta = e.deltaY;
    }
    if (delta !== null || delta !== undefined) {
      if (delta < 0) {
        this.setState({ 
          zoom: this.state.zoom-10<0?0:this.state.zoom-10,
          mouseX: mx,
          mouseY: my,
        });
      } else if (delta > 0) {
        this.setState({
          zoom: this.state.zoom+10>100?100:this.state.zoom+10,
          mouseX: mx,
          mouseY: my,
        });
      }
    }
  }

  renderImage() {
    const { loading } = this.state;
    const { source } = this.props;

    const classes = loading ? 'image_content blur' : 'image_content';

    return (
      <img
        className={classes}
        src={`${config.data.baseUrl}/${source}`}
        alt=""
        onLoad={this.onImageLoad}
        onError={this.onImageError}
      />
    );
  }

  renderLoading() {
    return (
      <div className="image_loading">
        <LineLoader />
      </div>
    );
  }

  renderErrored() {
    return (
      <div className="image_errored" />
    );
  }

  renderOverlay() {
    const { loading, errored } = this.state;

    if (loading) {
      return this.renderLoading();
    }

    if (errored) {
      return this.renderErrored();
    }
  }

  renderZoomed() {
    const { source } = this.props;
    const { zoomed } = this.state;

    if (zoomed) {
      const scrollTop = (window.pageYOffset || window.scrollTop) - (window.clientTop || 0);
      return (
        <div
          style={{ top: scrollTop }}
          onClick={this.onClick}
          className="image_zoomed"
        >
          <img
            className="image_zoomed_content"
            // onWheelCapture={this.onWheel}
            src={`${config.data.baseUrl}/${source}`}
          />
        </div>
      );
    }    
  }

  render() {
    const { width, height, maxWidth, maxHeight } = this.props;

    return (
      <>
        <div
          onClick={this.onClick}
          className="image_generic"
          style={{ width, height, maxWidth, maxHeight }}
        >
          {this.renderImage()}
          {this.renderOverlay()}
        </div>
        {this.renderZoomed()}
      </>
    );
  }
}
