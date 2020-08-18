import React, { Component } from 'react'
import moment from 'moment';

import * as config from '../../config';

export default class SideImageListing extends Component {

  shouldComponentUpdate(nextProps, nextState) {
    return this.props.listing.link !== nextProps.listing.link;
  }

  render() {
    const { listing } = this.props;
    return (
      <a
        className="silisting"
        href={`/blog/${listing.link}`}
      > 
        <div
          className="image"
          style={{backgroundImage: `url("${config.data.baseUrl}/${listing.image}")`}}
        />
        <div className="info">
          <h1>{listing.title}</h1>
          <span>{moment(listing.date*1000).format('MMM, Do YYYY')}</span>
        </div>
      </a>
    )
  }
}
