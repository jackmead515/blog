
const config = {
    DOMAIN: process.env.DOMAIN || 'http://127.0.0.1:3000',

    HTTP_PORT: process.env.PORT || 1234,

    PRODUCTION: process.env.NODE_ENV === 'production',

    POSTGRES_URL: process.env.POSTGRES_URL || 'postgres://postgres:password@localhost:54320/postgres',
}

module.exports = config;