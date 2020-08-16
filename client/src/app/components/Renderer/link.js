import React from 'react';
import { count, component } from './index';

/*
  {
    type: 'a',
    props: {
      target: 'tab',
      href: '...',
      alt: '...'
    },
    contents: [ ... ] or '...'
  }
*/
export function createLink(item) {
  const { target, href, alt } = item.props;

  if (Array.isArray(item.contents)) {
    return (
      <a
        {...getTarget(target)}
        key={count()}
        href={href} 
        alt={alt ? alt : 'Missing Link'}
      >
        {item.contents.map(component)}
      </a>
    );
  } else {
    return (
      <a
        {...getTarget(target)}
        key={count()}
        href={href} 
        alt={alt ? alt : 'Missing Link'}
      >
        {item.contents}
      </a>
    );
  } 
}

function getTarget(target) {
  if(target === 'tab') {
    return {
      target: '_blank',
      rel: 'noopener noreferrer'
    };
  } else {
    return [];
  }
}