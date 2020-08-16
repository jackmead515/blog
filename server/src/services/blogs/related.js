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
    const related = await blogs.fetchRelated(name);

    if (related && related.length) {
      req.results = await Promise.all(
        related.slice(0, 6).map(async (arr) => {
          const info = await blogs.fetchBlogInfo(arr[0]);
          return info.head;
        })
      );
    } else {
      req.results = [];
    }
  
    return next();
  } catch(e) {
    console.log('FAILED GET RELATED', e);
    return res.status(500).send('Internal Server Error');
  }
}

route.get('/:name', [validateName, fetchData], function(req, res) {
  return res.status(200).send(req.results);
});

module.exports = route;