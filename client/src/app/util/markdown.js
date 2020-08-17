import hljs from 'highlight.js';
import 'highlight.js/styles/xt256.css';

export function highlightCode(elementId) {
  const content = document.getElementById(elementId);
  if (content) {
    highlightChildren(content.children);
  }
}

function highlightChildren(children) {
  for (const child of children) {
    if (child.tagName === 'PRE' && child.children[0] && child.children[0].tagName === 'CODE') {
      const codeBlock = child.children[0];
      hljs.highlightBlock(codeBlock);
    }

    if (child.children.length) {
      highlightChildren(child.children);
    }
  }
}