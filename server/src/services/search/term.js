const route = require('express').Router();

const blogs = require('../../brokers/blogs');

function validateTerm(req, res, next) {
  const { term } = req.body;
  if (typeof term === 'string' && term.length >= 0 && term.length <= 500 && term.match(/^\w+$/g)) {
    return next();
  }

  return res.status(400).send('Invalid Search Term');
}

function shapeQuery(req, res, next) {
  const { term } = req.body;
  req.query = term.trim()
    .replace(/\s+/g, ' ')
    .split(' ')
    .map((term) => term.toLowerCase());

  return next();
}

async function fetchData(req, res, next) {
  try {
    req.blogs = await blogs.fetchBlogList();
    req.blogs = req.blogs.map((blog) => blog.head);
    return next();
  } catch(e) {
    console.log('FAILED LIST BLOGS', e);
    return res.status(500).send('Internal Server Error');
  }
}

async function searchByTerm(req, res, next) {
  const { blogs, query } = req;

  req.results = blogs.filter((blog) => {
    const { title, subtitle, link, tags = []} = blog;
    return query.map((term) => {
      return title.toLowerCase().match(term) ||
        subtitle.toLowerCase().match(term) ||
        link.toLowerCase().match(term) ||
        tags.find((tag) => tag.toLowerCase().match(term));
    }).find((blog) => blog);
  });

  return next();
}

route.post('/', [validateTerm, shapeQuery, fetchData, searchByTerm], function(req, res) {
  return res.status(200).send(req.results);
});

module.exports = route;