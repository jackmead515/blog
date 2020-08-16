import React, { Component } from 'react'
import { connect } from 'react-redux'
import adBlocker from 'just-detect-adblock'

import { adBlockOpen, adBlockClose } from '../actions/messages';

class AdBlock extends Component {
  constructor(props) {
    super(props);

    this.state = {
      detected: adBlocker.isDetected(),
      opened: props.adblock
    }

    this.onGoAway = this.onGoAway.bind(this);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.state.opened !== nextState.opened;
  }

  onGoAway() {
    this.props.dispatch(adBlockClose());
    this.setState({ opened: false });
  }

  renderAdBlocker() {
    const { opened } = this.state;

    if (opened) {
      return (
        <div className="animated fadeIn adblock_container">
          <div>
            <h3>Hey I can tell you have an ad block enabled.</h3>
            <p>That's cool. Since I don't have ads. But I might one day!</p>
          </div>
          <button onClick={this.onGoAway}>Go Away</button>
        </div>
      );
    } else {
      return null;
    }
  }

  render() {
    return this.state.detected ? this.renderAdBlocker() : null;
  }
}

const mapStateToProps = (state) => {
  return {
    adblock: state.messages.adblock
  }
}

export default connect(mapStateToProps)(AdBlock)
