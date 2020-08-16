const route = require('express').Router();

const finviz = require('../../brokers/finviz');

async function fetchData(req, res, next) {
  const { ticker } = req.params;

  try {
    req.result = await finviz.getStockData(ticker);
    return next();
  } catch(e) {
    console.log('FAILED GET STOCK DATA', e);
    return res.status(500).send('Internal Server Error');
  }
}

async function sortResult(req, res, next) {
  const data = req.result;
  const keys = Object.keys(data).sort();
  req.result = keys.map((key) => [key, data[key]]);
  return next();
}

function pluckDataType(req, res, next) {
  const { dataType } = req.params;

  const data = req.result;
  const result = { type: null, perf: null };
  const type = data[dataType];

  if (type && dataType === 'Price') {
    result.type = type;
    const perf = data['Change'];
    if (perf) {
      result.perf = perf[0] === '-' ? false : true;
    }
  }

  req.result = result;
  return next();
} 

async function sendResult(req, res) {
  return res.status(200).send(req.result);
}

route.get('/:ticker', [fetchData, sortResult, sendResult]);
route.get('/:ticker/:dataType', [fetchData, pluckDataType, sendResult]);

module.exports = route;