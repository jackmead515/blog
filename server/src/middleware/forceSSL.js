const config = require('../config');

module.exports = function(req, res, next) {
  if (req.headers['x-forwarded-proto'] !== 'https') {
    return res.redirect(301, `${config.domain}${req.url}`);
  }

  return next();
}