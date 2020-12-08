const route = require('express').Router();

const blogs = require('../../brokers/blogs');
const config = require('../../config');

function validateTerm(req, res, next) {
  const { tag } = req.query;
  if (typeof tag === 'string' && tag.length >= 0 && tag.length <= 500) {
    return next();
  } 

  return res.status(400).send('Invalid Search Tag');
}

function shapeQuery(req, res, next) {
  const { tag } = req.query;

  req.tag = tag.trim()
    .replace(/\s+/g, '')
    .toLowerCase();

  return next();
}

async function fetchData(req, res, next) {
  try {
    req.blogs = await blogs.fetchBlogList();
    req.blogs = req.blogs.map(blog => blog.head);
    return next();
  } catch (e) {
    console.log('FAILED LIST BLOGS', e);
    return res.status(500).send('Internal Server Error');
  }
}

async function searchByTag(req, res, next) {
  const { blogs, tag } = req;

  req.results = blogs.filter(blog => {
    const { tags = [] } = blog;
    return tags.find(t => t.toLowerCase() === tag);
  });

  return next();
}

async function paginate(req, res, next) {
  const { number } = req.query;
  const page = Number.parseInt(number, 2);

  let results = [];
  if (page >= 0 && page <= req.results.length) {
    const start = page*config.pageSize;
    results = req.results.slice(start, start+config.pageSize);
  }
  req.results = results;

  return next();
}

route.get('/', [validateTerm, shapeQuery, fetchData, searchByTag, paginate], function(req, res) {
  return res.status(200).send(req.results);
});

module.exports = route;