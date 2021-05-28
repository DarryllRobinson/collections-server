'use strict';
const sql = require('../config/db');

const Accounts = function (accounts) {
  this.createdDate = new Date();
};

Accounts.updateAccount = async function (accountNumber, account, result) {
  console.log('updateAccount: ', accountNumber, account);
  let arr = [];
  arr.push(account);

  await bulkUpdate('accounts', arr, accountNumber, function (err, res) {
    if (err) {
      console.error('bulkUpdate error for Accounts.updateAccount: ', err);
      result(null, err);
    } else {
      result(null, res);
    }
  });
};

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

module.exports = Accounts;
