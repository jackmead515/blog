const route = require('express').Router();

const blogs = require('../../brokers/blogs');
const stats = require('../../brokers/stats');

function validateName(req, res, next) {
  const { name } = req.params;

  if (name.match(/\W(?<!\-)/g) === null && blogs.blogExists(name)) {
    return next();
  } else {
    return res.status(400).send('Invalid name');
  }
}

async function fetchData(req, res, next) {
  const { name } = req.params;
  try {
    const info = await blogs.fetchBlogInfo(name);
    const data = await blogs.fetchBlogList();
    req.blog = await blogs.fetchBlog(name);

    const prev = data[info.meta.index-1];
    const nextt = data[info.meta.index+1];
    if (prev) {
      req.blog.head.prev = prev.head;
    }
    if (nextt) {
      req.blog.head.next = nextt.head;
    }

    stats.saveHistoricView(name);
    stats.saveViewCount(name);
    
    return next();
  } catch(e) {
    console.log('FAILED GET BLOG', e);
    return res.status(400).send('Failed to fetch blog');
  }
}

route.get('/:name', [validateName, fetchData], function(req, res) {
  return res.status(200).send(req.blog);
});

module.exports = route;