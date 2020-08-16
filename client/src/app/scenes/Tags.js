import React, { Component } from 'react'
import axios from 'axios';

import { asyncRetry } from '../util/retry';
import AttentionBlock from '../components/AttentionBlock';
import Tag from '../components/Tag';

export default class Tags extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tags: [],
      loading: true
    }
  }

  componentDidMount() {
    this.fetchTags();
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.state.loading !== nextState.loading;
  }

  async fetchTags() {
    try {
      const response = await asyncRetry(() => axios.get('/tags/top?number=20'));
      this.setState({ tags: response.data, loading: false });
    } catch(e) {
      console.log(e);
    }
  }

  renderLoading() {
    return null;
  }

  renderContent() {
    const { mobile } = this.props;
    const { tags } = this.state;

    return (
      <AttentionBlock
        defaultClosed={mobile ? true : false}
        title="Top Tags"
        containerClassName="home_tags"
        contentClassName="home_tag-listings"
      >
        {tags.map((tag, i) => <Tag key={i} count={tag.count} tag={tag.tag}/>)}
      </AttentionBlock>
    )
  }

  render() {
    const { loading } = this.state;
    return loading ? this.renderLoading() : this.renderContent();
  }
}
