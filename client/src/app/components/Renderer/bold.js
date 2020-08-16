import React from 'react';
import { count, component } from './index';

/*
  {
    type: 'b',
    props: {
      embed: true or false
    }
    contents: [ ... ] or '...'
  }
*/
export function createBold(item) {
  if (Array.isArray(item.contents)) {
    return (
      <b key={count()}>
        {item.contents.map(component)}
      </b>
    );
  } else if (typeof item.contents === 'string') {
    if (item.props && item.props.embed) {
      return (
        <b key={count()} dangerouslySetInnerHTML={{__html: item.contents }}>
          {item.contents}
        </b>
      );
    } else {
      return (
        <b key={count()}>
          {item.contents}
        </b>
      );
    } 
  }
}
