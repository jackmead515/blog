const express = require('express');
const path = require('path');

const compression = require('compression');
const helmet = require('helmet');
const cors = require('cors');

const router = express.Router();

const clientRoute = express.static(path.join(global.__basedir, '../resources/build'));

router.use(cors({ origin: '*' }));
router.use(compression());
router.use(express.urlencoded({ extended: true }));
router.use(express.json({ limit: '1mb' }));

router.use('/', clientRoute);
router.use('/images', clientRoute);
router.use('/plugins', clientRoute);
router.use('/about', clientRoute);
router.use('/blogs/*', clientRoute);
router.use('/tag/*', clientRoute);

router.use('/api', require('./blogs/router'));

module.exports = router;