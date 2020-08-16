import React from 'react';
import Image from '../Image';
import { count, component } from './index';

/*
  {
    type: 'image',
    props: {
      source: '...'
    }
  }
*/
export function createImage(item) {
  return React.createElement(
    Image, 
    { 
      source: item.props.source,
      width: item.props.width,
      height: item.props.height,
      maxWidth: item.props.maxWidth,
      maxHeight: item.props.maxHeight,
      zoomable: item.props.zoomable,
      key: count()
    },
    null
  );
}