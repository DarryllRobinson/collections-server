'use strict';
const sql = require('../config/db');

const Cases = function (cases) {
  this.createdDate = new Date();
};

Cases.updateStatus = async function (caseId, caseUpdate, result) {
  //console.log('caseUpdate: ', caseUpdate);
  //console.log('caseId: ', caseId);
  let arr = [];
  arr.push(caseUpdate);

  await bulkUpdate('cws_business.cases', arr, caseId, function (err, res) {
    if (err) {
      console.error('bulkUpdate error for Cases.updateStatus error: ', err);
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
    case 'cws_business.cases':
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

module.exports = Cases;
