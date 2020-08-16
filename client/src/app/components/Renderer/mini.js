import React from 'react';
import Minimize from '../Minimize';
import { count, component } from './index';

/*
  {
    type: 'mini',
    props: {
      title: '...',
      expanded: true, false
    }
    contents: [ ... ]
  }
*/
export function createMinimize(item) {
  return React.createElement(
    Minimize,
    { 
      title: item.props.title,
      expanded: item.props.expanded,
      key: count()
    },
    item.contents.map(component)
  );
}