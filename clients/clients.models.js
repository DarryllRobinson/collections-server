'use strict';
const sql = require('../config/db');

const Client = function (client) {
  this.createdDate = new Date();
};

// List all
Client.getAllClients = function (result) {
  sql.query(`SELECT * FROM cws_admin.clients;`, function (err, res) {
    if (err) {
      console.log('getAllClients error: ', err);
      result(null, err);
    } else {
      //console.log('getAllClients res: ', res);
      result(null, res);
    }
  });
};

// Create
Client.addClient = function (client, result) {
  //console.log('starting createUser: ', newUser);
  const email = client.email;
  sql.query(
    `SELECT email FROM cws_admin.clients WHERE email = ?;`,
    email,
    function (err, res) {
      if (err) {
        console.log('addClient error: ', err);
        result(null, err);
      } else {
        //console.log('res.length: ', res.length);
        if (res.length > 0) {
          result(null, 'client exists');
        } else {
          //console.log('user is unique');
          sql.query(`INSERT INTO cws_admin.clients SET ?;`, client, function (
            err,
            res
          ) {
            if (err) {
              console.log('addClient error: ', err);
              result(null, err);
            } else {
              //console.log('createUser res: ', res);
              if (res.length > 0) {
                let href = '';
                switch (process.env.REACT_APP_STAGE) {
                  case 'development':
                    href = 'http://localhost:3000/';
                    break;
                  case 'production':
                    href = 'https://thesystem.co.za/';
                    break;
                  case 'sit':
                    href = 'https://sit.thesystem.co.za/';
                    break;
                  case 'uat':
                    href = 'https://uat.thesystem.co.za/';
                    break;
                  default:
                    port = 0;
                    break;
                }

                Emailer.sendEmail(
                  'creation',
                  email,
                  'Welcome to The System',
                  'Welcome to The System',
                  `
                  <p>${client.mainContact}, you have been registered as a new client on The System.</p>
                  <p>Please click <a href=${href} target="_blank">here</a> to be taken to the login page.</p>
                  <br /><br />
                  <p>The System Team</p>
                `
                );
              }
              result(null, res);
            }
          });
        }
      }
    }
  );
};

// Deactivate
Client.deactivateClient = function (clientId, result) {
  console.log('deactivateClient clientId: ', clientId);
  sql.query(
    `UPDATE cws_admin.clients SET active = 0 WHERE id = ?;`,
    clientId.clientId,
    function (err, res) {
      if (err) {
        console.log('deactivateClient error: ', err);
        result(null, err);
      } else {
        result(null, res);
      }
    }
  );
};

// Reactivate
Client.reactivateClient = function (clientId, result) {
  console.log('reactivateClient clientId: ', clientId);
  sql.query(
    `UPDATE cws_admin.clients SET active = 1 WHERE id = ?;`,
    clientId.clientId,
    function (err, res) {
      if (err) {
        console.log('reactivateClient error: ', err);
        result(null, err);
      } else {
        result(null, res);
      }
    }
  );
};

module.exports = Client;
