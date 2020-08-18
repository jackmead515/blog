import React, { Component } from 'react'
import axios from 'axios';

import { asyncRetry } from '../util/retry';
import Renderer from './Renderer';
import LineLoader from './LineLoader';

export default class Remote extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: null,
      loading: true
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.state.loading !== nextState.loading;
  }

  async componentDidMount() {
    try {
      const response = await asyncRetry(() => axios.get(this.props.source));
      this.setState({ data: Renderer.build(response.data), loading: false });
    } catch (err) {
      this.setState({ loading: false });
      console.log(err);
    }
  }

  renderContent() {
    const { data } = this.state;

    if (data === null) {
      return (
        <div className="remote_broken">
          Oh boy. Somethings broken. So sorry about that :(
        </div>
      )
    }

    return data;
  }

  render() {
    return this.state.loading ? <LineLoader/> : this.renderContent();
  }
}
