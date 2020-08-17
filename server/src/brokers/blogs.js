const cache = require('./cache');
const stats = require('./stats');
const path = require('path');
const fs = require('fs');

const blogsPath = path.join(global.__basedir, 'blogs/json');

function blogExists(linkName) {
  return cache.getBlogInfo(linkName) !== null;
}

async function fetchBlogInfo(linkName) {
  return cache.getBlogInfo(linkName);
}

async function fetchRelated(linkName) {
  return cache.getRelated(linkName);
}

async function fetchPopular() {
  const cachedResult = cache.getMostPopular();

  if (cachedResult) {
    return cachedResult;
  }

  const popular = await stats.mostPopular();
  const list = await Promise.all(popular.map((row) => fetchBlogInfo(row.name)));
  const result = list
    .filter((blog) => blog.head && blogExists(blog.head.link))
    .map((blog) => blog.head);
  cache.putMostPopular(result);
  return result;
}

async function fetchBlog(linkName) {
  const cachedResult = cache.getBlogFile(linkName);

  if (cachedResult) {
    return cachedResult;
  }

  const blogInfo = cache.getBlogInfo(linkName);
  const filePath = path.join(blogsPath, blogInfo.file);
  const data = fs.readFileSync(filePath);
  const json = JSON.parse(data);
  cache.putBlogFile(linkName, json);

  return json;
}

async function fetchBlogList() {
  return cache.getBlogList();
}

module.exports = {
  blogExists,
  fetchBlog,
  fetchBlogList,
  fetchBlogInfo,
  fetchRelated,
  fetchPopular
};