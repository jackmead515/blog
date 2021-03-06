import React, { Component } from 'react'

/**
 * Basic Usage:
 * ```
 *  <Minimize expanded={false} title="Your Title">
      {this.renderYourContent()}
    </Minimize>
 * ```
 */
export default class Minimize extends Component {
  constructor(props) {
    super(props);
    
    let initialExpansion = true;
    if (props.expanded === true || props.expanded === false) {
      initialExpansion = props.expanded;
    }

    this.state = {
      expanded: initialExpansion
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.state.expanded !== nextState.expanded;
  }

  renderControl() {
    const { title } = this.props;
    const { expanded } = this.state;
    const borderBottom = expanded ? '1px solid #cccccc' : '';
    
    const tooltip = expanded ? 'Close' : 'Open';

    return (
      <div
        className="minimize_control"
        style={{borderBottom}}
        title={tooltip}
        onClick={() => this.setState({ expanded: !expanded })}
      >
        {title}
        {expanded ? <span>-</span> : <span>+</span>}
      </div>
    )
  }

  renderContent() {
    const { expanded } = this.state;
    
    const display = expanded ? '' : 'none';
    
    return (
      <div className="minimize_content" style={{display}}>
        {this.props.children}
      </div>
    )
  }

  render() {    
    return (
      <div className="minimize_container">
        {this.renderControl()}
        {this.renderContent()}
      </div>
    )
  }
}
