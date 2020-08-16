import React, { Component } from 'react'
import Tag from '../../components/Tag';

export default class Tags extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true
    }

    this.renderTag = this.renderTag.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.tags) {
      this.setState({ loading: false });
    }
  }

  renderTag(tag, index) {
    return <Tag key={index} tag={tag} />
  }

  renderContent() {
    const { tags } = this.props;

    return (
      <div className="blog_tags" style={{marginTop: 10}}>
        {tags.map(this.renderTag)}
      </div>
    )
  }

  render() {
    return this.state.loading ? null : this.renderContent();
  }
}
