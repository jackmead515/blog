global.__basedir = __dirname

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const compression = require('compression');
const postgres = require('./clients/postgres');
const cache = require('./clients/cache');
const services = require('./services');
const config = require('./config');
const { forceSSL } = require('./mw/forceSSL');
const { staticFile } = require('./mw/staticFile');

const sitemapPath = path.join(global.__basedir, 'resources/sitemap.xml');
const robotsPath = path.join(global.__basedir, 'resources/robots.txt');
const imageRoute = express.static(path.join(global.__basedir, 'images'))
const clientRoute = express.static(path.join(global.__basedir, 'build/client'));
const satTesterRoute = express.static(path.join(global.__basedir, 'build/sat-tester'));
const capSensorVisRoute = express.static(path.join(global.__basedir, 'build/cap-sensor-vis'));
const d3GraphsRoute = express.static(path.join(global.__basedir, 'build/d3-graphs'));
const covidRoute = express.static(path.join(global.__basedir, 'build/covid-vis'));
const widgeterRoute = express.static(path.join(global.__basedir, 'build/widgeter'));

const app = express();

if (process.env.NODE_ENV === 'production') {
  app.use(forceSSL);
}
app.use(cors({ origin: '*' }));
app.use(compression());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: '1mb' }));
app.use('/', clientRoute);
app.use('/sitemap.xml', staticFile(sitemapPath));
app.use('/robots.txt', staticFile(robotsPath));
app.use('/about', clientRoute);
app.use('/gallery', clientRoute);
app.use('/contact', clientRoute);
app.use('/plugins', clientRoute);
app.use('/blog/*', clientRoute);
app.use('/tag/*', clientRoute);
app.use('/plugin/sat-tester', satTesterRoute);
app.use('/plugin/capacitor-sensor', capSensorVisRoute);
app.use('/plugin/d3-graphs', d3GraphsRoute);
app.use('/plugin/covid19', covidRoute);
app.use('/plugin/widgeter', widgeterRoute);
app.use('/image', imageRoute);
app.use('/contact_me', services.contact);
app.use('/images/list', services.images.list);
app.use('/blogs/list', services.blogs.list);
app.use('/blogs/get', services.blogs.get);
app.use('/blogs/head', services.blogs.head);
app.use('/blogs/stats', services.blogs.stats);
app.use('/blogs/random', services.blogs.random);
app.use('/blogs/recent', services.blogs.recent);
app.use('/blogs/popular', services.blogs.popular);
app.use('/blogs/related', services.blogs.related);
app.use('/search/term', services.search.term);
app.use('/search/tag', services.search.tag);
app.use('/tags/list', services.tags.list);
app.use('/tags/top', services.tags.top);
app.use('/lists/books', services.lists.books);
app.use('/lists/stocks', services.lists.stocks);
app.use('/farm/ingest', services.farm.ingest);

Promise.all([postgres.initialize(), cache.initialize()])
  .then(() => {
    app.listen(config.port, () => console.log('Server started on port: ' + config.port));
  })
  .catch((err) => {
    console.log('FAILED TO CREATE TABLE', err);
    process.exit();
  });