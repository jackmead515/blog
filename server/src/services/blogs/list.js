const route = require('express').Router();

const config = require('../../config');
const blogs = require('../../brokers/blogs');

async function fetchAllData(req, res, next) {
  try {
    req.blogs = await blogs.fetchBlogList();
    return next();
  } catch(e) {
    console.log('FAILED LIST BLOGS', e);
    return res.status(500).send('Internal Server Error');
  }
}

async function fetchPageData(req, res, next) {
  const { number } = req.query;
  const page = parseInt(number, 2);
  
  if (page >= 0) {
    const start = page*config.pageSize;
    try {
      req.result = [];
      if (start <= req.blogs.length) {
        req.result = req.blogs
          .slice(start, start+config.pageSize)
          .map((blog) => blog.head);
      }
      return next();
    } catch(e) {
      console.log('FAILED LIST BLOGS', e);
      return res.status(500).send('Internal Server Error');
    }
  }
}

route.get('/page', [fetchAllData, fetchPageData], function(req, res) {
  return res.status(200).send(req.result);
});

module.exports = route;