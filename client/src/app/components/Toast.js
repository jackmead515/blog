import React, { Component } from 'react'
import { connect } from 'react-redux'
import { ToastContainer, toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

import { popError } from '../actions/messages';

class Toast extends Component {
  componentDidUpdate() {
    const thisErrors = this.props.messages.errors;

    thisErrors.forEach((error) => {
      this.props.dispatch(popError(error.id));
      toast.error(error.message, {
        progress: undefined,
        autoClose: 5000,
        closeOnClick: true
      });
    });
  }

  render() {
    return (
      <ToastContainer
        hideProgressBar={true}
      />
    )
  }
}

const mapStateToProps = state => {
  return { messages: state.messages };
};

export default connect(mapStateToProps)(Toast)
