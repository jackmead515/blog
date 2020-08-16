const { cache } = require('../clients/cache');

const THIRTY_SECONDS = 30;
const ONE_HOUR = 60*60;
const FIFTEEN_MINS = 15*60;
const UNLIMITED_TIME = 0;

function getBlogInfo(linkName) {
  return cache.get(`blog_info_${linkName}`);
}

function getBlogList() {
  return cache.get('blog_list');
}

function getBlogFile(key) {
  return cache.get('blog_content_' + key);
}

function putBlogFile(key, json) {
  cache.set('blog_content_' + key, json, THIRTY_SECONDS);
}

function putRelated(key, json) {
  cache.set('blog_related_' + key, json, UNLIMITED_TIME);
}

function putMostPopular(json) {
  cache.set('most_popular', json, ONE_HOUR);
}

function getMostPopular() {
  return cache.get('most_popular');
}

function getRelated(key) {
  return cache.get('blog_related_' + key);
}

function putTagList(json) {
  cache.set('tag_list', json, UNLIMITED_TIME);
}

function getTagList() {
  return cache.get('tag_list');
}

function putStockData(key, json) {
  cache.set(`stock_data_${key}`, json, FIFTEEN_MINS);
}

function getStockData(key) {
  return cache.get(`stock_data_${key}`);
}

/**
 * Retrieves the cached data for a specific spreadsheet.
 * @param {String} spreadsheetId 
 */
function getSheet(spreadsheetId) {
  return cache.get('sheet_' + spreadsheetId);
}

/**
 * Caches the data pertaining to a specific spreadsheet.
 * @param {String} spreadsheetId 
 * @param {*} data 
 */
function putSheet(spreadsheetId, data) {
  cache.set('sheet_' + spreadsheetId, data, THIRTY_SECONDS);
}

function getAutoFarmState() {
  return cache.get('auto_farm');
}

function putAutoFarmState(state) {
  return cache.set('auto_farm', state, UNLIMITED_TIME);
}


module.exports = {
  getBlogInfo,
  getBlogList,
  getBlogFile,
  putBlogFile,
  putTagList,
  getTagList,
  putRelated,
  getRelated,
  putMostPopular,
  getMostPopular,
  getSheet,
  putSheet,
  putStockData,
  getStockData,
  getAutoFarmState,
  putAutoFarmState
}
