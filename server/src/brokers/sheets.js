const google = require('../clients/google');
const cache = require('./cache');
const { googleSheets } = require('../config');
const { asyncRetry } = require('../util/retry');

/**
 * Formats google data to be compatable with
 * Renderer syntax. Skips over any row that
 * doesn't have three values. Could be errors
 * if I was currently editing the sheet.
 * @param {*} data 
 */
function formatBookList(data) {
  const values = [];
  for (let i = 0; i < data.length; i++) {
    const row = data[i];

    if (row.length === 3 && row[0].length > 0 && row[1].length > 0 && row[2].length > 0) {
      values.push({
        "type": "a", 
        "props": { "href": row[1], "target": "tab" },
        "contents": row[0] 
      }); 
      values.push(row[2]);
    }
  }

  return [{
    "type": "table",
    "props": {
      "headings": [ "Title", "My Rating" ]
    },
    "contents": values
  }]
}

async function fetchBookList(range) {
  const cachedSheet = cache.getSheet(googleSheets.bookList);
  if (cachedSheet) {
    return cachedSheet;
  }

  return await asyncRetry(async () => {
    const client = await google.getSheetsClient()

    return await new Promise((resolve, reject) => {
      client.spreadsheets.values.get({ spreadsheetId: googleSheets.bookList, range }, (err, response) => {
        if (err) {
          return reject(err);
        }
        const data = formatBookList(response.data.values);
        cache.putSheet(googleSheets.bookList, data);
        return resolve(data);
      });
    });
  });
}

module.exports = {
  fetchBookList
}