const express = require('express');
const route = require('express').Router();

const images = require('../../brokers/images');

async function fetchData(req, res, next) {
  try {
    req.images = await images.fetchImageList();
    return next();
  } catch(e) {
    console.log('FAILED LIST IMAGES', e);
    return res.status(500).send('Internal Server Error');
  }
}

route.get('/', fetchData, function(req, res) {
  return res.status(200).send(req.images);
});

module.exports = route;