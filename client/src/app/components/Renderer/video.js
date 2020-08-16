import React from 'react';
import Video from '../Video';
import { count, component } from './index';

/*
  {
    type: 'video',
    props: {
      source: '...',
      width: number,
      height: number
    }
  }
*/

export function createVideo(item) {
  return React.createElement(
    Video, 
    { 
      source: item.props.source,
      width: item.props.width,
      height: item.props.height,
      key: count()
    },
    null
  );
}