const express = require('express');
const router = express.Router();

router.get('/blogs', require('./list'));

router.get('/blogs/:id', require('./get'));

router.get('/blogsSearch', require('./search'));

router.get('/blogsTagged/:id', require('./tagged'));

router.get('/blogsStats/:id', require('./stats'));

router.get('/blogsRelated/:id', require('./related'));


module.exports = router;