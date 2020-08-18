import React, { Component } from 'react';
import Tag from '../../components/Tag';

export default class Tags extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
    };

    this.renderTag = this.renderTag.bind(this);
  }

  componentDidUpdate() {
    if (this.state.loading && this.props.tags) {
      this.setState({ loading: false }); 
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.tags !== this.props.tags
      || nextState.loading !== this.state.loading;
  }

  renderTag(tag, index) {
    return <Tag key={index} tag={tag} />;
  }

  renderContent() {
    const { tags } = this.props;

    return (
      <div className="blog_tags">
        {tags.map(this.renderTag)}
      </div>
    );
  }

  render() {
    return this.state.loading ? null : this.renderContent();
  }
}
