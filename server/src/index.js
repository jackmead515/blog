
global.__basedir = __dirname;

const express = require('express');
const http = require('http');

const config = require('./config');
const forceSSL = require('./middleware/forceSSL');

const cacheClient = require('./clients/cache');
const postgres = require('./clients/postgres');

async function run() {

    cacheClient.initialize();

    await postgres.initialize();

    const app = express();
    const server = http.Server(app);

    if (config.PRODUCTION) {
        app.use(forceSSL);
    }

    app.disable('x-powered-by');

    const controllers = require('./controllers');

    app.use('/', controllers);

    server.listen(config.HTTP_PORT, () => console.log('Server started on port: ' + config.HTTP_PORT));
}

run();