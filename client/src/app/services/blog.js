import axios from 'axios';
import { asyncRetry } from '../util/retry';

import Renderer from '../components/Renderer';

export async function getBlog(source) {
  const response = await asyncRetry(() => axios.get(source));
  const { contents, head } = response.data;
  const result = { contents, head };

  if (!head.markdown) {
    const components = Renderer.build(contents);
    result.contents = components;
  }

  return result;
}

export async function getBlogList() {
  const response = await axios.get('/api/blogs/list');
  return response.data;
}