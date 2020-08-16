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

async function selectRandom(req, res, next) {
  const max = req.blogs.length-1;
  const numbers = [];

  while(numbers.length < 3) {
    const random = Math.floor(Math.random()*(max + 1));

    if (numbers.find((v) => v === random)) {
      continue;
    } else {
      numbers.push(random);
    }
  }

  req.results = numbers.map((v) => req.blogs[v]);

  return next();
}

route.get('/', [fetchData, selectRandom], function(req, res) {
  return res.status(200).send(req.results);
});

module.exports = route;