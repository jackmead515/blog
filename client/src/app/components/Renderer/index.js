import React from 'react';
import { createParagraph } from './paragraph.js';
import { createBold } from './bold.js';
import { createLink } from './link.js';
import { createCode } from './code.js';
import { createMinimize } from './mini.js';
import { createCentered } from './center.js';
import { createImage } from './image.js';
import { createVideo } from './video.js';
import { createDiv } from './div.js';
import { createSlideShow } from './slideshow.js';
import { createPlugin } from './plugin';
import { createTable } from './table.js';
import { createRemote } from './remote.js';

let keyIdentifier = 0;

export function count() {
  keyIdentifier+=1;
  return keyIdentifier;
}

// eslint-disable-next-line complexity
export function component(item) {
  switch (item.type) {
    case 'p': return createParagraph(item);
    case 'b': return createBold(item);
    case 'a': return createLink(item);
    case 'div': return createDiv(item);
    case 'code': return createCode(item);
    case 'mini': return createMinimize(item);
    case 'table': return createTable(item);
    case 'center': return createCentered(item);
    case 'image': return createImage(item);
    case 'video': return createVideo(item);
    case 'slideshow': return createSlideShow(item);
    case 'plugin': return createPlugin(item);
    case 'remote': return createRemote(item);
    default: {
      if (typeof item === 'string') {
        return <div key={count()}>{item}</div>;
      }
    }
  }
}

export function build(data) {
  if (!Array.isArray(data)) {
    throw new Error('Data is not an array.');
  }
  keyIdentifier = 0;
  return data.map(component);
}

export default {
  build,
  component,
  count,
};