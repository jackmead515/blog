const route = require('express').Router();

const blogs = require('../../brokers/blogs');

async function fetchData(req, res, next) {
  try {
    req.result = await blogs.fetchPopular();
    return next();
  } catch(e) {
    console.log('FAILED GET POPULAR', e);
    return res.status(500).send('Internal Server Error');
  }
}

route.get('/', [fetchData], function(req, res) {
  return res.status(200).send(req.result);
});

module.exports = route;