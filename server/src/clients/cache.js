const NodeCache = require('node-cache');
const fs = require('fs');
const path = require('path');

const UNLIMITED_TIME = 0;
const blogsPath = path.join(global.__basedir, 'blogs');
const resourcesPath = path.join(global.__basedir, 'resources');

const cache = new NodeCache({
  stdTTL: 10,
  checkperiod: 5
});

function initialize() {
  loadBlogs();
  loadTags();
  loadRelated();
}

function loadRelated() {
  const json = JSON.parse(fs.readFileSync(path.join(resourcesPath, 'related.json')));
  Object.keys(json).map((linkName) => {
    cache.set('blog_related_' + linkName, json[linkName], UNLIMITED_TIME);
  });
}

function loadTags() {
  const json = JSON.parse(fs.readFileSync(path.join(resourcesPath, 'tags.json')));
  cache.set('tag_list', json, UNLIMITED_TIME);
}

function loadBlogs() {
  const list = fs.readdirSync(blogsPath)
    .filter((file) => fs.statSync(path.join(blogsPath, file)).isFile())
    .map((file) => ({ file, data: fs.readFileSync(path.join(blogsPath, file))}))
    .map((obj) => ({ file: obj.file, data: JSON.parse(obj.data)}))
    .map((obj) => ({ file: obj.file, head: obj.data.head }));

  list.sort((a, b) => b.head.date-a.head.date);

  list
    .map((file, index) => ({ ...file, meta: { index } }))
    .map((file) => {
      cache.set(`blog_info_${file.head.link}`, file, UNLIMITED_TIME);
      return file;
    });

  cache.set('blog_list', list, UNLIMITED_TIME);
}

module.exports = {
  cache, initialize
}