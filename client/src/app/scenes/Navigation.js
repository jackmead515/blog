import React, { Component } from 'react';
import FAIcon from 'react-fontawesome';

export default class Navigation extends Component {
  constructor(props) {
    super(props);

    this.state = {
      windowWidth: 0,
    };

    this.mobileWidth = 530;
    this.updateDimensions = this.updateDimensions.bind(this);
  }

  componentDidMount() {
    window.addEventListener('resize', this.updateDimensions);
    this.updateDimensions();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateDimensions);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (this.state.windowWidth >= this.mobileWidth && nextState.windowWidth < this.mobileWidth) ||
      (this.state.windowWidth < this.mobileWidth && nextState.windowWidth >= this.mobileWidth) ||
      this.state.menu !== nextState.menu;
  }

  updateDimensions() {
    const width = window.innerWidth ||
      document.documentElement.clientWidth ||
      document.body.clientWidth;

    this.setState({ windowWidth: width });
  }

  renderMobile() {
    return (
      <div className="nav_container-mobile">
        <a className="nav_item" href="/"><FAIcon name="home"/></a>
        <a className="nav_item" href="/about"><FAIcon name="user"/></a>
        <a className="nav_item" href="/contact"><FAIcon name="envelope"/></a>
        <a className="nav_item" href="/plugins"><FAIcon name="plug"/></a>
        <a className="nav_item" href="/gallery"><FAIcon name="picture-o"/></a>
      </div>
    );
  }

  renderFull() {
    return (
      <div className="nav_container">
        <a className="nav_item" href="/"><FAIcon name="home"/> Home</a>
        <a className="nav_item" href="/about"><FAIcon name="user"/> About</a>
        <a className="nav_item" href="/contact"><FAIcon name="envelope"/> Contact</a>
        <a className="nav_item" href="/plugins"><FAIcon name="plug"/> Plugins</a>
        <a className="nav_item" href="/gallery"><FAIcon name="picture-o"/> Gallery</a>
      </div>
    );
  }

  render() {
    const { windowWidth } = this.state;
    return windowWidth < this.mobileWidth ? this.renderMobile() : this.renderFull();
  }
}
