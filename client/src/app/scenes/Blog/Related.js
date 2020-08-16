import React, { Component } from 'react'
import axios from 'axios';

import { asyncRetry } from '../../util/retry';
import AttentionBlock from '../../components/AttentionBlock';
import Listing from '../../components/JustImageListing';

export default class Related extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      related: []
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.link) {
      this.fetchRelated(nextProps.link);
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.state.loading !== nextState.loading;
  }

  async fetchRelated(link) {
    try {
      const response = await asyncRetry(() => axios.get(`/blogs/related/${link}`));
      this.setState({ related: response.data, loading: false });
    } catch(e) {
      console.log(e);
    }
  }

  renderContent() {
    const { related } = this.state;

    return (
      <AttentionBlock
        title="Related"
        containerClassName="blog_related"
        contentClassName="blog_related-listings"
      >
        {related.map((listing, index) => <Listing key={index} listing={listing}/>)}
      </AttentionBlock>
    );
  }

  render() {
    const { loading } = this.state;

    return loading ? null : this.renderContent();
  }
}
