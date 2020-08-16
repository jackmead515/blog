import React, { Component } from 'react'
import FAIcon from 'react-fontawesome';

export default class Navigation extends Component {
  constructor(props) {
    super(props);

    this.state = {
      windowWidth: 0,
      menu: false
    }

    this.updateDimensions = this.updateDimensions.bind(this);
  }

  componentDidMount() {
    window.addEventListener("resize", this.updateDimensions);
    this.updateDimensions();
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (this.state.windowWidth >= 500 && nextState.windowWidth < 500) ||
      (this.state.windowWidth < 500 && nextState.windowWidth >= 500) ||
      this.state.menu !== nextState.menu;
  }

  updateDimensions() {
    const width = window.innerWidth ||
      document.documentElement.clientWidth ||
      document.body.clientWidth;

    this.setState({ windowWidth: width });
  }

  renderBurger() {
    return (
      <div
        className="nav_menu"
        onClick={() => this.setState({ menu: !this.state.menu })}
      >
        <FAIcon name="bars" />
      </div>
    )
  }

  renderMobile() {
    const { menu } = this.state;

    if (menu) {
      return (
        <div className="nav_container-mobile">
          {this.renderBurger()}
          <a className="nav_item" href="/">Home</a>
          <a className="nav_item" href="/about">About</a>
          <a className="nav_item" href="/contact">Contact</a>
          <a className="nav_item" href="/plugins">Plugins</a>
          <a className="nav_item" href="/gallery">Gallery</a>
        </div>
      )
    }

    return (
      <div className="nav_container-mobile">
        {this.renderBurger()}
      </div>
    )
  }

  renderFull() {
    return (
      <div className="nav_container">
        <a className="nav_item" href="/">Home</a>
        <a className="nav_item" href="/about">About</a>
        <a className="nav_item" href="/contact">Contact</a>
        <a className="nav_item" href="/plugins">Plugins</a>
        <a className="nav_item" href="/gallery">Gallery</a>
      </div>
    )
  }

  render() {
    const { windowWidth } = this.state;
    return windowWidth < 500 ? this.renderMobile() : this.renderFull();
  }
}
