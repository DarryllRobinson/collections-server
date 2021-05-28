'use strict';
const sql = require('../config/db');

const Outcomes = function (outcomes) {
  this.createdDate = new Date();
};

Outcomes.getAllOutcomesForCase = function (caseId, result) {
  //console.log('caseId', caseId);
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

module.exports = Outcomes;
