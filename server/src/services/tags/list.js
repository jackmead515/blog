const route = require('express').Router();

const cache = require('../../brokers/cache');

async function fetchAllData(req, res, next) {
  try {
    req.result = await cache.getTagList();
    return next();
  } catch(e) {
    console.log('FAILED GET TAG LIST', e);
    return res.status(500).send('Internal Server Error');
  }
}

route.get('/all', [fetchAllData], function(req, res) {
  return res.status(200).send(req.result);
});

module.exports = route;