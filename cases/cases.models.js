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

  await bulkUpdate('cases', arr, caseId, function (err, res) {
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
    case 'cases':
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
  let sqlstatement = `UPDATE cws_business.${table} SET ${values} WHERE ${identifier} = "${id}";`;
  console.log('sqlstatement: ', sqlstatement);
  await sql.query(sqlstatement, function (error, results, fields) {
    if (error) return callback(error);
    callback(null, results);
  });
}

Cases.insertNewCases = async function (casesBody, result) {
  try {
    await bulkInsert('cases', casesBody, (error, response) => {
      if (error) {
        console.log('insertNewCases error: ', error);
        error.json({
          error_code: 1,
          err_desc: error,
          data: null,
        });
      }
      console.log(`Successful insert of ${response.affectedRows} rows`);
      result(null, response);
    });
  } catch (e) {
    console.log('insertNewCases problem (e): ', e);
    return res.json({
      error_code: 1,
      err_desc: err,
      data: null,
    });
  }
};

async function bulkInsert(table, objectArray, callback) {
  let keys = [];
  let values = [];
  // check if objectArray is longer than one element
  if (objectArray.length > 1) {
    const numElements = objectArray.length;
    keys = Object.keys(objectArray[0][0]);
    //let values = [];
    for (let i = 0; i < numElements; i++) {
      let elementValues = objectArray[i].map((obj) =>
        keys.map((key) => obj[key])
      );
      //console.log('elementValues: ', elementValues[0]);
      values.push(elementValues[0]);
    }
    //console.log('values: ', values);
  } else {
    keys = Object.keys(objectArray[0]);
    //console.log('keys: ', keys);
    values = objectArray.map((obj) => keys.map((key) => obj[key]));
  }

  // replace 'NULL' with NULL
  values.map((outside) => {
    outside.forEach(function (e, i) {
      if (e === 'NULL') {
        outside[i] = null;
      }
    });
  });

  let sqlstatement =
    'INSERT INTO cws_business.' +
    table +
    ' (' +
    keys.join(', ') +
    ') VALUES ? ';
  //console.log('[values]: ', values);
  //console.log('sqlstatement: ', sqlstatement);
  await sql.query(sqlstatement, [values], function (error, results, fields) {
    console.log('results: ', results);
    if (error) return callback(error);
    callback(null, results);
  });
}

module.exports = Cases;
