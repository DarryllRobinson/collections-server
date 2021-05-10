'use strict';
const sql = require('../config/db');

const Cases = function (cases) {
  this.createdDate = new Date();
};

Cases.updateStatus = function (newStatus, lockedDateTime, caseId, result) {
  console.log('vars: ', newStatus, lockedDateTime, caseId);
  sql.query(
    `UPDATE cws_business.cases
    SET currentStatus = ?, lockedDateTime = ?
    WHERE caseId = ?`,
    [newStatus, lockedDateTime, caseId],
    function (err, res) {
      if (err) {
        console.log('updateStatus error: ', err);
      } else {
        result(null, res);
      }
    }
  );
};

module.exports = Cases;
