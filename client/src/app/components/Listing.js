import React, { Component } from 'react'
import moment from 'moment';

import * as config from '../../config';

export default class Listing extends Component {

  shouldComponentUpdate(nextProps, nextState) {
    return this.props.listing.link !== nextProps.listing.link;
  }

  renderDate() {
    const { date } = this.props.listing;

    const ms = date*1000;
    const str = moment(ms).format('MMM, Do YYYY');
    if (Date.now() - ms <= 604800000) {
      return (
        <span className='listing_new'>
          NEW: {str}
        </span>
      );
    }

    return <span>{str}</span>;
  }

  render() {
    const { listing, animatedTime } = this.props;

    return (
      <a
        href={`/blog/${listing.link}`}
        style={{animationDelay: animatedTime ? `${animatedTime}s` : 0}}
        className="listing_container"
      >
        <div
          className="listing_image"
          style={{backgroundImage: `url("${config.data.baseUrl}/${listing.image}")`}}
        > 
          <div className="listing_gradient" />
          <h1>{listing.title}</h1>
        </div>
        <div className='listing_info'>
          <p>{listing.description}</p>
          {this.renderDate()}
        </div>
      </a>
    );
  }
}
