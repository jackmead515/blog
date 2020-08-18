import React, { Component } from 'react';

export default class AttentionBlock extends Component {
  constructor(props) {
    super(props);

    this.state = {
      closed: props.defaultClosed ? true : false,
      preloadClassName: 'preload',
    };

    this.firstRender = false;
  }

  componentDidUpdate() {
    this.setState({ preloadClassName: null });
  }

  componentDidMount() {
    if (this.firstRender) {
      this.firstRender = false;
      this.forceUpdate();
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextState.closed !== this.state.closed ||
    nextState.preloadClassName !== this.state.preloadClassName;
  }

  render() {
    const { closed, preloadClassName } = this.state;
    const { containerClassName, contentClassName, title, children } = this.props;
    const openedClass = closed ? 'attblock-closed' : 'attblock-opened';

    return (
      <div className={`attblock ${containerClassName} ${preloadClassName}`}>
        <h2 
          onClick={() => this.setState({ closed: !this.state.closed })}
          className={openedClass}
        >
          <span>{title}</span>
        </h2>
        <div className={contentClassName}>
          {children}
        </div>
      </div>
    );
  }
}
