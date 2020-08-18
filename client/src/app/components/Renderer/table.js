import React from 'react';
import { count, component } from './index';
import Table from '../Table';

/*
  {
    type: 'table',
    props: {
      headings: [ ... ]
    }
    contents: [ ... ]
  }
*/
export function createTable(item) {
  return React.createElement(
    Table,
    {
      headings: item.props.headings,
      key: count()
    },
    item.contents.map(component)
  );
}