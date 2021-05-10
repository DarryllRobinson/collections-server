const expressJwt = require('express-jwt');
const config = require('../config/config.json');

module.exports = jwt;

function jwt() {
  const { secret } = config.secret;
  return expressJwt({ secret, algorithms: ['HS256'] }).unless({
    path: [
      // public routes that don't require authentication
      '/api/users/login',
    ],
  });
}

// [/^\/api\/members\/confirm\/.*/]
