const { google } = require('googleapis');
const { getGoogleOAuthClient } = require('../util/oauth');

async function getSheetsClient() {
  const oauth = await getGoogleOAuthClient();

  const sheets = google.sheets({
    version: 'v4',
    auth: oauth
  });

  return sheets;
}

async function getGmailClient() {
  const oauth = await getGoogleOAuthClient();

  const gmail = google.gmail({
    version: "v1",
    auth: oauth
  });

  return gmail;
}

module.exports = {
  getSheetsClient,
  getGmailClient
}