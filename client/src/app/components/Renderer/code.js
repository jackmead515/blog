import React from 'react';
import Code from '../Code';
import { count, component } from './index';

/*
  {
    type: 'a',
    props: {
      source: '...',
      language: 'javascript', 'python', '...'
    }
  }
*/
export function createCode(item) {
  return React.createElement(
    Code, 
    {
      source: item.props.source,
      language: item.props.language,
      key: count()
    },
    null
  );
}