import React from 'react';
import Remote from '../Remote';
import { count, component } from './index';

/*
  {
    type: 'image',
    source: '...'
  }
*/
export function createRemote(item) {
  return React.createElement(
    Remote, 
    {
      source: item.source,
      key: count()
    },
    null
  );
}