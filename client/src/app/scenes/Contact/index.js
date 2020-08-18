import React, { Component } from 'react'
import { connect } from 'react-redux'

import { pushError } from '../../actions/messages';
import axios from 'axios';
import * as config from '../../../config';

import Navigation from '../Navigation';

class Contact extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false
    }

    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount () {
    const script = document.createElement("script");
    script.src = "https://www.google.com/recaptcha/api.js";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    document.getElementById('contact').addEventListener('submit', this.onSubmit)
  }

  onSubmit(e) {
    e.preventDefault();
    const name = e.target.name.value;
    const email = e.target.email.value;
    const message = e.target.message.value;
    const recaptcha = global.grecaptcha.getResponse();

    this.setState({ loading: true }, async () => {
      const data = {
        name,
        email,
        message,
        recaptcha
      }
      
      try {
        const response = await axios.post('/contact_me', data);
        alert(response.data);
      } catch(e) {
        this.props.dispatch(pushError(e.response.data || 'Message failed to send. Please try again.'));
      }

      this.setState({ loading: false });
    });
  }

  renderSubmit() {
    const { loading } = this.state;

    if (loading) {
      return <div className="spin-loader" />
    }

    return (
      <button
        className="contact_submit"
        type="submit"
      >
        Submit
      </button>
    )
  }

  render() {
    return (
      <>
        <Navigation/>
        <div className="padded_container">
          <div className="contact_container">
            <h1>Have a question or comment? Send me a message!</h1>
            <form id="contact" action="/contact" method="POST">
              <p>Name</p>
              <input
                maxLength="200"
                name="name"
                type="name"
                placeholder="Your name"
              />
              <p>Email</p>
              <input
                maxLength="200"
                name="email"
                type="email"
                placeholder="Your email address"
              />
              <p>Message</p>
              <textarea
                maxLength="5000"
                name="message"
              />
              <div
                id="recaptcha"
                className="g-recaptcha"
                data-sitekey={config.data.captchaId}
              />
              {this.renderSubmit()}
            </form>
          </div>
        </div>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {}
}

export default connect(mapStateToProps)(Contact)
