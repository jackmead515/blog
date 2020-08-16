module.exports = {
  pgUser: process.env.PGUSER || 'postgres',
  pgPassword: process.env.PGPASSWORD || 'password',
  pgDatabase: process.env.PGDATABASE || 'postgres',
  pgUrl: process.env.DATABASE_URL || null,
  port: process.env.PORT || 5000,
  domain: process.env.DOMAIN || 'http://127.0.0.1:3000',
  pageSize: 20,
  secretRecaptchaKey: process.env.REPCAPTCHA || '6LfLP8oUAAAAAKwu-4Eb4ZRwY7XrEZS1K6quv5iC',
  forwardEmail: process.env.FORWARD_EMAIL || '',
  googleOAuth: {
    clientId: process.env.GOOGLE_OAUTH_CLIENT_ID || '',
    secret: process.env.GOOGLE_OAUTH_SECRET || '',
    redirectURL: process.env.GOOGLE_OAUTH_REDIRECT || '',
    serviceEmail: process.env.GOOGLE_SERVICE_EMAIL || '',
    serviceKey: process.env.GOOGLE_SERVICE_KEY || ''
  },
  googleSheets: {
    bookList: process.env.GOOGLE_BOOK_LIST || ''
  },
  autoFarm: {
    ingestToken: process.env.AUTO_FARM_TOKEN || '',
  }
}