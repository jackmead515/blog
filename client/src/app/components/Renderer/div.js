import React from 'react';
import { count, component } from './index';

/*
  {
    type: 'div',
    props: {
      class: '...'
      embed: true or false
    }
    contents: [ ... ] or '...'
  }
*/
export function createDiv(item) {
  if (Array.isArray(item.contents)) {
    return (
      <div
        className={item.props ? item.props.class : null}
        key={count()}
      >
        {item.contents.map(component)}
      </div>
    )
  } else if (typeof item.contents === 'string') {
    if (item.props && item.props.embed) {
      return (
        <div
          className={item.props.class}
          key={count()} 
          dangerouslySetInnerHTML={{__html: item.contents }} 
        />
      )
    } else {
      return (
        <div
          className={item.props ? item.props.class : null}
          key={count()}
        >
          {item.contents}
        </div>
      )
    }
  }
}