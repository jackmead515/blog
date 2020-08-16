const route = require('express').Router();

const blogs = require('../../brokers/blogs');

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
    const prev = data[info.meta.index-1];
    const nextt = data[info.meta.index+1];
    req.blog = info.head;
    if (prev) {
      req.blog.prev = prev.head;
    }
    if (nextt) {
      req.blog.next = nextt.head;
    }

    return next();
  } catch(e) {
    console.log('FAILED HEAD BLOG', e);
    return res.status(400).send('Failed to fetch blog');
  }
}

route.get('/:name', [validateName, fetchData], function(req, res) {
  return res.status(200).send(req.blog);
});

module.exports = route;