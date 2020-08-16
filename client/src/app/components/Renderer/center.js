import React from 'react';
import Centered from '../Centered';
import { count, component } from './index';

/*
  {
    type: 'center',
    contents: [ ... ]
  }
*/
export function createCentered(item) {
  return React.createElement(
    Centered, 
    {
      key: count()
    },
    item.contents.map(component)
  );
}