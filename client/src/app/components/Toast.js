import React, { Component } from 'react'
import { connect } from 'react-redux'

import FAIcon from 'react-fontawesome';

import { popError } from '../actions/messages';

class Toast extends Component {
  constructor(props) {
    super(props);

    this.state = {
      messages: []
    }

    this.clearMessages = this.clearMessages.bind(this);
  }

  clearMessages() {
    this.setState({ messages: [] });
  }

  componentWillReceiveProps(nextProps) {
    const nextErrors = nextProps.messages.errors;
    nextErrors.map((error) => {
      this.props.dispatch(popError(error.id));
      const { messages } = this.state;
      messages.push(error.message);
      this.setState({ messages });
    });
  }

  render() {
    const { messages } = this.state;

    if(messages.length) {
      return (
        <div className="toast_container toast_fadeInDown">
          <div className="toast_content">
            {this.state.messages.map((m, i) => <p key={i} className="toast_text">{m}</p>)}
          </div>
          <div
            onClick={this.clearMessages}
            className="toast_clear"
          >
            <FAIcon name="times" />
          </div>
        </div>
      );
    }
    
    return null;
  }
}

const mapStateToProps = state => {
  return { messages: state.messages };
};

export default connect(mapStateToProps)(Toast)
