
const config = require('../config');

function forceSSL(req, res, next) {
  if (req.headers['x-forwarded-proto'] !== 'https') {
    return res.redirect(301, `${config.domain}${req.url}`);
  }

  return next();
}

module.exports = {
  forceSSL
}