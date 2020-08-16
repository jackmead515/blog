import React, { Component } from 'react'
import axios from 'axios';

import { asyncRetry } from '../../util/retry';
import AttentionBlock from '../../components/AttentionBlock';
import Listing from '../../components/SideImageListing';

export default class Recent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      recent: [],
      loading: true
    }
  }

  componentDidMount() {
    this.fetchRecent();
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.state.loading !== nextState.loading;
  }

  async fetchRecent() {
    try {
      const response = await asyncRetry(() => axios.get('/blogs/recent'));
      this.setState({ recent: response.data, loading: false });
    } catch(err) {
      console.log(err);
    }
  }

  renderContent() {
    const { recent } = this.state;

    return (
      <AttentionBlock
        title="Most Recent"
        containerClassName="blog_recent"
        contentClassName="blog_recent-listings"
      >
        {recent.map((listing, index) => <Listing key={index} listing={listing}/>)}
      </AttentionBlock>
    );
  }

  render() {
    const { loading } = this.state;
    return loading ? null : this.renderContent();
  }
}
