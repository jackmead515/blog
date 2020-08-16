import React, { Component } from 'react'

export default class Video extends Component {
  render() {
    const { source, width, maxWidth, minWidth, height, maxHeight, minHeight } = this.props;

    return (
      <div className="video_hero" style={{ width, height, maxWidth, minWidth, maxHeight, minHeight }}>
        <iframe 
          className="video_content"
          src={source} 
          frameBorder="0" 
          allow="autoplay; encrypted-media" 
          allowFullScreen=""
        />
      </div>
    )
  }
}
