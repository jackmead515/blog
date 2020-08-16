const route = require('express').Router();

const config = require('../../config');
const cache = require('../../brokers/cache');

const denyList = {};

function checkIP(req, res, next) {
  const ipAddress = req.connection.remoteAddress;

  if (denyList[ipAddress] === false) {
    return res.status(400).send('NO.');
  }

  return next();
}

function checkToken(req, res, next) {
  const ipAddress = req.connection.remoteAddress;
  const { token } = req.body;

  if (token !== config.autoFarm.ingestToken) {
    denyList[ipAddress] = false;
    return res.status(400).send('NO.');
  }

  return next();
}

function updateCache(req, res) {
  const { state } = req.body;

  cache.putAutoFarmState(state);

  return res.status(200).end();
}

route.put('/ingest', [checkIP, checkToken, updateCache]);

module.exports = route;