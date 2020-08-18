import React, { Component } from 'react'
import axios from 'axios';

import { asyncRetry } from '../util/retry';
import AttentionBlock from '../components/AttentionBlock';
import Listing from '../components/SideImageListing';

export default class Popular extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      popular: []
    }
  }

  componentDidMount() {
    this.fetchPopular();
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.state.loading !== nextState.loading;
  }

  async fetchPopular() {
    try {
      const response = await asyncRetry(() => axios.get('/blogs/popular'));
      this.setState({ popular: response.data, loading: false });
    } catch(e) {
      console.log(e);
    }
  }

  renderContent() {
    const { mobile } = this.props;
    const { popular } = this.state;

    return (
      <AttentionBlock
        defaultClosed={mobile ? true : false}
        title="Most Popular"
        containerClassName="home_popular"
        contentClassName="home_popular-listings"
      >
        {popular.map((listing, index) => <Listing key={index} listing={listing}/>)}
      </AttentionBlock>
    );
  }

  render() {
    const { loading } = this.state;

    return loading ? null : this.renderContent();
  }
}
