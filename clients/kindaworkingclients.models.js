'use strict';
const sql = require('../config/db');
const Emailer = require('../emails/emails.models');

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
  console.log('starting createUser: ', client);

  const name = client.name;
  sql.query(
    `SELECT email FROM cws_admin.clients WHERE name = ?;`,
    name,
    function (err, res) {
      if (err) {
        console.log('addClient error: ', err);
        result(null, err);
      } else {
        //console.log('res.length: ', res.length);
        if (res.length > 0) {
          result(null, 'client exists');
        } else {
          console.log('user is unique');
          sql.query(`INSERT INTO cws_admin.clients SET ?;`, client, function (
            err,
            res
          ) {
            if (err) {
              console.log('addClient error: ', err);
              result(null, err);
            } else if (res.length === 1) {
              //console.log('createUser res: ', res);

              // Creating new tables

              //const { name } = client;
              const tablePrefix = name.substring(0, 6);
              let tableName = tablePrefix + 'accounts';
              console.log('Creating new table ' + tableName);

              sql.query(
                `USE cws_business; CREATE TABLE ?
                ('id' int NOT NULL AUTO_INCREMENT,'accountNumber' varchar(25) NOT NULL);`,
                tableName,
                function (err, res) {
                  if (err) {
                    console.log('Creating tables for new client error: ', err);
                    result(null, err);
                  } else {
                    console.log('New tables created: ', res);
                  }
                }
              );

              /*sql.query(`CREATE TABLE `${name}_accounts` (`id` int NOT NULL AUTO_INCREMENT,`accountNumber` varchar(25) NOT NULL,`accountName` varchar(100) NOT NULL,`openDate` datetime DEFAULT NULL,`debtorAge` int DEFAULT '0',`paymentTermDays` int DEFAULT '0',`creditLimit` decimal(10,2) DEFAULT '0.00',`totalBalance` decimal(10,2) DEFAULT '0.00',`amountDue` decimal(10,2) DEFAULT '0.00',`currentBalance` decimal(10,2) DEFAULT '0.00',`days30` decimal(10,2) DEFAULT '0.00',`days60` decimal(10,2) DEFAULT '0.00',`days90` decimal(10,2) DEFAULT '0.00',`days120` decimal(10,2) DEFAULT '0.00',`days150` decimal(10,2) DEFAULT '0.00',`days180` decimal(10,2) DEFAULT '0.00',`days180Over` decimal(10,2) DEFAULT '0.00',`paymentMethod` varchar(100) DEFAULT NULL,`paymentDueDate` int DEFAULT NULL,`debitOrderDate` int DEFAULT NULL,`lastPaymentDate` datetime DEFAULT NULL,`lastPaymentAmount` decimal(10,2) DEFAULT '0.00',`lastPTPDate` datetime DEFAULT NULL,`lastPTPAmount` decimal(10,2) DEFAULT '0.00',`accountNotes` varchar(1000) DEFAULT NULL,`accountStatus` varchar(100) NOT NULL DEFAULT 'Open',`arg` varchar(45) DEFAULT NULL,`createdDate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,`createdBy` varchar(100) NOT NULL,`updatedDate` datetime DEFAULT NULL,`updatedBy` varchar(100) DEFAULT NULL,`caseDate` datetime DEFAULT NULL,`f_customerId` varchar(25) NOT NULL, PRIMARY KEY (`id`));`, function())
               */

              // Sending welcome email

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
                client.email,
                'Welcome to The System',
                'Welcome to The System',
                `
                <p>${client.mainContact}, you have been registered as a new client on The System.</p>
                <p>Please click <a href=${href} target="_blank">here</a> to be taken to the login page.</p>
                <br /><br />
                <p>The System Team</p>
              `
              );
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
