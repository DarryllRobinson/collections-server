'use strict';
const sql = require('../config/db');

const Collections = function (collections) {
  this.createdDate = new Date();
};

Collections.getTopFiveRecords = function (result) {
  sql.query(
    `SELECT caseId as id, caseNumber, amountDue, accountNumber, caseNotes, currentAssignment, currentBalance, customerName, debtorAge, nextVisitDateTime, regIdNumber, resolution, totalBalance, cases.updatedBy, cases.updatedDate
    FROM cws_business.customers, cws_business.accounts, cws_business.cases
    WHERE customers.customerRefNo = accounts.f_customerId
    AND accounts.accountNumber = cases.f_accountNumber;`,
    function (err, res) {
      if (err) {
        console.log('getTopFiveRecords error: ', err);
      } else {
        result(null, res);
      }
    }
  );
};

Collections.getCollection = function (caseId, result) {
  sql.query(
    `SELECT caseId as id, caseNumber, amountDue, accountNotes, accountNumber, accountStatus, caseNotes, creditLimit, currentAssignment, currentBalance, currentStatus, customerEntity, customerName, days30, days60, days90, days120, days150, days180, days180Over, debtorAge, debitOrderDate, kamNotes, lastPaymentAmount, lastPaymentDate, lastPTPAmount, lastPTPDate, nextVisitDateTime, paymentDueDate, pendReason, regIdNumber, regIdStatus, resolution, representativeName, representativeNumber, totalBalance, cases.updatedBy, cases.updatedDate
    FROM cws_business.customers, cws_business.accounts, cws_business.cases, cws_business.contacts
    WHERE customers.customerRefNo = accounts.f_customerId
    AND accounts.accountNumber = cases.f_accountNumber
    AND contacts.f_accountNumber = accounts.accountNumber
    AND caseId = ?;`,
    caseId,
    function (err, res) {
      if (err) {
        console.log('getCollection error: ', err);
      } else {
        result(null, res);
      }
    }
  );
};

// Update
Collections.updateOne = async function (table, clientId, id, model, result) {
  console.log('updateOne table: ', table);
  console.log('updateOne clientId: ', clientId);
  console.log('updateOne id: ', id);
  console.log('updateOne model: ', model);
  let arr = [];
  arr.push(model);

  await bulkUpdate(table, arr, id, function (err, res) {
    if (err) {
      console.log('updateOne error: ', err);
      result(null, err);
    } else {
      result(null, res);
    }
  });
};

// Function to update a json object without having to worry about the columns and values
// I have no idea why this isn't an out of the box function but there you have it...
// It's probably widely insecure but I'll look into that later
async function bulkUpdate(table, objectArray, id, callback) {
  let keys = Object.keys(objectArray[0]);
  let values = [];
  objectArray.map((obj) =>
    keys.map((key) => {
      if (key !== 'id') {
        if (obj[key] === 'NULL') obj[key] = null;
        obj[key] = ` ${key} = "${obj[key]}"`;
      }
      values.push(obj[key]);
    })
  );

  // determining which identifier to use based on the table name
  let identifier = '';
  switch (table) {
    case 'customers':
      identifier = 'customerRefNo';
      break;
    case 'accounts':
      identifier = 'accountNumber';
      break;
    case 'contacts':
      identifier = 'f_accountNumber';
      break;
    case 'cases':
      identifier = 'caseId';
      break;
    default:
      identifier = 'id';
      break;
  }

  // UPDATE {table} SET colname = ?, ...    WHERE id = ?;
  let sqlstatement = `UPDATE ${table} SET ${values} WHERE ${identifier} = "${id}";`;
  console.log('sqlstatement: ', sqlstatement);
  await sql.query(sqlstatement, function (error, results, fields) {
    if (error) return callback(error);
    callback(null, results);
  });
}

module.exports = Collections;
