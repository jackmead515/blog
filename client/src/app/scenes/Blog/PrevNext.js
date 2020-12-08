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
    return (
      <div className="blog_prevnext">
        {this.renderPrev()}
        {this.renderNext()}
      </div>
    );
  }
}
