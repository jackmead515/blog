import React from 'react';
import { count, component } from './index';
import SlideShow from '../SlideShow';

/*
  {
    type: 'slideshow',
    props: {
      labels: [ ... ]
    },
    contents: [ ... ]
  }
*/
export function createSlideShow(item) {
  return React.createElement(
    SlideShow, 
    {
      key: count(),
      labels: item.props ? item.props.labels : null
    },
    item.contents.map(component)
  );
}