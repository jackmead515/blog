const { series, parallel } = require('gulp');

exports.buildCapSensorVis = function() {

}

exports.buildClient = function() {

}

exports.buildCovidVis = function() {

}

exports.buildD3Graphs = function() {

}

exports.buildSatTester = function() {

}

exports.createTagsList = function() {

}

exports.createRelated = function() {

}

exports.createSiteMap = function() {

}

module.exports = parallel(
  this.buildCapSensorVis,
  this.buildClient,
  this.buildCovidVis,
  this.buildD3Graphs,
  this.buildSatTester
);