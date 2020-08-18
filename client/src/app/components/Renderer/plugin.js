import React from 'react';
import Plugin from '../Plugin';
import { count, component } from './index';

/*
  {
    type: 'image',
    props: {
      source: '...'
    }
  }
*/
export function createPlugin(item) {
  return React.createElement(
    Plugin, 
    {
      id: item.props.id,
      source: item.props.source,
      width: item.props.width,
      height: item.props.height,
      key: count()
    },
    null
  );
}