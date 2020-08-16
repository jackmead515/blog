const finviz = require('finviz');

const cache = require('./cache');

async function getStockData(ticker) {
  const cachedResult = cache.getStockData(ticker);
  if (cachedResult) {
    return cachedResult;
  }

  const data = await finviz.getStockData(ticker);
  cache.putStockData(ticker, data);
  return data;
}

module.exports = {
  getStockData,
}