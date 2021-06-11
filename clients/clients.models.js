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
      console.log('getAllClients res: ', res);
      result(null, res);
    }
  });
};

// Create
Client.addClient = function (client, result) {
  console.log('addClient client: ', client);
  sql.query(`INSERT INTO cws_admin.clients SET ?;`, client, function (
    err,
    res
  ) {
    if (err) {
      console.log('addClient error: ', err);
      result(null, err);
    } else {
      result(null, res);
    }
  });
};

module.exports = Client;
