
const route = require('express').Router();

const stats = require('../../brokers/stats');
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
    const historic = await stats.getHistoricViews(name);
    const count = await stats.getViewCount(name);
    req.stats = { historic, count };
    return next();
  } catch(e) {
    console.log('FAILED BLOG STATS', e);
    return res.status(500).send('Internal Server Error');
  }
}

route.get('/:name', [validateName, fetchData], function(req, res) {
  return res.status(200).send(req.stats);
});

module.exports = route;