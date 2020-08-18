import React, { Component } from 'react';
import FAIcon from 'react-fontawesome';

class Arrow extends Component {
  render() {
    const { listing, direction } = this.props;
    return (
      <a
        href={`/blog/${listing.link}`}
        className={`blog_arrow-${direction}`}
      >
        {this.props.children}
        <p>{listing.title}</p>
      </a>
    );
  }
}

export default class PrevNext extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
    };
  }

  componentDidUpdate(nextProps) {
    if (nextProps.next || nextProps.prev) {
      this.setState({ loading: false });
    }
  }

  renderPrev() {
    const { prev } = this.props;

    if (prev) {
      return (
        <Arrow listing={prev} direction="prev">
          <h2>
            <FAIcon
              style={{ marginRight: 10 }} 
              name="arrow-left"
            />
            Previous
          </h2>
        </Arrow>
      );
    }

    return <div className="blog_prevnext-prev" />;
  }

  renderNext() {
    const { next } = this.props;

    if (next) {
      return (
        <Arrow listing={next} direction="next">
          <h2 style={{ justifySelf: 'flex-end' }}>
            Next
            <FAIcon
              style={{ marginLeft: 10 }} 
              name="arrow-right"
            />
          </h2>
        </Arrow>
      );
    }

    return <div className="blog_prevnext-next"/>;
  }

  render() {
    const { loading } = this.state;

    if (!loading) {
      return (
        <div className="blog_prevnext" style={{ marginTop: 10 }}>
          {this.renderPrev()}
          {this.renderNext()}
        </div>
      );
    }

    return null;
  }
}
