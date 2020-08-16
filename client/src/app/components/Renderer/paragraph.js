import React from 'react';
import { count, component } from './index';

/*
  {
    type: 'p',
    props: {
      embed: true or false
    }
    contents: [ ... ] or '...'
  }
*/
export function createParagraph(item) {
  if (Array.isArray(item.contents)) {
    return <p key={count()}>{item.contents.map(component)}</p>
  } else if (typeof item.contents === 'string') {
    if (item.props && item.props.embed) {
      return <p key={count()} dangerouslySetInnerHTML={{__html: item.contents }} />
    } else {
      return <p key={count()}>{item.contents}</p>
    }
  }
}