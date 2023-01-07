'use strict';
const sql = require('../config/db');

const Outcomes = function (outcomes) {
  this.createdDate = new Date();
};

Outcomes.getAllOutcomesForCase = function (caseId, result) {
  //console.log('outcomeId', outcomeId);
  sql.query(
    `SELECT *
    FROM cws_business.outcomes
    WHERE f_caseId = ?`,
    caseId,
    function (err, res) {
      if (err) {
        console.log('getAllOutcomesForCase error: ', err);
      } else {
        result(null, res);
      }
    }
  );
};

Outcomes.insertNewOutcome = function (outcomeBody, result) {
  sql.query(`INSERT INTO cws_business.outcomes SET ?;`, outcomeBody, function (
    err,
    res
  ) {
    if (err) {
      console.log('insertNewOutcome error: ', err);
    } else {
      res.status = 'Ok';
      result(null, res);
    }
  });
};

Outcomes.insertNewOutcomes = async function (outcomesBody, result) {
  try {
    await bulkInsert('outcomes', outcomesBody, (error, response) => {
      if (error) {
        console.log('insertNewOutcomes error: ', error);
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
    console.log('insertNewOutcomes problem (e): ', e);
    e.status = 'bulkInsert error';
    result(null, e);
    /*return res.json({
      error_code: 1,
      err_desc: err,
      data: null,
    });*/
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

module.exports = Outcomes;
