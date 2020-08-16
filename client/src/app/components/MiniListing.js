import React, { Component } from 'react'
import moment from 'moment';

export default class Listing extends Component {

  shouldComponentUpdate(nextProps, nextState) {
    return this.props.listing.link !== nextProps.listing.link;
  }

  render() {
    const { listing } = this.props;
    
    return (
      <a
        href={`/blog/${listing.link}`}
        className='minilisting_container'
      >
        <div className='minilisting_info'>
          <h1>{listing.title}</h1>
          <span>{moment(listing.date*1000).format('MMM, Do YYYY')}</span>
        </div>
      </a>
    );
  }
}
