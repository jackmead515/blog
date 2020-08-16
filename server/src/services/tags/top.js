const route = require('express').Router();

const cache = require('../../brokers/cache');

async function fetchAllData(req, res, next) {
  try {
    req.result = await cache.getTagList();
    return next();
  } catch(e) {
    console.log('FAILED GET TOP TAG LIST', e);
    return res.status(500).send('Internal Server Error');
  }
}

async function selectTop(req, res, next) {
  const { number } = req.query;

  const count = parseInt(number);

  if (count > 0 && count <= 100) {
    req.result = req.result.slice(0, count);
  } else {
    req.result = [];
  }

  return next();
}

route.get('/', [fetchAllData, selectTop], function(req, res) {
  return res.status(200).send(req.result);
});

module.exports = route;