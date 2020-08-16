const route = require('express').Router();

const blogs = require('../../brokers/blogs');

async function fetchData(req, res, next) {
  try {
    req.blogs = await blogs.fetchBlogList();
    req.blogs = req.blogs.map((blog) => blog.head);
    return next();
  } catch(e) {
    console.log('FAILED GET BLOGS', e);
    return res.status(500).send('Internal Server Error');
  }
}

async function selectRecent(req, res, next) {
  req.results = req.blogs.slice(0, 10);
  return next();
}

route.get('/', [fetchData, selectRecent], function(req, res) {
  return res.status(200).send(req.results);
});

module.exports = route;