'use strict';
const sql = require('../config/db');
const config = require('../config/config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
//const moment = require('moment');

const User = function (user) {
  this.createdDate = new Date();
};

// Login a user
User.login = function (email, password, result) {
  sql.query(
    `SELECT id, email, password, firstName, surname, role
    FROM users
    WHERE email = ?
    AND isVerified = TRUE;`,
    email,
    function (err, res) {
      if (err) {
        const errorMessage = error('login user error at SELECT');
        result(null, errorMessage);
      } else if (res.length === 0) {
        const errorMessage = error('User not found');
        result(null, errorMessage);
      } else {
        bcrypt.compare(password, res[0].password, function (err, match) {
          if (match) {
            const user = {
              id: res[0].id,
              email: res[0].email,
              firstName: res[0].firstName,
              surname: res[0].surname,
              role: res[0].role,
            };

            const token = jwt.sign(user, config.secret, {
              expiresIn: config.tokenLife,
            });
            const refreshToken = jwt.sign(user, config.refreshTokenSecret, {
              expiresIn: config.refreshTokenLife,
            });

            const response = ok([
              {
                id: res[0].id,
                status: 'Logged in',
                token: token,
                refreshToken: refreshToken,
              },
            ]);

            result(null, response);
          } else {
            /*  if (match) {
            const d = new Date();
            const calculatedExpiresIn = d.getTime() + 60 * 60 * 1000;
            const iat = d.getTime();

            const user = ok([
              {
                id: res[0].id,
                token: jwt.sign(
                  {
                    id: res[0].id,
                    email: res[0].email,
                    firstName: res[0].firstName,
                    surname: res[0].surname,
                    role: res[0].role,
                    iat: iat,
                    expiry: calculatedExpiresIn,
                  },
                  config.secret,
                  {
                    expiresIn: calculatedExpiresIn,
                  }
                ),
              },
            ]);

            result(null, user);
          }*/
            const errorMessage = error('Password was incorrect');
            result(null, errorMessage);
          }
        });
      }
    }
  );
};

module.exports = User;
