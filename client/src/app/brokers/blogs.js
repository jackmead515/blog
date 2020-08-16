import axios from './axios';

export async function fetchBlogList() {
  const response = await axios.get('/api/blogs/list');
  return response.data;
}