import React, { Component } from 'react';
import axios from 'axios';

import { asyncRetry } from '../../util/retry';
import AttentionBlock from '../../components/AttentionBlock';
import Listing from '../../components/Listing';

export default class Suggest extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      random: [],
    };
  }

  componentDidMount() {
    this.fetchRandom();
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.state.loading !== nextState.loading;
  }

  async fetchRandom() {
    try {
      const response = await asyncRetry(() => axios.get('/blogs/random'));
      this.setState({ random: response.data, loading: false });
    } catch (e) {
      console.log(e);
    }
  }

  renderContent() {
    const { random } = this.state;

    return (
      <AttentionBlock
        title="Suggested"
        containerClassName="blog_suggest"
        contentClassName="blog_suggest-listings"
      >
        {random.map((listing, index) => <Listing key={index} listing={listing}/>)}
      </AttentionBlock>
    );
  }

  render() {
    const { loading } = this.state;

    return loading ? null : this.renderContent();
  }
}
