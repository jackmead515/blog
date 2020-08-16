const route = require('express').Router();

const sheets = require('../../brokers/sheets');

async function fetchData(req, res, next) {
  try {
    req.result = await sheets.fetchBookList('A2:C50');
    return next();
  } catch(e) {
    console.log('FAILED GET BOOK LIST', e);
    return res.status(500).send('Internal Server Error');
  }
}

route.get('/', [fetchData], function(req, res) {
  return res.status(200).send(req.result);
});

module.exports = route;