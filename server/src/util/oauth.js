const { google } = require('googleapis');
const { googleOAuth } = require('../config');

const SCOPES = [
  'https://www.googleapis.com/auth/spreadsheets.readonly',
  'https://www.googleapis.com/auth/gmail.send'
];

async function getGoogleOAuthClient() {
  const client = new google.auth.OAuth2(
    googleOAuth.clientId,
    googleOAuth.secret,
    googleOAuth.redirectURL
  );

  const jwt = new google.auth.JWT(
    googleOAuth.serviceEmail,
    null,
    googleOAuth.serviceKey.replace(/\\n/g, '\n'),
    SCOPES
  );

  const token = await jwt.authorize();

  client.setCredentials({
    access_token: token.access_token
  });

  return client;
}

module.exports = {
  getGoogleOAuthClient
}