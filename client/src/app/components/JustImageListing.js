import React, { Component } from 'react'
import moment from 'moment';

import * as config from '../../config';

export default class JustImageListing extends Component {
  render() {
    const { listing } = this.props;
    return (
      <a
        className="jilisting_container"
        href={`/blog/${listing.link}`}
      > 
        <div
          className="jilisting_image"
          style={{backgroundImage: `url("${config.data.baseUrl}/${listing.image}")`}}
        />
        <div className="listing_gradient" />
        <div className="jilisting_info">
          <h1>{listing.title}</h1>
          <span>{moment(listing.date*1000).format('MMM, Do YYYY')}</span>
        </div>
      </a>
    )
  }
}
