'use strict';
const sql = require('../config/db');
const config = require('../config/config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
//const moment = require('moment');

const User = function (user) {
  this.createdDate = new Date();
};

function ok(body) {
  return {
    ok: true,
    user: body,
  };
  //resolve({ ok: true, text: () => Promise.resolve(JSON.stringify(body)) })
}

function unauthorised() {
  return {
    id: 0, // For redux toolkit
    status: 401,
    text: 'Unauthorised',
  };
  //resolve({ status: 401, text: () => Promise.resolve(JSON.stringify({ message: 'Unauthorised' })) })
}

function error(message) {
  return {
    id: 0, // For redux toolkit
    status: 400,
    text: message,
  };
}

// Login a user
User.login = function (email, password, result) {
  sql.query(
    `SELECT id, email, password, firstName, surname, role
    FROM users
    WHERE email = ?;`,
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
          } else {
            const errorMessage = error('Password was incorrect');
            result(null, errorMessage);
          }
        });
      }
    }
  );
};

// List all
User.getAllUsers = function (result) {
  sql.query(
    `SELECT id, active, email, firstName, phone, role, surname FROM users;`,
    function (err, res) {
      if (err) {
        console.log('getAllUsers error: ', err);
        result(null, err);
      } else {
        //console.log('getAllUsers res: ', res);
        result(null, res);
      }
    }
  );
};

// Get one
User.getOneUser = function (userId, result) {
  console.log('userId: ', userId);
  sql.query(
    `SELECT id, active, email, firstName, phone, role, surname
    FROM users
    WHERE id = ?;`,
    userId,
    function (err, res) {
      if (err) {
        console.log('getOneUser error: ', err);
        result(null, err);
      } else {
        //console.log('getOneUser res: ', res);
        result(null, res);
      }
    }
  );
};

module.exports = User;
